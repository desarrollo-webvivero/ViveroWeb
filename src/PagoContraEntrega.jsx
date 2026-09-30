import React, { useState } from 'react';
import { ArrowLeft, Truck, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function PagoContraEntrega() {
  const { cart, vaciarCarrito } = useCart();
  const [cargando, setCargando] = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);

  // Estado del formulario
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    telefono: '',
    departamento: 'Guatemala',
    municipio: '',
    direccion: '',
    referencias: ''
  });

  // Calculamos el total
  const total = cart.reduce((sum, item) => {
    const precioNumerico = typeof item.precio === 'string' 
      ? parseFloat(item.precio.replace('Q', '')) 
      : parseFloat(item.precio);
    return sum + ((precioNumerico || 0) * item.cantidad);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // TODO: Aquí en el futuro conectaremos con Spring Boot para guardar el pedido en Oracle
    const orden = {
      cliente: datosEnvio,
      productos: cart,
      total: total,
      metodoPago: 'Contra Entrega'
    };
    console.log("Orden lista para guardar:", orden);

    // Simulamos el tiempo de conexión con el servidor
    setTimeout(() => {
      setCargando(false);
      setPedidoCompletado(true);
      vaciarCarrito();
    }, 1500);
  };

  // Pantalla de Éxito
  if (pedidoCompletado) {
    return (
      <div className="min-h-screen bg-vivero-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg text-center border border-vivero-green/20">
          <CheckCircle className="w-20 h-20 text-vivero-green mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-4">¡Pedido Confirmado!</h1>
          <p className="text-vivero-dark/70 mb-8">
            Hemos recibido tu solicitud exitosamente. Tu pedido será preparado y enviado a la dirección indicada. El pago se realizará al momento de la entrega.
          </p>
          <Link to="/" className="inline-block bg-vivero-dark text-white font-bold py-3 px-8 rounded-xl hover:bg-vivero-green transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío y no han comprado, regresarlos
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-vivero-cream flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold font-serif text-vivero-dark mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="text-vivero-purple font-bold flex items-center hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Regresar a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors mb-8 w-fit">
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FORMULARIO DE ENVÍO */}
          <div className="lg:w-2/3 bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-vivero-green/20">
            <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-vivero-green" /> Detalles de Envío
            </h1>
            <p className="text-vivero-dark/60 mb-8 border-b border-gray-100 pb-4">
              Ingresa los datos del domicilio donde deseas recibir tus plantas. Pago en efectivo al recibir.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2">Nombre de quien recibe</label>
                  <input type="text" required value={datosEnvio.nombre} onChange={e => setDatosEnvio({...datosEnvio, nombre: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center"><Phone className="w-4 h-4 mr-1"/> Teléfono de contacto</label>
                  <input type="tel" required value={datosEnvio.telefono} onChange={e => setDatosEnvio({...datosEnvio, telefono: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. 4455 6677" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1"/> Departamento</label>
                  <select value={datosEnvio.departamento} onChange={e => setDatosEnvio({...datosEnvio, departamento: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none bg-white">
                    <option value="Guatemala">Guatemala</option>
                    <option value="Sacatepéquez">Sacatepéquez</option>
                    <option value="Chimaltenango">Chimaltenango</option>
                    <option value="Escuintla">Escuintla</option>
                    {/* Puedes agregar más departamentos aquí */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2">Municipio</label>
                  <input type="text" required value={datosEnvio.municipio} onChange={e => setDatosEnvio({...datosEnvio, municipio: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. Mixco, Zona 1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Dirección exacta</label>
                <input type="text" required value={datosEnvio.direccion} onChange={e => setDatosEnvio({...datosEnvio, direccion: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none" placeholder="Ej. 4ta Avenida 10-22, Colonia Las Margaritas" />
              </div>

              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Referencias (Opcional)</label>
                <textarea value={datosEnvio.referencias} onChange={e => setDatosEnvio({...datosEnvio, referencias: e.target.value})} rows="2" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none resize-none" placeholder="Ej. Casa de portón negro a la par de la tienda."></textarea>
              </div>

              <button type="submit" disabled={cargando} className="w-full bg-vivero-dark text-white font-bold py-4 rounded-xl hover:bg-vivero-green transition-colors flex justify-center items-center shadow-lg disabled:opacity-70 mt-4">
                {cargando ? 'Procesando pedido...' : 'Confirmar Pedido (Pagar al recibir)'}
              </button>
            </form>
          </div>

          {/* RESUMEN DEL PEDIDO */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-vivero-green/20 sticky top-8">
              <h2 className="text-xl font-bold font-serif text-vivero-dark mb-6 border-b border-gray-100 pb-4">Resumen de tu compra</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img src={item.imagenUrl || item.img} alt={item.nombre} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-sm text-vivero-dark">{item.nombre}</h4>
                      <p className="text-vivero-dark/60 text-sm">Cant: {item.cantidad}</p>
                    </div>
                    <div className="font-bold text-vivero-purple">
                      Q{(parseFloat(typeof item.precio === 'string' ? item.precio.replace('Q', '') : item.precio) * item.cantidad).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-vivero-dark/70">
                  <span>Subtotal</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-vivero-dark/70">
                  <span>Costo de envío</span>
                  <span>Por definir</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-vivero-dark pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span className="text-vivero-green">Q{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}