const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Crear venta
router.post('/', (req, res) => {
  const { cliente_nombre, cliente_telefono, items, metodo_pago, presupuesto_id } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Debe agregar al menos un producto' });
  }

  const ventaId = uuidv4();
  let subtotal = 0;

  // Calcular subtotal
  items.forEach(item => {
    subtotal += item.subtotal;
  });

  const impuesto = subtotal * 0.21;
  const total = subtotal + impuesto;

  // Iniciar transacción
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Insertar venta
    const queryVenta = `
      INSERT INTO ventas (id, cliente_nombre, cliente_telefono, subtotal, impuesto, total, metodo_pago, presupuesto_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(queryVenta, [ventaId, cliente_nombre, cliente_telefono, subtotal, impuesto, total, metodo_pago, presupuesto_id], (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }

      // Insertar items y actualizar stock
      let itemsProcessed = 0;
      let stockError = false;

      items.forEach(item => {
        const itemId = uuidv4();

        // Insertar item de venta
        db.run(
          `INSERT INTO venta_items (id, venta_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [itemId, ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal],
          (err) => {
            if (err) {
              stockError = true;
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }

            // Actualizar stock
            db.run(
              'UPDATE stock SET cantidad_actual = cantidad_actual - ?, ultimo_movimiento = CURRENT_TIMESTAMP WHERE producto_id = ?',
              [item.cantidad, item.producto_id],
              (err) => {
                if (err) {
                  stockError = true;
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: err.message });
                }

                // Registrar movimiento de stock
                const movId = uuidv4();
                db.run(
                  'INSERT INTO movimientos_stock (id, producto_id, tipo, cantidad, razon) VALUES (?, ?, ?, ?, ?)',
                  [movId, item.producto_id, 'VENTA', item.cantidad, `Venta #${ventaId.substring(0, 8)}`]
                );

                itemsProcessed++;

                // Si todos los items fueron procesados exitosamente
                if (itemsProcessed === items.length && !stockError) {
                  db.run('COMMIT', (err) => {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: err.message });
                    }

                    // Verificar alertas de stock bajo
                    verificarAlertasStockBajo(items);

                    res.status(201).json({ 
                      id: ventaId, 
                      subtotal, 
                      impuesto, 
                      total,
                      fecha_venta: new Date()
                    });
                  });
                }
              }
            );
          }
        );
      });
    });
  });
});

// Obtener ventas
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM ventas ORDER BY fecha_venta DESC LIMIT 100',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Obtener venta con detalles
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM ventas WHERE id = ?', [req.params.id], (err, venta) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Obtener items
    db.all(
      `SELECT vi.*, p.nombre FROM venta_items vi
       JOIN productos p ON vi.producto_id = p.id
       WHERE vi.venta_id = ?`,
      [req.params.id],
      (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ ...venta, items });
      }
    );
  });
});

// Función para verificar alertas de stock bajo
function verificarAlertasStockBajo(items) {
  items.forEach(item => {
    db.get(
      'SELECT * FROM stock WHERE producto_id = ?',
      [item.producto_id],
      (err, stock) => {
        if (err || !stock) return;

        if (stock.cantidad_actual <= stock.stock_minimo) {
          const alertaId = uuidv4();
          db.run(
            `INSERT INTO alertas (id, producto_id, tipo, mensaje)
             VALUES (?, ?, ?, ?)`,
            [alertaId, item.producto_id, 'STOCK_BAJO', `Stock bajo: ${stock.cantidad_actual} unidades`]
          );
        }
      }
    );
  });
}

module.exports = router;
