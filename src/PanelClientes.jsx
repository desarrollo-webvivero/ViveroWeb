import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Users, LogOut, Mail, Phone, Search } from 'lucide-react';

export default function PanelClientes() {
  const navigate = useNavigate();
  // DATOS SIMULADOS
  const [clientes] = useState([
    { id: 1, nombre: "María González", correo: "maria@email.com", telefono: "5555-1111", pedidos: 3, gastado: 1050.00 },
    { id: 2, nombre: "Carlos Ruiz", correo: "carlos@email.com", telefono: "5555-2222", pedidos: 1, gastado: 120.00 },
    { id: 3, nombre: "Ana López", correo: "ana@email.com", telefono: "5555-3333", pedidos: 5, gastado: 2450.00 },
  ]);

  const handleCerrarSesion = () => navigate('/login');

  return (
    <div className="min-h-screen bg-vivero-cream font-sans flex flex-col md:flex-row">
      {/* MENU LATERAL */}
      <div className="w-full md:w-64 bg-white shadow-xl border-r border-vivero-green/20 flex flex-col z-10">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:justify-start">
          <h2 className="text-2xl font-bold font-serif text-vivero-dark flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2 text-vivero-green" /> ViveroWeb
          </h2>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Panel General
          </Link>
          <Link to="/admin" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <PackagePlus className="w-5 h-5 mr-3" /> Inventario
          </Link>
          <Link to="/pedidos" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" /> Pedidos
          </Link>
          <Link to="/clientes" className="flex items-center w-full p-3 bg-vivero-green/10 text-vivero-green rounded-xl font-bold transition-colors">
            <Users className="w-5 h-5 mr-3" /> Clientes
          </Link>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleCerrarSesion} className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO DE LA TABLA */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2">Directorio de Clientes</h1>
          <p className="text-vivero-dark/60 mb-8">Gestiona la información y el historial de compras de tus clientes.</p>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-bold font-serif text-xl text-vivero-dark">Lista de Clientes</h3>
              <div className="relative w-full md:w-64">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input type="text" placeholder="Buscar cliente..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-vivero-green" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-vivero-dark/60">
                  <tr>
                    <th className="p-4 font-bold">Nombre</th>
                    <th className="p-4 font-bold">Contacto</th>
                    <th className="p-4 font-bold text-center">Pedidos Realizados</th>
                    <th className="p-4 font-bold text-center">Total Gastado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientes.map(cliente => (
                    <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-vivero-dark flex items-center">
                        <div className="w-10 h-10 rounded-full bg-vivero-green/10 text-vivero-green flex items-center justify-center font-bold mr-3">
                          {cliente.nombre.charAt(0)}
                        </div>
                        {cliente.nombre}
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-vivero-dark/70 flex items-center"><Mail className="w-3 h-3 mr-1" /> {cliente.correo}</div>
                        <div className="text-sm text-vivero-dark/70 flex items-center mt-1"><Phone className="w-3 h-3 mr-1" /> {cliente.telefono}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-vivero-dark">{cliente.pedidos}</td>
                      <td className="p-4 text-center font-bold text-vivero-purple">Q{cliente.gastado.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}