const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Crear presupuesto
router.post('/', (req, res) => {
  const { cliente_nombre, cliente_email, cliente_telefono, items, notas } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Debe agregar al menos un producto' });
  }

  const id = uuidv4();
  let subtotal = 0;

  // Calcular subtotal
  items.forEach(item => {
    subtotal += item.subtotal;
  });

  const impuesto = subtotal * 0.21; // IVA 21%
  const total = subtotal + impuesto;

  const query = `
    INSERT INTO presupuestos (id, cliente_nombre, cliente_email, cliente_telefono, subtotal, impuesto, total, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [id, cliente_nombre, cliente_email, cliente_telefono, subtotal, impuesto, total, notas], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insertar items
    items.forEach(item => {
      const itemId = uuidv4();
      db.run(
        `INSERT INTO presupuesto_items (id, presupuesto_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [itemId, id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
      );
    });

    res.status(201).json({ id, subtotal, impuesto, total });
  });
});

// Obtener presupuesto
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM presupuestos WHERE id = ?', [req.params.id], (err, presupuesto) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    // Obtener items
    db.all(
      `SELECT pi.*, p.nombre, p.categoria 
       FROM presupuesto_items pi
       JOIN productos p ON pi.producto_id = p.id
       WHERE pi.presupuesto_id = ?`,
      [req.params.id],
      (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ ...presupuesto, items });
      }
    );
  });
});

// Listar presupuestos
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM presupuestos ORDER BY fecha_creacion DESC LIMIT 50',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Generar PDF
router.post('/:id/pdf', (req, res) => {
  db.get('SELECT * FROM presupuestos WHERE id = ?', [req.params.id], (err, presupuesto) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    const doc = new PDFDocument();
    const filename = `presupuesto_${presupuesto.id}.pdf`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Crear directorio si no existe
    if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads'), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Encabezado
    doc.fontSize(24).text('CELLFIX', { align: 'center' });
    doc.fontSize(12).text('Control de Stock y Presupuestos', { align: 'center' });
    doc.moveDown();

    // Información del presupuesto
    doc.fontSize(11).text(`Presupuesto #${presupuesto.id.substring(0, 8)}`);
    doc.text(`Fecha: ${new Date(presupuesto.fecha_creacion).toLocaleDateString('es-AR')}`);
    doc.moveDown();

    // Datos del cliente
    doc.text(`Cliente: ${presupuesto.cliente_nombre || 'Sin especificar'}`);
    doc.text(`Email: ${presupuesto.cliente_email || 'N/A'}`);
    doc.text(`Teléfono: ${presupuesto.cliente_telefono || 'N/A'}`);
    doc.moveDown();

    // Obtener items
    db.all(
      `SELECT pi.*, p.nombre FROM presupuesto_items pi
       JOIN productos p ON pi.producto_id = p.id
       WHERE pi.presupuesto_id = ?`,
      [req.params.id],
      (err, items) => {
        if (!err && items) {
          doc.fontSize(10);
          doc.text('PRODUCTOS', { underline: true });
          doc.moveDown(0.5);

          items.forEach(item => {
            doc.text(`${item.nombre}`);
            doc.text(`  Cantidad: ${item.cantidad} x $${item.precio_unitario.toFixed(2)} = $${item.subtotal.toFixed(2)}`);
          });

          doc.moveDown();
          doc.fontSize(11);
          doc.text(`Subtotal: $${presupuesto.subtotal.toFixed(2)}`, { align: 'right' });
          doc.text(`IVA (21%): $${presupuesto.impuesto.toFixed(2)}`, { align: 'right' });
          doc.fontSize(12).text(`TOTAL: $${presupuesto.total.toFixed(2)}`, { align: 'right', bold: true });

          if (presupuesto.notas) {
            doc.moveDown();
            doc.fontSize(10).text('Notas:', { underline: true });
            doc.text(presupuesto.notas);
          }
        }

        doc.end();

        stream.on('finish', () => {
          res.json({ filename, url: `/uploads/${filename}` });
        });
      }
    );
  });
});

module.exports = router;
