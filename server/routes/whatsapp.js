const express = require('express');
const router = express.Router();
const { enviarPresupuestoWhatsApp } = require('../utils/whatsapp');
const db = require('../database/init');

// Enviar presupuesto por WhatsApp
router.post('/:id/enviar-whatsapp', (req, res) => {
  const presupuestoId = req.params.id;

  // Obtener presupuesto con detalles
  db.get('SELECT * FROM presupuestos WHERE id = ?', [presupuestoId], (err, presupuesto) => {
    if (err || !presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    if (!presupuesto.cliente_telefono) {
      return res.status(400).json({ error: 'El cliente no tiene teléfono registrado' });
    }

    // Obtener items del presupuesto
    db.all(
      `SELECT pi.*, p.nombre FROM presupuesto_items pi
       JOIN productos p ON pi.producto_id = p.id
       WHERE pi.presupuesto_id = ?`,
      [presupuestoId],
      async (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Formatear datos para envío
        const presupuestoData = {
          ...presupuesto,
          items: items,
        };

        // Enviar por WhatsApp
        const resultado = await enviarPresupuestoWhatsApp(
          presupuesto.cliente_telefono,
          presupuestoData
        );

        if (resultado.success) {
          // Actualizar presupuesto con timestamp de envío
          db.run(
            'UPDATE presupuestos SET estado = "enviado" WHERE id = ?',
            [presupuestoId]
          );
          res.json({
            success: true,
            message: 'Presupuesto enviado por WhatsApp exitosamente',
            messageId: resultado.messageId,
          });
        } else {
          res.status(500).json({
            success: false,
            error: resultado.error,
          });
        }
      }
    );
  });
});

module.exports = router;