import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Users, LogOut, TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const cargarDatosReales = async () => {
      try {
        const respuesta = await fetch('https://vivero-backend-2.onrender.com/api/dashboard/resume');
        if (!respuesta.ok) {
          throw new Error(`HTTP Error: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        setErrorApi(true);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosReales();
  }, []);

  const handleCerrarSesion = () => {
    navigate('/login'); 
  };

  // Soporta estructura plana o anidada en 'metricas' desde Spring Boot
  const metricas = dashboardData?.metricas || dashboardData || {};
  const plantasEnPeligro = dashboardData?.plantasEnPeligro || [];
  const ultimosPedidos = dashboardData?.ultimosPedidos || [];

  return (
    <div className="min-h-screen bg-vivero-cream font-sans flex flex-col md:flex-row">
      
      {/* MENÚ LATERAL (SIDEBAR) */}
      <div className="w-full md:w-64 bg-white shadow-xl border-r border-vivero-green/20 flex flex-col z-10">
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
          <Link to="/admin" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 hover:text-vivero-dark rounded-xl font-medium transition-colors">
            <PackagePlus className="w-5 h-5 mr-3" /> Inventario
          </Link>
          <Link to="/pedidos" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 hover:text-vivero-dark rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" /> Pedidos
          </Link>
          <Link to="/clientes" className="flex items-center w-full p-3 text-vivero-dark/70 hover:bg-gray-50 hover:text-vivero-dark rounded-xl font-medium transition-colors">
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
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2">Resumen Operativo</h1>
              <p className="text-vivero-dark/60">Reportes de ventas e inventario en tiempo real.</p>
            </div>
            
            <Link to="/admin" className="mt-4 md:mt-0 bg-vivero-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-vivero-green transition-colors flex items-center shadow-md">
              <PackagePlus className="w-5 h-5 mr-2" /> Agregar Producto
            </Link>
          </div>

          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-vivero-green border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-vivero-dark/50 font-medium">Conectando con la base de datos...</p>
            </div>
          ) : errorApi || !dashboardData ? (
            <div className="bg-white rounded-3xl p-8 text-center text-red-500 shadow-sm border border-red-100">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-red-400" />
              <p className="font-bold">No se pudieron cargar las métricas desde la API.</p>
              <p className="text-sm text-gray-500 mt-1">
                Verifica la respuesta del endpoint <code>/api/dashboard/resume</code>.
              </p>
            </div>
          ) : (
            <>
              {/* TARJETAS DE MÉTRICAS (KPIs) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-xl"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Este Mes</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Ingresos por Ventas</h4>
                  <p className="text-3xl font-bold text-vivero-dark">
                    Q{(metricas.ventasDelMes ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    +{metricas.ordenesDelMes ?? 0} pedidos completados
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl"><DollarSign className="w-6 h-6 text-vivero-purple" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Capital</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Valor en Inventario</h4>
                  <p className="text-3xl font-bold text-vivero-dark">
                    Q{(metricas.valorInventario ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl"><Package className="w-6 h-6 text-blue-600" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Catálogo</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Productos Activos</h4>
                  <p className="text-3xl font-bold text-vivero-dark">{metricas.totalPlantasActivas ?? 0}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-100 p-3 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">Requiere Atención</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Stock Bajo (≤ 5 unds)</h4>
                  <p className="text-3xl font-bold text-red-600">{metricas.alertasStockBajo ?? 0}</p>
                </div>

              </div>

              {/* TABLAS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Plantas por Agotarse */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold font-serif text-xl text-vivero-dark">Plantas por Agotarse</h3>
                    <Link to="/admin" className="text-sm font-bold text-vivero-purple hover:underline">Ir al inventario</Link>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs text-vivero-dark/60">
                        <tr>
                          <th className="p-4 font-bold">Producto</th>
                          <th className="p-4 font-bold text-center">Stock Actual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {plantasEnPeligro.map(planta => (
                          <tr key={planta.id} className="hover:bg-red-50/50 transition-colors">
                            <td className="p-4 flex items-center">
                              <img src={planta.imagenUrl} alt="" className="w-10 h-10 rounded-lg bg-gray-200 object-cover mr-3" />
                              <span className="font-medium text-vivero-dark">{planta.nombre}</span>
                            </td>
                            <td className="p-4 text-center font-bold text-red-500">{planta.stockDisponible}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Últimos Pedidos */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold font-serif text-xl text-vivero-dark">Últimos Pedidos</h3>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs text-vivero-dark/60">
                        <tr>
                          <th className="p-4 font-bold">ID / Cliente</th>
                          <th className="p-4 font-bold text-center">Total</th>
                          <th className="p-4 font-bold text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ultimosPedidos.map(pedido => (
                          <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-vivero-dark">{pedido.cliente}</p>
                              <p className="text-xs text-vivero-dark/50">Pedido #{pedido.id} • {pedido.fecha}</p>
                            </td>
                            <td className="p-4 text-center font-bold text-vivero-purple">
                              Q{(pedido.total ?? 0).toFixed(2)}
                            </td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                pedido.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {pedido.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}