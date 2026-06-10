import React, { useState, useEffect } from 'react';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio_costo: '',
    precio_venta: '',
    sku: '',
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          nombre: '',
          descripcion: '',
          categoria: '',
          precio_costo: '',
          precio_venta: '',
          sku: '',
        });
        setShowForm(false);
        cargarProductos();
        alert('Producto creado exitosamente');
      }
    } catch (error) {
      console.error('Error creando producto:', error);
      alert('Error al crear el producto');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              name="sku"
              placeholder="SKU (código)"
              value={formData.sku}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={formData.categoria}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              name="precio_costo"
              placeholder="Precio de costo"
              value={formData.precio_costo}
              onChange={handleInputChange}
              step="0.01"
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="number"
              name="precio_venta"
              placeholder="Precio de venta"
              value={formData.precio_venta}
              onChange={handleInputChange}
              step="0.01"
              required
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-4 transition"
          >
            Guardar Producto
          </button>
        </form>
      )}

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Categoría</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Precio Costo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Precio Venta</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Margen</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => {
              const margen = (((producto.precio_venta - producto.precio_costo) / producto.precio_costo) * 100).toFixed(2);
              return (
                <tr key={producto.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{producto.nombre}</td>
                  <td className="px-6 py-3">{producto.categoria}</td>
                  <td className="px-6 py-3">${producto.precio_costo.toFixed(2)}</td>
                  <td className="px-6 py-3">${producto.precio_venta.toFixed(2)}</td>
                  <td className="px-6 py-3 text-green-600 font-semibold">{margen}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
