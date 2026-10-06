import React, { createContext, useState, useContext, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, MessageCircle, Truck, CreditCard } from 'lucide-react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. INICIALIZAMOS EL CARRITO DESDE LA MEMORIA DEL NAVEGADOR
  const [cart, setCart] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito_vivero');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarOpcionesPago, setMostrarOpcionesPago] = useState(false);

  // 2. GUARDADO AUTOMÁTICO: Cada vez que el carrito cambia, lo guardamos.
  useEffect(() => {
    localStorage.setItem('carrito_vivero', JSON.stringify(cart));
  }, [cart]);

  const agregarAlCarrito = (producto) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsOpen(true);
  };

  const eliminarDelCarrito = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  
  // 3. VACIAR CARRITO: Borramos el estado y la memoria.
  const vaciarCarrito = () => {
    setCart([]);
    localStorage.removeItem('carrito_vivero');
  };
  
  const cerrarCarrito = () => {
    setIsOpen(false);
    setTimeout(() => setMostrarOpcionesPago(false), 300); 
  };

  const total = cart.reduce((sum, item) => {
    const precioNumerico = typeof item.precio === 'string' 
      ? parseFloat(item.precio.replace('Q', '')) 
      : parseFloat(item.precio);
    return sum + ((precioNumerico || 0) * item.cantidad);
  }, 0);
  
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

  // ==========================================
  // FUNCIONES DE LOS MÉTODOS DE PAGO
  // ==========================================

  const pagarConWhatsApp = () => {
    const numeroVivero = "50244508589"; 
    
    let mensaje = `🌿¡Hola Vivero Pensamiento! Me gustaría realizar un pedido* 🌿\n\n`;
    mensaje += `Resumen de mi carrito:\n`;
    
    cart.forEach(item => {
      const precioNumerico = typeof item.precio === 'string' ? item.precio.replace('Q', '') : item.precio;
      mensaje += `🔸 ${item.cantidad}x ${item.nombre} (Q${precioNumerico} c/u)\n`;
    });
    
    mensaje += `\n💰 *Total a pagar:* Q${total.toFixed(2)}\n\n`;
    mensaje += `Quedo a la espera de las instrucciones para el pago y envío. ¡Gracias!`;

    const url = `https://wa.me/${numeroVivero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const pagarContraEntrega = () => {
    cerrarCarrito();
    // Te enviará directo al formulario sin pedir login por ahora para que puedas probarlo
    window.location.href = '/pago-contra-entrega';
  };

  const pagarConPayPal = () => {
    alert("Redirigiendo a la pasarela segura de PayPal...");
  };

  return (
    <CartContext.Provider value={{ cart, agregarAlCarrito, setIsOpen, vaciarCarrito }}>
      {children}

      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-vivero-yellow text-vivero-dark p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-white flex items-center justify-center"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-vivero-dark/60 backdrop-blur-sm cursor-pointer" onClick={cerrarCarrito}></div>
          <div className="relative w-full max-w-md bg-vivero-cream h-full shadow-2xl flex flex-col">
            
            <div className="flex justify-between items-center p-6 border-b border-vivero-green/20 bg-white">
              <h2 className="text-2xl font-serif font-bold text-vivero-dark flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-vivero-green" /> Tu Carrito
              </h2>
              <button onClick={cerrarCarrito} className="text-vivero-dark/50 hover:text-vivero-purple transition-colors p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-vivero-dark/50 mt-10 text-lg">Tu carrito está vacío.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-vivero-green/10">
                    <img src={item.imagenUrl || item.img} alt={item.nombre} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-vivero-dark">{item.nombre}</h4>
                      <p className="text-vivero-purple font-medium">Q{item.precio} x {item.cantidad}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(item.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-vivero-green/20">
                <div className="flex justify-between mb-6 text-xl font-bold text-vivero-dark font-serif">
                  <span>Total estimado:</span>
                  <span>Q{total.toFixed(2)}</span>
                </div>
                
                {!mostrarOpcionesPago ? (
                  <button 
                    onClick={() => setMostrarOpcionesPago(true)}
                    className="w-full bg-vivero-purple text-white py-4 rounded-xl font-bold hover:bg-opacity-90 shadow-lg flex justify-center items-center transition-transform hover:-translate-y-1"
                  >
                    Proceder al pago <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-sm font-bold text-center text-vivero-dark mb-4 border-b border-vivero-green/20 pb-2">
                      Selecciona tu método de pago
                    </p>
                    
                    <button onClick={pagarConWhatsApp} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-md flex justify-center items-center transition-transform hover:-translate-y-1">
                      <MessageCircle className="w-5 h-5 mr-2" /> Pedir por WhatsApp
                    </button>
                    
                    <button onClick={pagarContraEntrega} className="w-full bg-vivero-dark text-white py-3 rounded-xl font-bold hover:bg-vivero-green shadow-md flex justify-center items-center transition-transform hover:-translate-y-1">
                      <Truck className="w-5 h-5 mr-2" /> Pago contra entrega
                    </button>
                    
                    <button onClick={pagarConPayPal} className="w-full bg-[#003087] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-md flex justify-center items-center transition-transform hover:-translate-y-1">
                      <CreditCard className="w-5 h-5 mr-2" /> Pagar con PayPal
                    </button>
                    
                    <button onClick={() => setMostrarOpcionesPago(false)} className="w-full text-vivero-dark/60 text-sm font-medium hover:text-vivero-dark mt-2 pt-2">
                      ← Volver al resumen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};