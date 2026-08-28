import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function CatalogoInterior() {
  const { agregarAlCarrito } = useCart();

  // Arreglo temporal simulando datos extraídos de Oracle
  const plantas = [
    { id: 1, nombre: 'Monstera Deliciosa', precio: 'Q150', img: '/plantas-interior.jpg', desc: 'Ideal para espacios iluminados y amplios.' },
    { id: 2, nombre: 'Sansevieria', precio: 'Q85', img: '/plantas-interior.jpg', desc: 'Purifica el aire, requiere muy bajo mantenimiento.' },
    { id: 3, nombre: 'Ficus Lyrata', precio: 'Q220', img: '/plantas-interior.jpg', desc: 'Aporta un toque elegante y moderno a tu sala.' }
  ];

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Barra Superior / Navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 border-b border-vivero-green/20 pb-6">
          <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors mb-4 sm:mb-0 w-fit">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-vivero-dark text-center">
            Plantas de Interior
          </h1>
          <div className="hidden sm:block w-32"></div> {/* Espaciador para centrar el título */}
        </div>

        {/* Cuadrícula de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plantas.map((planta) => (
            <div key={planta.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden group border border-vivero-cream">
              <div className="h-64 bg-gray-200 overflow-hidden relative">
                <img src={planta.img} alt={planta.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-vivero-dark mb-2 font-serif">{planta.nombre}</h3>
                <p className="text-sm text-vivero-dark/70 mb-6 min-h-[40px]">{planta.desc}</p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="text-xl font-bold text-vivero-purple">{planta.precio}</span>
                  <button onClick={() => agregarAlCarrito(planta)} className="bg-vivero-yellow text-vivero-dark px-5 py-2.5 rounded-full font-medium hover:bg-yellow-400 flex items-center transition-all transform hover:-translate-y-0.5 shadow-md">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}