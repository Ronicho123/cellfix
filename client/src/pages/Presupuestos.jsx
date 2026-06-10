import React, { useState, useEffect } from 'react';

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    items: [],
    notas: '',
  });

  useEffect(() => {
    cargarPresupuestos();
    cargarProductos();
  }, []);

  const cargarPresupuestos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/presupuestos');
      const data = await response.json();
      setPresupuestos(data);
    } catch (error) {
      console.error('Error cargando presupuestos:', error);
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
      const response = await fetch('http://localhost:5000/api/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          cliente_nombre: '',
          cliente_email: '',
          cliente_telefono: '',
          items: [],
          notas: '',
        });
        setShowForm(false);
        cargarPresupuestos();
        alert('Presupuesto creado exitosamente');
      }
    } catch (error) {
      console.error('Error creando presupuesto:', error);
      alert('Error al crear el presupuesto');
    }
  };

  const generarPDF = async (presupuestoId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/presupuestos/${presupuestoId}/pdf`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Presupuestos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Presupuesto'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>
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
              type="email"
              name="cliente_email"
              placeholder="Email"
              value={formData.cliente_email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              name="cliente_telefono"
              placeholder="Teléfono"
              value={formData.cliente_telefono}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Items del Presupuesto</h2>
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
                  <option value="">Seleccionar producto</option>
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

          <textarea
            name="notas"
            placeholder="Notas adicionales"
            value={formData.notas}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            rows="3"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Crear Presupuesto
          </button>
        </form>
      )}

      {/* Lista de presupuestos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map(pres => (
              <tr key={pres.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{pres.cliente_nombre}</td>
                <td className="px-6 py-3 font-semibold">${pres.total.toFixed(2)}</td>
                <td className="px-6 py-3">{pres.estado}</td>
                <td className="px-6 py-3">{new Date(pres.fecha_creacion).toLocaleDateString('es-AR')}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => generarPDF(pres.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    📄 PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
