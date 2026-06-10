import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockTotal: 0,
    ventasHoy: 0,
    productosAlerta: 0,
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      // Obtener productos
      const respProductos = await fetch('http://localhost:5000/api/productos');
      const productos = await respProductos.json();

      // Obtener stock
      const respStock = await fetch('http://localhost:5000/api/stock');
      const stock = await respStock.json();

      // Obtener alertas
      const respAlertas = await fetch('http://localhost:5000/api/alertas');
      const alertas = await respAlertas.json();

      // Obtener ventas
      const respVentas = await fetch('http://localhost:5000/api/ventas');
      const ventas = await respVentas.json();

      const hoy = new Date().toDateString();
      const ventasHoy = ventas.filter(v => new Date(v.fecha_venta).toDateString() === hoy).length;

      const stockTotal = stock.reduce((acc, s) => acc + s.cantidad_actual, 0);

      setStats({
        totalProductos: productos.length,
        stockTotal,
        ventasHoy,
        productosAlerta: alertas.length,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card: Productos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Productos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProductos}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Card: Stock */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Total</p>
              <p className="text-3xl font-bold text-green-600">{stats.stockTotal}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        {/* Card: Ventas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ventas Hoy</p>
              <p className="text-3xl font-bold text-purple-600">{stats.ventasHoy}</p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
        </div>

        {/* Card: Alertas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Productos en Alerta</p>
              <p className="text-3xl font-bold text-red-600">{stats.productosAlerta}</p>
            </div>
            <div className="text-4xl">🔔</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Bienvenido a CELLFIX!</h2>
        <p className="text-gray-700">
          Sistema integral para la gestión de stock, presupuestos y ventas de tu local.
        </p>
        <ul className="mt-4 space-y-2 text-gray-700">
          <li>✅ Carga y administra tus productos</li>
          <li>✅ Mantén el control de tu inventario</li>
          <li>✅ Genera presupuestos profesionales</li>
          <li>✅ Registra ventas automáticamente</li>
          <li>✅ Recibe alertas de stock bajo</li>
        </ul>
      </div>
    </div>
  );
}
