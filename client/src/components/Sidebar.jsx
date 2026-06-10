import React from 'react';

export default function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'productos', label: '📦 Productos', icon: '📦' },
    { id: 'stock', label: '📈 Control de Stock', icon: '📈' },
    { id: 'presupuestos', label: '📋 Presupuestos', icon: '📋' },
    { id: 'ventas', label: '💳 Ventas', icon: '💳' },
    { id: 'alertas', label: '🔔 Alertas', icon: '🔔' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold">CELLFIX</h1>
        <p className="text-blue-200 text-sm">Control de Stock</p>
      </div>

      <nav className="mt-8">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full text-left px-6 py-3 hover:bg-blue-700 transition-colors ${
              currentPage === item.id ? 'bg-blue-700 border-l-4 border-white' : ''
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-blue-700">
        <p className="text-blue-200 text-xs">© 2026 CELLFIX</p>
        <p className="text-blue-300 text-xs mt-1">Sistema de Gestión de Stock</p>
      </div>
    </aside>
  );
}
