import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { apiService, verificarStock } from './services/api';

export default function CatalogoFrutales() {
  const { agregarAlCarrito } = useCart();
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await apiService.obtenerProductos();
        // Filtramos estrictamente para la Categoría 2 (Frutales)
        const frutales = data.filter((p) => p.categoria?.id === 2 || p.categoria?.id === "2");
        setPlantas(frutales);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const handleAgregar = async (planta) => {
    try {
      const res = await verificarStock(planta.id, 1);
      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || 'Stock insuficiente');
        return;
      }

      // Pasamos los datos formateados al carrito
      agregarAlCarrito({
        id: planta.id,
        nombre: planta.nombre,
        precio: planta.precioBase || planta.precio,
        imagenUrl: planta.imagenUrl || planta.img
      });
      alert(`¡${planta.nombre} agregada al carrito!`);
      
    } catch (err) {
      console.error('Error al verificar stock:', err);
      alert('Hubo un error de conexión al verificar la disponibilidad.');
    }
  };

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 border-b border-vivero-green/20 pb-6">
          <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors mb-4 sm:mb-0 w-fit">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-vivero-dark text-center">
            Árboles Frutales
          </h1>
          <div className="hidden sm:block w-32"></div>
        </div>

        {cargando ? (
          <p className="text-center text-vivero-dark font-medium">Cargando productos desde la base de datos...</p>
        ) : plantas.length === 0 ? (
          <p className="text-center text-vivero-dark/50 mt-10">No hay árboles frutales disponibles en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plantas.map((planta) => (
              <div key={planta.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden group border border-vivero-cream">
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  <img 
                    src={planta.imagenUrl || planta.img || 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop'} 
                    alt={planta.nombre} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-vivero-dark mb-2 font-serif">{planta.nombre}</h3>
                  <p className="text-sm text-vivero-dark/70 mb-6 min-h-[40px]">{planta.descripcion || planta.desc}</p>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-xl font-bold text-vivero-purple">Q{planta.precioBase || planta.precio}</span>
                    <button onClick={() => handleAgregar(planta)} className="bg-yellow-400 text-vivero-dark px-5 py-2.5 rounded-full font-bold hover:bg-yellow-500 flex items-center transition-all transform hover:-translate-y-0.5 shadow-md">
                      <ShoppingBag className="w-4 h-4 mr-2" /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}