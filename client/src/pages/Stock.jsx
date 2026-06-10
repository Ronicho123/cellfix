import React, { useState, useEffect } from 'react';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [showCargarForm, setShowCargarForm] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad: '',
    stock_minimo: '5',
  });

  useEffect(() => {
    cargarStock();
  }, []);

  const cargarStock = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stock');
      const data = await response.json();
      setStock(data);
    } catch (error) {
      console.error('Error cargando stock:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/stock/cargar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: formData.producto_id,
          cantidad: parseInt(formData.cantidad),
          stock_minimo: parseInt(formData.stock_minimo),
        }),
      });

      if (response.ok) {
        setFormData({ producto_id: '', cantidad: '', stock_minimo: '5' });
        setShowCargarForm(false);
        cargarStock();
        alert('Stock cargado exitosamente');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error cargando stock:', error);
      alert('Error al cargar el stock');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Control de Stock</h1>
        <button
          onClick={() => setShowCargarForm(!showCargarForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showCargarForm ? '❌ Cancelar' : '➕ Cargar Stock'}
        </button>
      </div>

      {/* Formulario de carga */}
      {showCargarForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="producto_id"
              placeholder="ID del Producto"
              value={formData.producto_id}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              name="stock_minimo"
              placeholder="Stock Mínimo"
              value={formData.stock_minimo}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-4 transition"
          >
            Guardar Stock
          </button>
        </form>
      )}

      {/* Tabla de stock */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Producto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cantidad Actual</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock Mínimo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Precio Venta</th>
            </tr>
          </thead>
          <tbody>
            {stock.map(item => {
              const estado = item.cantidad_actual <= item.stock_minimo ? '⚠️ Bajo' : '✅ Normal';
              const colorEstado = item.cantidad_actual <= item.stock_minimo ? 'text-red-600' : 'text-green-600';
              
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{item.nombre}</td>
                  <td className="px-6 py-3 font-semibold">{item.cantidad_actual}</td>
                  <td className="px-6 py-3">{item.stock_minimo}</td>
                  <td className={`px-6 py-3 font-semibold ${colorEstado}`}>{estado}</td>
                  <td className="px-6 py-3">${item.precio_venta.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
