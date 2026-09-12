import React, { useState, useEffect } from 'react';
import { PackagePlus, Save, ArrowLeft, Edit, Trash2, X, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from './services/api';

export default function AdminPanel() {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    stock: '10',
    categoria: '1',
    descripcion: '',
    imagenArchivo: null,
    imagenPreview: ''
  });
  
  const [listaProductos, setListaProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarInventario = async () => {
    try {
      const data = await apiService.obtenerProductos();
      setListaProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProducto({
        ...producto,
        imagenArchivo: file,
        imagenPreview: URL.createObjectURL(file) // Crea una URL temporal para la vista previa
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Al enviar archivos, el estándar es usar FormData en lugar de un JSON normal
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precioBase', producto.precio);
    formData.append('descripcion', producto.descripcion);
    formData.append('stockDisponible', producto.stock);
    formData.append('categoria.id', producto.categoria);
    
    if (producto.imagenArchivo) {
      formData.append('imagen', producto.imagenArchivo); // El archivo real
    }

    try {
      if (editandoId) {
        await apiService.actualizarProducto(editandoId, formData);
        setMensaje(`¡Planta "${producto.nombre}" actualizada exitosamente!`);
      } else {
        await apiService.crearProducto(formData);
        setMensaje(`¡Planta "${producto.nombre}" agregada al catálogo exitosamente!`);
      }

      setProducto({ nombre: '', precio: '', stock: '10', categoria: '1', descripcion: '', imagenArchivo: null, imagenPreview: '' });
      setEditandoId(null);
      cargarInventario();
    } catch (error) {
      console.error("Error al guardar en la API:", error);
      setMensaje('Error de conexión o validación de base de datos.');
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  const iniciarEdicion = (item) => {
    setEditandoId(item.id);
    setProducto({
      nombre: item.nombre,
      precio: item.precioBase || item.precio,
      stock: item.stockDisponible,
      categoria: item.categoria?.id?.toString() || '1',
      descripcion: item.descripcion,
      imagenArchivo: null,
      imagenPreview: item.imagenUrl || '' // Muestra la imagen que ya tiene guardada
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setProducto({ nombre: '', precio: '', stock: '10', categoria: '1', descripcion: '', imagenArchivo: null, imagenPreview: '' });
  };

  const borrarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar permanentemente este producto?")) {
      try {
        await apiService.eliminarProducto(id);
        setMensaje("Producto eliminado del inventario.");
        cargarInventario();
        setTimeout(() => setMensaje(''), 4000);
      } catch (error) {
        alert("Hubo un error al intentar eliminar el producto.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
          </Link>
          <h1 className="text-3xl font-bold font-serif text-vivero-dark flex items-center">
            <PackagePlus className="w-8 h-8 mr-3 text-vivero-green" /> Gestión de Inventario
          </h1>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-vivero-green/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-vivero-dark font-serif">
              {editandoId ? 'Editando Producto' : 'Agregar Nuevo Producto'}
            </h2>
            {editandoId && (
              <button onClick={cancelarEdicion} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg flex items-center font-medium transition-colors">
                <X className="w-4 h-4 mr-1" /> Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Nombre de la Planta</label>
                <input type="text" required value={producto.nombre} onChange={(e) => setProducto({ ...producto, nombre: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. Ficus Lyrata" />
              </div>
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Precio de Venta (Q)</label>
                <input type="number" step="0.01" required value={producto.precio} onChange={(e) => setProducto({ ...producto, precio: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. 150.00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2"># Unidades Iniciales</label>
                <input type="number" required value={producto.stock} onChange={(e) => setProducto({ ...producto, stock: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. 10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Categoría</label>
                <select value={producto.categoria} onChange={(e) => setProducto({ ...producto, categoria: e.target.value })} className="w-full p-3 border border-vivero-green/20 rounded-xl">
                  <option value="1">Plantas de Interior</option>
                  <option value="2">Árboles Frutales</option>
                  <option value="3">Jardinería Exterior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center">
                  <UploadCloud className="w-4 h-4 mr-2 text-vivero-dark/50" /> Subir Fotografía
                </label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-vivero-green/10 file:text-vivero-green hover:file:bg-vivero-green/20 transition-colors" 
                  />
                  {producto.imagenPreview && (
                    <img src={producto.imagenPreview} alt="Vista previa" className="h-12 w-12 object-cover rounded-lg shadow-sm border border-gray-200" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-vivero-dark mb-2">Descripción Breve</label>
              <textarea required value={producto.descripcion} onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })} rows="3" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none resize-none" placeholder="Características principales para el cliente..."></textarea>
            </div>

            <button type="submit" disabled={cargando} className={`w-full text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center shadow-lg disabled:opacity-70 ${editandoId ? 'bg-vivero-purple hover:bg-opacity-90' : 'bg-vivero-dark hover:bg-vivero-green'}`}>
              <Save className="w-5 h-5 mr-2" /> {cargando ? 'Procesando...' : (editandoId ? 'Guardar Cambios' : 'Registrar Nuevo Producto')}
            </button>

            {mensaje && (
              <div className={`mt-4 p-4 font-medium rounded-xl text-center transition-all ${mensaje.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-vivero-green border border-green-200'}`}>
                {mensaje}
              </div>
            )}
          </form>
        </div>

        {/* LISTADO DE INVENTARIO */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-vivero-green/20">
          <div className="p-6 bg-vivero-green/5 border-b border-vivero-green/10">
            <h2 className="text-xl font-bold text-vivero-dark font-serif">Inventario Actual</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-vivero-dark/70 text-sm">
                  <th className="p-4 font-bold">Producto</th>
                  <th className="p-4 font-bold">Categoría</th>
                  <th className="p-4 font-bold">Precio</th>
                  <th className="p-4 font-bold">Stock</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listaProductos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-vivero-dark/50">
                      No hay productos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  listaProductos.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src={item.imagenUrl || item.imagenPreview} alt={item.nombre} className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-200" />
                          <span className="font-bold text-vivero-dark">{item.nombre}</span>
                        </div>
                      </td>
                      <td className="p-4 text-vivero-dark/80 text-sm">
                        {item.categoria?.nombre || 'Sin categoría'}
                      </td>
                      <td className="p-4 font-medium text-vivero-purple">Q{item.precioBase || item.precio}</td>
                      <td className="p-4 text-vivero-dark/80">{item.stockDisponible} unds</td>
                      <td className="p-4 text-right">
                        <button onClick={() => iniciarEdicion(item)} className="p-2 text-vivero-dark/50 hover:text-vivero-purple hover:bg-purple-50 rounded-lg transition-colors mr-2" title="Editar">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => borrarProducto(item.id)} className="p-2 text-vivero-dark/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}