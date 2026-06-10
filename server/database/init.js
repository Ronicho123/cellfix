const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cellfix.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Tabla de Productos
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      categoria TEXT,
      precio_costo REAL NOT NULL,
      precio_venta REAL NOT NULL,
      sku TEXT UNIQUE,
      estado TEXT DEFAULT 'activo',
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      actualizado_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de Stock
  db.run(`
    CREATE TABLE IF NOT EXISTS stock (
      id TEXT PRIMARY KEY,
      producto_id TEXT NOT NULL,
      cantidad_inicial INTEGER NOT NULL,
      cantidad_actual INTEGER NOT NULL,
      stock_minimo INTEGER DEFAULT 5,
      ultimo_movimiento DATETIME,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  // Tabla de Movimientos de Stock
  db.run(`
    CREATE TABLE IF NOT EXISTS movimientos_stock (
      id TEXT PRIMARY KEY,
      producto_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      razon TEXT,
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  // Tabla de Presupuestos
  db.run(`
    CREATE TABLE IF NOT EXISTS presupuestos (
      id TEXT PRIMARY KEY,
      numero INTEGER AUTOINCREMENT,
      cliente_nombre TEXT,
      cliente_email TEXT,
      cliente_telefono TEXT,
      estado TEXT DEFAULT 'borrador',
      subtotal REAL NOT NULL,
      impuesto REAL,
      total REAL NOT NULL,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_validez DATETIME,
      notas TEXT
    )
  `);

  // Tabla de Items de Presupuestos
  db.run(`
    CREATE TABLE IF NOT EXISTS presupuesto_items (
      id TEXT PRIMARY KEY,
      presupuesto_id TEXT NOT NULL,
      producto_id TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  // Tabla de Ventas
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id TEXT PRIMARY KEY,
      numero_venta INTEGER AUTOINCREMENT,
      cliente_nombre TEXT,
      cliente_telefono TEXT,
      estado TEXT DEFAULT 'completada',
      subtotal REAL NOT NULL,
      impuesto REAL,
      total REAL NOT NULL,
      metodo_pago TEXT,
      fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
      presupuesto_id TEXT,
      FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(id)
    )
  `);

  // Tabla de Items de Ventas
  db.run(`
    CREATE TABLE IF NOT EXISTS venta_items (
      id TEXT PRIMARY KEY,
      venta_id TEXT NOT NULL,
      producto_id TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (venta_id) REFERENCES ventas(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  // Tabla de Alertas
  db.run(`
    CREATE TABLE IF NOT EXISTS alertas (
      id TEXT PRIMARY KEY,
      producto_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      mensaje TEXT,
      leida BOOLEAN DEFAULT 0,
      creada_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  console.log('Base de datos CELLFIX inicializada correctamente');
});

module.exports = db;
