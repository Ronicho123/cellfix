import React, { useState, useEffect } from 'react';

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [productosAlerta, setProductosAlerta] = useState([]);

  useEffect(() => {
    cargarAlertas();
    cargarProductosAlerta();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      cargarAlertas();
      cargarProductosAlerta();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const cargarAlertas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alertas');
      const data = await response.json();
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  const cargarProductosAlerta = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alertas/bajo');
      const data = await response.json();
      setProductosAlerta(data);
    } catch (error) {
      console.error('Error cargando productos en alerta:', error);
    }
  };

  const marcarComoLeida = async (alertaId) => {
    try {
      await fetch(`http://localhost:5000/api/alertas/${alertaId}/leer`, {
        method: 'PUT',
      });
      cargarAlertas();
    } catch (error) {
      console.error('Error marcando alerta como leída:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🔔 Alertas del Sistema</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-semibold">Alertas Nuevas</p>
              <p className="text-3xl font-bold text-red-600">{alertas.length}</p>
            </div>
            <div className="text-4xl">🔴</div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold">Productos con Stock Bajo</p>
              <p className="text-3xl font-bold text-yellow-600">{productosAlerta.length}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Alertas no leídas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📌 Alertas Nuevas</h2>
        {alertas.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold">✅ No hay alertas nuevas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.map(alerta => (
              <div
                key={alerta.id}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex justify-between items-center hover:bg-red-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{alerta.nombre}</p>
                  <p className="text-red-700">{alerta.mensaje}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alerta.creada_at).toLocaleDateString('es-AR')} - 
                    {new Date(alerta.creada_at).toLocaleTimeString('es-AR')}
                  </p>
                </div>
                <button
                  onClick={() => marcarComoLeida(alerta.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Marcar como leída
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productos con stock bajo */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Productos con Stock Bajo</h2>
        {productosAlerta.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold">✅ Todos los productos tienen stock normal</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-yellow-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Producto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Categoría</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stock Actual</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Stock Mínimo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Diferencia</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosAlerta.map(producto => {
                  const diferencia = producto.stock_minimo - producto.cantidad_actual;
                  const urgencia = diferencia > 10 ? 'crítico' : 'moderado';
                  const colorFila = urgencia === 'crítico' ? 'bg-red-50' : 'bg-yellow-50';
                  
                  return (
                    <tr key={producto.id} className={`${colorFila} border-b hover:opacity-75`}>
                      <td className="px-6 py-3 font-semibold">{producto.nombre}</td>
                      <td className="px-6 py-3">{producto.categoria}</td>
                      <td className="px-6 py-3 text-lg font-bold text-red-600">{producto.cantidad_actual}</td>
                      <td className="px-6 py-3">{producto.stock_minimo}</td>
                      <td className="px-6 py-3">
                        <span className={`font-bold ${urgencia === 'crítico' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {urgencia === 'crítico' ? '🔴' : '🟡'} -{diferencia}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                          Reabastecer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Recomendaciones</h3>
        <ul className="text-blue-800 space-y-2">
          <li>✓ Verifica regularmente esta sección para mantener tu stock actualizado</li>
          <li>✓ Realiza compras preventivas basándote en los productos en alerta</li>
          <li>✓ Configura umbrales de stock según tu demanda promedio</li>
          <li>✓ Usa la función "Reabastecer" para cargar nuevas unidades</li>
        </ul>
      </div>
    </div>
  );
}
