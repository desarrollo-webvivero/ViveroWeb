import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Users, LogOut, TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  
  // Estado que guardará el JSON idéntico al que enviará Spring Boot
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    /*
    // =========================================================================
    // 🚧 MOCK PARA EL COMPAÑERO DE BACKEND (ELIMINAR CUANDO LA API ESTÉ LISTA)
    // =========================================================================
    const datosSimulados = {
      metricas: {
        ventasDelMes: 4250.00,
        ordenesDelMes: 24,
        valorInventario: 15800.00,
        totalPlantasActivas: 45,
        alertasStockBajo: 2
      },
      plantasEnPeligro: [
        { id: 1, nombre: "Monstera Deliciosa (Interior)", stockDisponible: 2, imagenUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d40?w=150" },
        { id: 2, nombre: "Limonero (Frutal)", stockDisponible: 4, imagenUrl: "https://images.unsplash.com/photo-1590847926227-775c94cdfb08?w=150" }
      ],
      ultimosPedidos: [
        { id: 1001, cliente: "María González", fecha: "Hace 2 horas", total: 350.00, estado: "Pendiente" },
        { id: 1002, cliente: "Carlos Ruiz", fecha: "Ayer", total: 120.00, estado: "Entregado" },
        { id: 1003, cliente: "Ana López", fecha: "Hace 2 días", total: 850.00, estado: "Entregado" }
      ]
    };

    // Simulamos que la petición a la base de datos tarda 1 segundo
    setTimeout(() => {
      setDashboardData(datosSimulados);
      setCargando(false);
    }, 1000);
*/
    /* 
    =========================================================================
    🔌 CÓDIGO REAL A DESCOMENTAR CUANDO SPRING BOOT ESTÉ LISTO
    =========================================================================
    */
    
    const cargarDatosReales = async () => {
      try {
        const respuesta = await fetch('https://vivero-backend-2.onrender.com/api/dashboard/resumen');
        const data = await respuesta.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error al conectar con Oracle/SpringBoot:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatosReales();
    

  }, []);

  const handleCerrarSesion = () => {
    navigate('/login'); 
  };

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

          {cargando || !dashboardData ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-vivero-green border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-vivero-dark/50 font-medium">Conectando con la base de datos...</p>
            </div>
          ) : (
            <>
              {/* TARJETAS DE MÉTRICAS (KPIs) - LEYENDO DEL JSON ESTRUCTURADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-xl"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Este Mes</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Ingresos por Ventas</h4>
                  <p className="text-3xl font-bold text-vivero-dark">Q{dashboardData.metricas.ventasDelMes.toLocaleString('es-GT', {minimumFractionDigits: 2})}</p>
                  <p className="text-sm text-green-600 font-medium mt-2">+{dashboardData.metricas.ordenesDelMes} pedidos completados</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl"><DollarSign className="w-6 h-6 text-vivero-purple" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Capital</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Valor en Inventario</h4>
                  <p className="text-3xl font-bold text-vivero-dark">Q{dashboardData.metricas.valorInventario.toLocaleString('es-GT', {minimumFractionDigits: 2})}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl"><Package className="w-6 h-6 text-blue-600" /></div>
                    <span className="bg-gray-100 text-vivero-dark/60 text-xs font-bold px-2 py-1 rounded-lg">Catálogo</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Productos Activos</h4>
                  <p className="text-3xl font-bold text-vivero-dark">{dashboardData.metricas.totalPlantasActivas}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-100 p-3 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">Requiere Atención</span>
                  </div>
                  <h4 className="text-sm font-bold text-vivero-dark/60 mb-1">Stock Bajo (≤ 5 unds)</h4>
                  <p className="text-3xl font-bold text-red-600">{dashboardData.metricas.alertasStockBajo}</p>
                </div>

              </div>

              {/* SECCIÓN DE TABLAS - LEYENDO DEL JSON ESTRUCTURADO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Reporte de Inventario Crítico */}
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
                        {dashboardData.plantasEnPeligro.map(planta => (
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

                {/* Reporte de Últimos Pedidos */}
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
                        {dashboardData.ultimosPedidos.map(pedido => (
                          <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-vivero-dark">{pedido.cliente}</p>
                              <p className="text-xs text-vivero-dark/50">Pedido #{pedido.id} • {pedido.fecha}</p>
                            </td>
                            <td className="p-4 text-center font-bold text-vivero-purple">
                              Q{pedido.total.toFixed(2)}
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