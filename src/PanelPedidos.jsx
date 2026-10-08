import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Users, LogOut, Eye, Search, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function PanelPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // URL base de tu API Spring Boot
  const API_URL = 'https://vivero-backend-2.onrender.com/api/pedidos';

  // 1. CARGAR PEDIDOS DESDE EL BACKEND AL MONTAR EL COMPONENTE
  const cargarPedidos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        console.error("Error al obtener los pedidos del servidor");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleCerrarSesion = () => navigate('/login');

  // 2. CAMBIAR ESTADO Y NOTIFICAR A SPRING BOOT (PUT)
  const cambiarEstado = async (id, nuevoEstado) => {
    if (nuevoEstado === 'CANCELADO') {
      const confirmar = window.confirm("¿Estás seguro de cancelar este pedido? Esta acción detendrá el envío.");
      if (!confirmar) return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        // Actualizamos el estado localmente si la API respondió 200 OK
        setPedidos(pedidos.map(p => 
          p.idCotizacion === id ? { ...p, estado: nuevoEstado } : p
        ));
      } else {
        const errorText = await response.text();
        alert(`No se pudo actualizar el estado: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error de red al intentar actualizar el estado.");
    }
  };

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
          <Link to="/pedidos" className="flex items-center w-full p-3 bg-vivero-green/10 text-vivero-green rounded-xl font-bold transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" /> Pedidos
          </Link>
          <Link to="/clientes" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" /> Clientes
          </Link>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleCerrarSesion} className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2">Gestión de Pedidos</h1>
            <p className="text-vivero-dark/60">Controla las órdenes web que ingresan automáticamente al sistema.</p>
          </div>

          {/* TABLA DE ÓRDENES */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-bold font-serif text-xl text-vivero-dark">Bandeja de Entrada</h3>
              <div className="relative w-full md:w-64">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input type="text" placeholder="Buscar pedido..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-vivero-green" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {cargando ? (
                <div className="p-8 text-center text-vivero-dark/60">Cargando pedidos...</div>
              ) : pedidos.length === 0 ? (
                <div className="p-8 text-center text-vivero-dark/60">No hay pedidos registrados.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs text-vivero-dark/60 uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-bold">ID / Fecha</th>
                      <th className="p-4 font-bold">Cliente</th>
                      <th className="p-4 font-bold text-center">Total</th>
                      <th className="p-4 font-bold text-center">Estado</th>
                      <th className="p-4 font-bold text-center">Gestión Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pedidos.map(pedido => {
                      const estadoUpper = pedido.estado ? pedido.estado.toUpperCase() : '';
                      return (
                        <tr key={pedido.idCotizacion} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-vivero-dark">#{pedido.idCotizacion}</span>
                            <p className="text-xs text-vivero-dark/50">{pedido.fechaSolicitud}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-vivero-dark">{pedido.nombreCliente || pedido.cliente}</p>
                            <p className="text-xs text-vivero-dark/50">{pedido.metodoPago}</p>
                          </td>
                          <td className="p-4 text-center font-bold text-vivero-purple">
                            Q{Number(pedido.totalEstimado).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              estadoUpper === 'ENTREGADO' ? 'bg-green-100 text-green-700' :
                              estadoUpper === 'ENVIADO' ? 'bg-blue-100 text-blue-700' :
                              estadoUpper === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {estadoUpper}
                            </span>
                          </td>
                          
                          {/* BOTONERA DE GESTIÓN */}
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button className="p-2 text-vivero-dark/50 hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalles del pedido">
                                <Eye className="w-5 h-5" />
                              </button>
                              
                              {estadoUpper === 'PENDIENTE' && (
                                <>
                                  <button onClick={() => cambiarEstado(pedido.idCotizacion, 'ENVIADO')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Marcar como Enviado">
                                    <Truck className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => cambiarEstado(pedido.idCotizacion, 'CANCELADO')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancelar Pedido">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}

                              {estadoUpper === 'ENVIADO' && (
                                <button onClick={() => cambiarEstado(pedido.idCotizacion, 'ENTREGADO')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Marcar como Entregado">
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}