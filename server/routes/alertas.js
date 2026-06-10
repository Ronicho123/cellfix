const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Obtener alertas
router.get('/', (req, res) => {
  const query = `
    SELECT a.*, p.nombre, s.cantidad_actual, s.stock_minimo
    FROM alertas a
    JOIN productos p ON a.producto_id = p.id
    LEFT JOIN stock s ON p.id = s.producto_id
    WHERE a.leida = 0
    ORDER BY a.creada_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Marcar alerta como leída
router.put('/:id/leer', (req, res) => {
  db.run('UPDATE alertas SET leida = 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Obtener productos con stock bajo
router.get('/bajo', (req, res) => {
  const query = `
    SELECT s.*, p.nombre, p.categoria, p.precio_venta
    FROM stock s
    JOIN productos p ON s.producto_id = p.id
    WHERE s.cantidad_actual <= s.stock_minimo
    ORDER BY s.cantidad_actual ASC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Configurar umbral de stock mínimo
router.put('/configurar/:producto_id', (req, res) => {
  const { stock_minimo } = req.body;

  if (stock_minimo === undefined) {
    return res.status(400).json({ error: 'stock_minimo es requerido' });
  }

  db.run(
    'UPDATE stock SET stock_minimo = ? WHERE producto_id = ?',
    [stock_minimo, req.params.producto_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
