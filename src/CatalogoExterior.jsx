import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function CatalogoExterior() {
  const { agregarAlCarrito } = useCart();

  const exteriores = [
    { id: 7, nombre: 'Bugambilia', precio: 'Q65', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop', desc: 'Enredadera vibrante que florece casi todo el año a pleno sol.' },
    { id: 8, nombre: 'Rosal Miniatura', precio: 'Q45', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop', desc: 'Perfecto para bordillos, maceteros de exterior y balcones.' },
    { id: 9, nombre: 'Palma Areca', precio: 'Q190', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop', desc: 'Excelente follaje para dar privacidad o decorar terrazas.' }
  ];

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 border-b border-vivero-green/20 pb-6">
          <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors mb-4 sm:mb-0 w-fit">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-vivero-dark text-center">
            Jardinería Exterior
          </h1>
          <div className="hidden sm:block w-32"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exteriores.map((planta) => (
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