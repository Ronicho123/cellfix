const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const enviarPresupuestoWhatsApp = async (numeroCliente, presupuestoData) => {
  try {
    // Formatear el número de teléfono (asegurarse que tenga el código de país)
    let numeroFormato = numeroCliente.replace(/\D/g, '');
    if (!numeroFormato.startsWith('+')) {
      numeroFormato = '+54' + numeroFormato; // Argentina por defecto
    }

    const mensaje = formatearMensajePresupuesto(presupuestoData);

    const response = await client.messages.create({
      body: mensaje,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${numeroFormato}`,
    });

    console.log(`Presupuesto enviado por WhatsApp: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

const formatearMensajePresupuesto = (presupuesto) => {
  const items = presupuesto.items
    .map(item => `• ${item.nombre}\n  Cantidad: ${item.cantidad} x $${item.precio_unitario.toFixed(2)}\n  Subtotal: $${item.subtotal.toFixed(2)}`)
    .join('\n\n');

  return `🛍️ *PRESUPUESTO CELLFIX*\n\n` +
    `Cliente: ${presupuesto.cliente_nombre}\n` +
    `Fecha: ${new Date(presupuesto.fecha_creacion).toLocaleDateString('es-AR')}\n\n` +
    `📋 *PRODUCTOS*\n${items}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Subtotal: $${presupuesto.subtotal.toFixed(2)}\n` +
    `IVA (21%): $${presupuesto.impuesto.toFixed(2)}\n` +
    `*TOTAL: $${presupuesto.total.toFixed(2)}*\n\n` +
    `${presupuesto.notas ? `Notas: ${presupuesto.notas}\n\n` : ''}` +
    `💬 Contáctanos si tienes preguntas`;
};

const enviarReporteStockBajo = async (numeroWhatsApp, productosAlerta) => {
  try {
    let numeroFormato = numeroWhatsApp.replace(/\D/g, '');
    if (!numeroFormato.startsWith('+')) {
      numeroFormato = '+54' + numeroFormato;
    }

    const items = productosAlerta
      .map(p => `• ${p.nombre} (${p.categoria})\n  Stock: ${p.cantidad_actual}/${p.stock_minimo}`)
      .join('\n');

    const mensaje = `⚠️ *ALERTA DE STOCK BAJO*\n\n` +
      `Productos que necesitan reabastecimiento:\n\n${items}\n\n` +
      `Por favor, verifica el sistema para más detalles.`;

    const response = await client.messages.create({
      body: mensaje,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${numeroFormato}`,
    });

    console.log(`Reporte de stock enviado por WhatsApp: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('Error enviando reporte por WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

const enviarConfirmacionVenta = async (numeroCliente, ventaData) => {
  try {
    let numeroFormato = numeroCliente.replace(/\D/g, '');
    if (!numeroFormato.startsWith('+')) {
      numeroFormato = '+54' + numeroFormato;
    }

    const items = ventaData.items
      .map(item => `• ${item.nombre}: ${item.cantidad} x $${item.precio_unitario.toFixed(2)}`)
      .join('\n');

    const mensaje = `✅ *VENTA CONFIRMADA*\n\n` +
      `Cliente: ${ventaData.cliente_nombre}\n` +
      `Fecha: ${new Date(ventaData.fecha_venta).toLocaleDateString('es-AR')} ${new Date(ventaData.fecha_venta).toLocaleTimeString('es-AR')}\n\n` +
      `📦 *PRODUCTOS*\n${items}\n\n` +
      `Método de pago: ${ventaData.metodo_pago}\n` +
      `*Total: $${ventaData.total.toFixed(2)}*\n\n` +
      `¡Gracias por tu compra!`;

    const response = await client.messages.create({
      body: mensaje,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${numeroFormato}`,
    });

    console.log(`Confirmación de venta enviada por WhatsApp: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('Error enviando confirmación por WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  enviarPresupuestoWhatsApp,
  enviarReporteStockBajo,
  enviarConfirmacionVenta,
};