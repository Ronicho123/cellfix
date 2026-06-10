const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Obtener stock de todos los productos
router.get('/', (req, res) => {
  const query = `
    SELECT s.*, p.nombre, p.precio_venta, p.categoria
    FROM stock s
    JOIN productos p ON s.producto_id = p.id
    ORDER BY p.nombre
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener stock de un producto
router.get('/producto/:producto_id', (req, res) => {
  db.get('SELECT * FROM stock WHERE producto_id = ?', [req.params.producto_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Cargar stock inicial
router.post('/cargar', (req, res) => {
  const { producto_id, cantidad, stock_minimo } = req.body;

  if (!producto_id || !cantidad) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO stock (id, producto_id, cantidad_inicial, cantidad_actual, stock_minimo)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [id, producto_id, cantidad, cantidad, stock_minimo || 5], (err) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'El producto ya tiene stock registrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    // Registrar movimiento
    registrarMovimiento(producto_id, 'CARGA', cantidad, 'Carga inicial de stock');
    
    res.status(201).json({ success: true, id });
  });
});

// Ajustar stock (manualmente)
router.post('/ajustar', (req, res) => {
  const { producto_id, cantidad, razon } = req.body;

  if (!producto_id || !cantidad) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  db.get('SELECT cantidad_actual FROM stock WHERE producto_id = ?', [producto_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Stock no encontrado' });
    }

    const nuevaCantidad = row.cantidad_actual + cantidad;

    db.run(
      'UPDATE stock SET cantidad_actual = ?, ultimo_movimiento = CURRENT_TIMESTAMP WHERE producto_id = ?',
      [nuevaCantidad, producto_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Registrar movimiento
        const tipo = cantidad > 0 ? 'AJUSTE_AUMENTO' : 'AJUSTE_DISMINUCION';
        registrarMovimiento(producto_id, tipo, Math.abs(cantidad), razon || 'Ajuste manual de stock');

        res.json({ success: true, nueva_cantidad: nuevaCantidad });
      }
    );
  });
});

// Obtener movimientos de stock
router.get('/movimientos/:producto_id', (req, res) => {
  db.all(
    'SELECT * FROM movimientos_stock WHERE producto_id = ? ORDER BY creado_at DESC LIMIT 50',
    [req.params.producto_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Función auxiliar para registrar movimientos
function registrarMovimiento(producto_id, tipo, cantidad, razon) {
  const id = uuidv4();
  db.run(
    'INSERT INTO movimientos_stock (id, producto_id, tipo, cantidad, razon) VALUES (?, ?, ?, ?, ?)',
    [id, producto_id, tipo, cantidad, razon]
  );
}

module.exports = router;
