import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Stock from './pages/Stock';
import Presupuestos from './pages/Presupuestos';
import Ventas from './pages/Ventas';
import Alertas from './pages/Alertas';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <Productos />;
      case 'stock':
        return <Stock />;
      case 'presupuestos':
        return <Presupuestos />;
      case 'ventas':
        return <Ventas />;
      case 'alertas':
        return <Alertas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
