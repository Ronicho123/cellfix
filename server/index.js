const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const productsRouter = require('./routes/products');
const stockRouter = require('./routes/stock');
const presupuestosRouter = require('./routes/presupuestos');
const ventasRouter = require('./routes/ventas');
const alertasRouter = require('./routes/alertas');

// Routes
app.use('/api/productos', productsRouter);
app.use('/api/stock', stockRouter);
app.use('/api/presupuestos', presupuestosRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/alertas', alertasRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor CELLFIX ejecutándose en puerto ${PORT}`);
});
