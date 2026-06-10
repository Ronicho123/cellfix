# GUÍA DE CONFIGURACIÓN - TWILIO WHATSAPP

## 📱 Pasos para Integración con WhatsApp

### 1️⃣ Crear cuenta en Twilio
- Ir a https://www.twilio.com
- Crear cuenta (o iniciar sesión)
- Obtener crédito inicial ($15 USD)

### 2️⃣ Configurar WhatsApp Sandbox

**En Twilio Console:**
1. Ir a: **Messaging** → **Try it out** → **Send an SMS**
2. O buscar: **Programmable SMS** → **Messaging Services**
3. Crear nuevo **Messaging Service**
4. Seleccionar **WhatsApp** como canal
5. Aceptar términos y condiciones

### 3️⃣ Obtener Credenciales

En el dashboard de Twilio, copiar:
- **Account SID** (en la página principal)
- **Auth Token** (en la página principal)
- **Número de WhatsApp** (desde WhatsApp Sandbox)

### 4️⃣ Configurar .env

Editar el archivo `.env` con tus credenciales:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 5️⃣ Configurar Número de WhatsApp

En Twilio:
1. Ir a **Messaging** → **WhatsApp Sandbox Settings**
2. Copiar el número proporcionado (ej: +1234567890)
3. Pegarla en `TWILIO_WHATSAPP_NUMBER` del .env

### 6️⃣ Agregar Números de Clientes

Antes de enviar mensajes, cada cliente debe:
1. Enviar un mensaje de prueba al número de Twilio
2. O ser agregado manualmente en el Sandbox

**Para Sandbox:**
En Twilio → Messaging → WhatsApp → Sandbox Settings
- Agregar números de prueba autorizados

### 7️⃣ Instalar Dependencia

```bash
npm install twilio
```

## 🔧 Características WhatsApp Implementadas

✅ **Enviar Presupuestos**
- Presupuesto formateado con emojis
- Detalles del cliente y productos
- Total con IVA
- Acceso desde el panel de presupuestos

✅ **Enviar Confirmación de Venta**
- Resumen de productos vendidos
- Método de pago
- Total de la transacción

✅ **Reportes de Stock Bajo**
- Notificación automática a gerente
- Lista de productos que necesitan reabastecimiento
- Niveles actuales vs. mínimos

## 📊 Formatos de Mensaje

### Presupuesto:
```
🛍️ PRESUPUESTO CELLFIX
Cliente: Juan García
Fecha: 10/06/2026

📋 PRODUCTOS
• iPhone 15
  Cantidad: 2 x $800.00
  Subtotal: $1600.00

━━━━━━━━━━━━━━━━━━
Subtotal: $1600.00
IVA (21%): $336.00
TOTAL: $1936.00

💬 Contáctanos si tienes preguntas
```

### Confirmación de Venta:
```
✅ VENTA CONFIRMADA
Cliente: Juan García
Fecha: 10/06/2026 14:30

📦 PRODUCTOS
• iPhone 15: 2 x $800.00
• Funda: 2 x $50.00

Método de pago: Efectivo
Total: $1700.00

¡Gracias por tu compra!
```

## 🚀 Cómo Usar en la Aplicación

### Enviar Presupuesto por WhatsApp:
1. Crear un presupuesto
2. Asegurarse que el cliente tenga teléfono
3. Click en botón "💬 WhatsApp"
4. Confirmar envío

### Número de Teléfono Válido:
- Con código de país: `+541234567890`
- Sin código: `1234567890` (se agregará +54 por defecto)
- Argentina: `+54` + 10 dígitos
- Otros países: ajustar código

## 💰 Costos Twilio

- **WhatsApp Sandbox**: GRATIS
- **WhatsApp Producción**: $0.005 - $0.02 por mensaje
- **Crédito inicial**: $15 USD (~3000 mensajes en Argentina)

## ⚠️ Limitaciones Sandbox

- Solo para desarrollo/prueba
- Máximo 100 números de prueba
- Para producción, necesitas solicitud formal
- Solicitud de aprobación: 1-7 días hábiles

## 🔐 Seguridad

- ✅ Nunca commitear el .env
- ✅ Usar variables de entorno
- ✅ Rotar tokens regularmente
- ✅ Mantener .env en .gitignore

## 🆘 Solucionar Problemas

**Error: "No se encuentra TWILIO_ACCOUNT_SID"**
- Verificar que .env esté en la raíz
- Ejecutar `npm install dotenv`
- Reiniciar servidor

**Error: "Número no autorizado"**
- Agregar número en WhatsApp Sandbox
- Solicitar acceso a Producción
- Verificar formato: +54...

**Error: "Invalid request"**
- Verificar credenciales en .env
- Asegurarse que el cliente tiene teléfono
- Revisar logs en Twilio Console

## 📞 Contacto Soporte Twilio

- **Web**: https://www.twilio.com/support
- **Email**: support@twilio.com
- **Chat**: Disponible en console.twilio.com

---

✨ **¡Tu sistema CELLFIX ahora está completamente integrado con WhatsApp!** ✨