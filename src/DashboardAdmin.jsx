import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Users, LogOut } from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // Aquí puedes limpiar la sesión (si usas localStorage)
    // localStorage.removeItem('adminToken');
    navigate('/login-admin'); // Cambia esto por la ruta de tu pantalla de login
  };

  return (
    <div className="min-h-screen bg-vivero-cream font-sans flex flex-col md:flex-row">
      
      {/* MENÚ LATERAL (SIDEBAR) */}
      <div className="w-full md:w-64 bg-white shadow-xl border-r border-vivero-green/20 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:justify-start">
          <h2 className="text-2xl font-bold font-serif text-vivero-dark flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2 text-vivero-green" />
            ViveroWeb
          </h2>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center w-full p-3 bg-vivero-green/10 text-vivero-green rounded-xl font-bold transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Panel General
          </Link>
          
          {/* Este enlace lleva a tu AdminPanel.jsx que ya existe */}
          <Link to="/admin" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 hover:text-vivero-dark rounded-xl font-medium transition-colors">
            <PackagePlus className="w-5 h-5 mr-3" /> Inventario
          </Link>
          
          {/* Botones deshabilitados para futuras funciones */}
          <button className="flex items-center w-full p-3 text-vivero-dark/40 cursor-not-allowed rounded-xl font-medium text-left">
            <ShoppingBag className="w-5 h-5 mr-3" /> Pedidos (Pronto)
          </button>
          <button className="flex items-center w-full p-3 text-vivero-dark/40 cursor-not-allowed rounded-xl font-medium text-left">
            <Users className="w-5 h-5 mr-3" /> Clientes (Pronto)
          </button>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleCerrarSesion} className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2">Bienvenido al Panel de Control</h1>
          <p className="text-vivero-dark/60 mb-10">Administra los productos, inventario y ventas del Vivero Pensamiento.</p>

          <h3 className="text-xl font-bold text-vivero-dark mb-4">Acciones Rápidas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* BOTÓN GIGANTE PARA AGREGAR PRODUCTOS */}
            <Link to="/admin" className="bg-white p-6 rounded-3xl shadow-sm border border-vivero-green/20 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-1">
              <div className="bg-vivero-green/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <PackagePlus className="w-8 h-8 text-vivero-green" />
              </div>
              <h4 className="text-lg font-bold text-vivero-dark mb-2">Gestionar Inventario</h4>
              <p className="text-sm text-vivero-dark/60">Agrega nuevas plantas, actualiza precios y controla el stock disponible.</p>
            </Link>

            {/* Métrica Decorativa 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Estado del Sistema</h4>
              <p className="text-2xl font-bold text-vivero-purple flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span> En Línea
              </p>
            </div>

            {/* Métrica Decorativa 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Próxima Actualización</h4>
              <p className="text-xl font-bold text-vivero-dark">Módulo de Pedidos</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}