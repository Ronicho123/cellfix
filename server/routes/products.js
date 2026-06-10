const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.all('SELECT * FROM productos WHERE estado = "activo" ORDER BY nombre', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(row);
  });
});

// Crear nuevo producto
router.post('/', (req, res) => {
  const { nombre, descripcion, categoria, precio_costo, precio_venta, sku } = req.body;

  if (!nombre || !precio_costo || !precio_venta) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const id = uuidv4();
  const query = `
    INSERT INTO productos (id, nombre, descripcion, categoria, precio_costo, precio_venta, sku)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [id, nombre, descripcion, categoria, precio_costo, precio_venta, sku], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, nombre, descripcion, categoria, precio_costo, precio_venta, sku });
  });
});

// Actualizar producto
router.put('/:id', (req, res) => {
  const { nombre, descripcion, categoria, precio_costo, precio_venta } = req.body;
  const query = `
    UPDATE productos 
    SET nombre = ?, descripcion = ?, categoria = ?, precio_costo = ?, precio_venta = ?, actualizado_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [nombre, descripcion, categoria, precio_costo, precio_venta, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// Eliminar producto (marcar como inactivo)
router.delete('/:id', (req, res) => {
  db.run('UPDATE productos SET estado = "inactivo" WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

module.exports = router;
