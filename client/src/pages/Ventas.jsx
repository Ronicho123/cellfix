import React, { useState, useEffect } from 'react';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    items: [],
    metodo_pago: 'efectivo',
  });

  useEffect(() => {
    cargarVentas();
    cargarProductos();
  }, []);

  const cargarVentas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ventas');
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    }
  };

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

  const agregarItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { producto_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }],
    });
  };

  const actualizarItem = (index, field, value) => {
    const nuevosItems = [...formData.items];
    nuevosItems[index][field] = value;

    if (field === 'cantidad' || field === 'precio_unitario') {
      nuevosItems[index].subtotal = nuevosItems[index].cantidad * nuevosItems[index].precio_unitario;
    }

    setFormData({ ...formData, items: nuevosItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: formData.items.map(item => ({
            ...item,
            cantidad: parseInt(item.cantidad),
            precio_unitario: parseFloat(item.precio_unitario),
          })),
        }),
      });

      if (response.ok) {
        setFormData({
          cliente_nombre: '',
          cliente_telefono: '',
          items: [],
          metodo_pago: 'efectivo',
        });
        setShowForm(false);
        cargarVentas();
        cargarProductos();
        alert('Venta registrada exitosamente. Stock actualizado.');
      } else {
        alert('Error al registrar la venta');
      }
    } catch (error) {
      console.error('Error registrando venta:', error);
      alert('Error al registrar la venta');
    }
  };

  const totalItems = formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const totalConIVA = totalItems * 1.21;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? '❌ Cancelar' : '➕ Nueva Venta'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Datos de la Venta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              name="cliente_nombre"
              placeholder="Nombre del cliente"
              value={formData.cliente_nombre}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              name="cliente_telefono"
              placeholder="Teléfono del cliente"
              value={formData.cliente_telefono}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <select
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="efectivo">💵 Efectivo</option>
              <option value="tarjeta">💳 Tarjeta</option>
              <option value="transferencia">🏦 Transferencia</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <div className="mb-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                <select
                  value={item.producto_id}
                  onChange={(e) => {
                    actualizarItem(index, 'producto_id', e.target.value);
                    const prod = productos.find(p => p.id === e.target.value);
                    if (prod) {
                      actualizarItem(index, 'precio_unitario', prod.precio_venta);
                    }
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Seleccionar</option>
                  {productos.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) => actualizarItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.precio_unitario}
                  onChange={(e) => actualizarItem(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={item.subtotal}
                  disabled
                  className="border border-gray-300 rounded px-2 py-1 bg-gray-100"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={agregarItem}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              + Agregar Producto
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <div className="text-right">
              <p className="text-lg">Subtotal: ${totalItems.toFixed(2)}</p>
              <p className="text-lg">IVA (21%): ${(totalItems * 0.21).toFixed(2)}</p>
              <p className="text-2xl font-bold text-blue-600">Total: ${totalConIVA.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition w-full"
          >
            Registrar Venta
          </button>
        </form>
      )}

      {/* Historial de ventas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Método de Pago</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{venta.cliente_nombre}</td>
                <td className="px-6 py-3">{venta.metodo_pago}</td>
                <td className="px-6 py-3 font-semibold">${venta.total.toFixed(2)}</td>
                <td className="px-6 py-3">{new Date(venta.fecha_venta).toLocaleDateString('es-AR')}</td>
                <td className="px-6 py-3 text-green-600 font-semibold">✅ {venta.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
