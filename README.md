# CELLFIX - Control de Stock para Locales

Sistema integral de gestión de inventario, presupuestos y ventas para tu local **CELLFIX**.

## 🎯 Características

✅ **Gestión de Productos**
- Crear, editar y eliminar productos
- Categorización de artículos
- Precios y márgenes configurables

✅ **Control de Stock**
- Carga inicial de inventario
- Actualización automática en ventas
- Historial de movimientos

✅ **Alertas de Stock Bajo**
- Notificaciones cuando el stock es bajo
- Umbrales configurables por producto

✅ **Generador de Presupuestos**
- Crear presupuestos personalizados
- Exportar a PDF
- Compartir por WhatsApp

✅ **Registro de Ventas**
- Descuento automático del stock
- Historial de transacciones
- Reportes de ventas

## 🚀 Tecnología

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de Datos**: SQLite
- **Exportación**: PDFKit para PDF, Twilio para WhatsApp

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Ronicho123/cellfix.git
cd cellfix

# Instalar dependencias
npm install
cd client && npm install && cd ..

# Crear archivo .env
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🌍 Deployment en Render

Este proyecto está completamente configurado para desplegarse automáticamente en Render.

### Pasos para desplegar tu aplicación:

1. **Crear cuenta en Render** - Ve a [render.com](https://render.com) y regístrate
2. **Haz clic en "New +"** en la esquina superior derecha
3. **Selecciona "Web Service"**
4. **Conecta tu repositorio de GitHub**:
   - Haz clic en "Connect account"
   - Autoriza tu cuenta de GitHub
   - Busca y selecciona **Ronicho123/cellfix**
5. **Configura los detalles**:
   - **Name**: `cellfix`
   - **Environment**: `Node`
   - **Region**: Elige la más cercana a tu ubicación
   - **Branch**: `main`
6. **Render detectará automáticamente** la configuración desde `render.yaml`
7. **Haz clic en "Create Web Service"**

✅ **Tu aplicación estará en vivo en ~5-10 minutos**

### Tu aplicación en producción

Una vez desplegado, accede en:
```
https://cellfix.onrender.com
```

O puedes ver la URL exacta en tu dashboard de Render.

## 📝 Uso de la Aplicación

1. **Carga tus productos** en el panel de administración
2. **Configura stock inicial** y umbrales de alerta
3. **Genera presupuestos** y comparte con clientes
4. **Registra ventas** (el stock se actualiza automáticamente)
5. **Recibe alertas** cuando el stock sea bajo

## 🛠️ Comandos Disponibles

```bash
# Desarrollo (Frontend + Backend juntos)
npm run dev

# Solo servidor en modo desarrollo
npm run server:dev

# Solo cliente en modo desarrollo
npm run client:dev

# Compilar para producción
npm run build

# Tests del servidor
npm run server:test

# Tests del cliente
npm run client:test

# Iniciar en producción
npm start
```

## 📱 Endpoints de API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/productos` | GET, POST, PUT, DELETE | Gestionar productos |
| `/api/stock` | GET, POST | Control de inventario |
| `/api/presupuestos` | GET, POST | Crear y obtener presupuestos |
| `/api/ventas` | GET, POST | Registrar ventas |
| `/api/alertas` | GET | Alertas de stock bajo |
| `/health` | GET | Verificar estado del servidor |

## 🔐 Variables de Entorno

### Desarrollo
```
NODE_ENV=development
PORT=5000
DB_PATH=./server/database/cellfix.db
CORS_ORIGIN=http://localhost:3000
TAX_RATE=0.21
```

### Producción (en Render)
```
NODE_ENV=production
PORT=10000
DB_PATH=./server/database/cellfix.db
CORS_ORIGIN=*
TAX_RATE=0.21
```

### Opcional - Twilio para WhatsApp
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 📄 Licencia

MIT

---

**Creado por**: Ronicho123  
**Última actualización**: 2026-06-10  
**Estado**: ✅ Completamente configurado y listo para producción
