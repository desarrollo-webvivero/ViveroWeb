import React, { useState } from 'react';
import { PackagePlus, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: 'Interior',
    descripcion: '',
    imagenUrl: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Aquí irá la petición POST hacia tu backend en Spring Boot (api.js)
    console.log("Datos listos para enviar a Oracle:", producto);
    
    setMensaje(`¡Planta "${producto.nombre}" agregada al catálogo exitosamente!`);
    setProducto({ nombre: '', precio: '', categoria: 'Interior', descripcion: '', imagenUrl: '' });
    
    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold font-serif text-vivero-dark flex items-center">
            <PackagePlus className="w-8 h-8 mr-3 text-vivero-green" /> Gestión de Inventario
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-vivero-green/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Nombre de la Planta</label>
                <input type="text" required value={producto.nombre} onChange={(e) => setProducto({...producto, nombre: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. Ficus Lyrata" />
              </div>
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Precio de Venta (Q)</label>
                <input type="number" required value={producto.precio} onChange={(e) => setProducto({...producto, precio: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. 150" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Categoría</label>
                <select value={producto.categoria} onChange={(e) => setProducto({...producto, categoria: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none bg-white">
                  <option value="Interior">Plantas de Interior</option>
                  <option value="Frutales">Árboles Frutales</option>
                  <option value="Exterior">Jardinería Exterior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2 text-vivero-dark/50" /> URL de la Fotografía
                </label>
                <input type="url" required value={producto.imagenUrl} onChange={(e) => setProducto({...producto, imagenUrl: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="https://ejemplo.com/foto.jpg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-vivero-dark mb-2">Descripción Breve</label>
              <textarea required value={producto.descripcion} onChange={(e) => setProducto({...producto, descripcion: e.target.value})} rows="3" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none resize-none" placeholder="Características principales para el cliente..."></textarea>
            </div>

            <button type="submit" className="w-full bg-vivero-dark text-white font-bold py-4 rounded-xl hover:bg-vivero-green transition-colors flex justify-center items-center shadow-lg">
              <Save className="w-5 h-5 mr-2" /> Guardar Producto
            </button>

            {mensaje && (
              <div className="mt-4 p-4 bg-green-50 text-vivero-green font-medium rounded-xl border border-green-200 text-center transition-all">
                {mensaje}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}