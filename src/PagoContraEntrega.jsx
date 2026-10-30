import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Truck, MapPin, Phone, CheckCircle, LogIn, UserPlus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from './CartContext';
import { useCliente } from './ClienteContext';
import { useConfirm } from './ConfirmDialog';
import {
  crearPedido,
  obtenerEnvios,
  obtenerConfigPayPal,
  crearOrdenPayPal,
  capturarPagoPayPal,
} from './services/api';
import emailjs from '@emailjs/browser';

// Credenciales de EmailJS para avisar al vivero por correo.
// Mientras sigan con "TU_...", el correo simplemente no se envía (el pedido SÍ se guarda).
const EMAILJS = {
  serviceId: 'TU_SERVICE_ID',
  templateId: 'TU_TEMPLATE_ID',
  publicKey: 'TU_PUBLIC_KEY',
};
const emailjsConfigurado = !Object.values(EMAILJS).some((v) => v.startsWith('TU_'));

const obtenerPrecioSeguro = (precio) =>
  (typeof precio === 'string' ? parseFloat(precio.replace('Q', '')) : parseFloat(precio)) || 0;

const formatearQ = (valor) => `Q${(Number(valor) || 0).toFixed(2)}`;

const claseCampo =
  'w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-green outline-none bg-white disabled:bg-gray-50 disabled:text-vivero-dark/40';

// metodo: 'CONTRA_ENTREGA' (por defecto) o 'PAYPAL'. Ambos usan el mismo formulario de envío.
export default function PagoContraEntrega({ metodo = 'CONTRA_ENTREGA' }) {
  const esPayPal = metodo === 'PAYPAL';
  const rutaPago = esPayPal ? '/pago-paypal' : '/pago-contra-entrega';
  const { cart, vaciarCarrito } = useCart();
  const { cliente, abrirAuth } = useCliente();
  const confirmar = useConfirm();
  const [cargando, setCargando] = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [error, setError] = useState('');

  // Zonas de envío que existen en la tabla ENVIOS
  const [envios, setEnvios] = useState({ estado: 'cargando', lista: [], error: '' });
  // Configuración pública de PayPal que manda el backend: Client ID y tasa de cambio
  const [paypal, setPaypal] = useState({ estado: 'cargando', clientId: '', tasaCambio: null });
  const tasaCambio = paypal.tasaCambio;

  // Estado del formulario (si hay sesión, rellenamos nombre y teléfono)
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: cliente?.nombre || '',
    telefono: cliente?.telefono || '',
    departamento: '',
    envioId: '',
    direccion: '',
    referencias: '',
  });

  // Si el cliente inicia sesión estando en esta página, rellenamos sus datos
  useEffect(() => {
    if (!cliente) return;
    setDatosEnvio((d) => ({
      ...d,
      nombre: d.nombre || cliente.nombre || '',
      telefono: d.telefono || cliente.telefono || '',
    }));
  }, [cliente]);

  // Cargamos las zonas de envío del backend
  useEffect(() => {
    let cancelado = false;
    obtenerEnvios()
      .then((lista) => {
        if (cancelado) return;
        setEnvios({ estado: 'listo', lista, error: '' });
        if (lista.length > 0) {
          // Por defecto: Guatemala si existe, si no el primer departamento
          const inicial = lista.find((e) => e.departamento === 'Guatemala') || lista[0];
          setDatosEnvio((d) => ({ ...d, departamento: inicial.departamento, envioId: String(inicial.id) }));
        }
      })
      .catch((err) => {
        if (!cancelado) setEnvios({ estado: 'error', lista: [], error: err.message });
      });
    return () => {
      cancelado = true;
    };
  }, []);

  // Con PayPal, pedimos al backend el Client ID y la tasa de cambio (el Secret se queda en el backend)
  useEffect(() => {
    if (!esPayPal) return;
    obtenerConfigPayPal()
        .then((c) =>
        setPaypal({
          estado: 'listo',
          clientId: c.configurado ? String(c.clientId || '').trim() : '',
          tasaCambio: Number(c.tasaCambio) || null,
        })
      )
      .catch(() => setPaypal({ estado: 'listo', clientId: '', tasaCambio: null }));
  }, [esPayPal]);

  const departamentos = useMemo(
    () => [...new Set(envios.lista.map((e) => e.departamento))].sort((a, b) => a.localeCompare(b, 'es')),
    [envios.lista]
  );
  const municipios = envios.lista
    .filter((e) => e.departamento === datosEnvio.departamento)
    .sort((a, b) => a.municipio.localeCompare(b.municipio, 'es'));
  const envioSeleccionado = envios.lista.find((e) => String(e.id) === datosEnvio.envioId);

  const cambiarDepartamento = (departamento) => {
    const primero = envios.lista.find((e) => e.departamento === departamento);
    setDatosEnvio((d) => ({ ...d, departamento, envioId: primero ? String(primero.id) : '' }));
  };

  // Totales
  const subtotal = cart.reduce((sum, item) => sum + obtenerPrecioSeguro(item.precio) * item.cantidad, 0);
  const costoEnvio = Number(envioSeleccionado?.costoEnvio) || 0;
  const total = subtotal + costoEnvio;
  const totalDolares = tasaCambio ? Math.round((total / tasaCambio) * 100) / 100 : null;

  const direccionCompleta = `${datosEnvio.direccion}, ${envioSeleccionado?.municipio ?? ''}, ${datosEnvio.departamento}. Referencias: ${datosEnvio.referencias || 'Ninguna'}`;

  const pedirSesion = (vista) =>
    abrirAuth(vista, {
      destino: rutaPago,
      mensaje: 'Inicia sesión o crea tu cuenta para continuar con tu pedido.',
    });

  // Aviso por correo al vivero. Si falla, NO afecta al pedido (ya quedó guardado).
  const enviarCorreoAviso = (idPedido) => {
    if (!emailjsConfigurado) return;

    let resumenProductos = '';
    cart.forEach((item) => {
      const precio = obtenerPrecioSeguro(item.precio);
      resumenProductos += `- ${item.cantidad}x ${item.nombre} (Q${precio.toFixed(2)} c/u)\n`;
    });

    const templateParams = {
      numero_pedido: idPedido ?? '',
      nombre_cliente: datosEnvio.nombre,
      telefono: datosEnvio.telefono,
      direccion_completa: direccionCompleta,
      resumen_pedido: resumenProductos,
      total: formatearQ(total),
    };

    emailjs
      .send(EMAILJS.serviceId, EMAILJS.templateId, templateParams, EMAILJS.publicKey)
      .catch((err) => console.error('No se pudo enviar el correo de aviso:', err));
  };

  // Datos del pedido que se envían al backend (los mismos para contra entrega y PayPal)
  const armarPedido = () => ({
    clienteId: cliente?.id,
    envioId: envioSeleccionado?.id,
    departamento: envioSeleccionado?.departamento,
    municipio: envioSeleccionado?.municipio,
    metodoPago: metodo,
    direccionEntrega: direccionCompleta,
    productos: cart.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
  });

  // Los botones de PayPal leen siempre la versión más reciente del pedido desde aquí
  const pedidoRef = useRef(null);
  useEffect(() => {
    pedidoRef.current = armarPedido();
  });

  // Revisa que el formulario esté completo (PayPal no usa la validación del <form>)
  const validarFormulario = () => {
    if (!envioSeleccionado) return 'Selecciona el departamento y municipio de entrega.';
    if (!datosEnvio.nombre.trim() || !datosEnvio.telefono.trim() || !datosEnvio.direccion.trim()) {
      return 'Completa tu nombre, teléfono y dirección antes de pagar.';
    }
    return '';
  };

  const finalizarPedido = (idPedido) => {
    enviarCorreoAviso(idPedido); // aviso al vivero (en segundo plano)
    setNumeroPedido(idPedido);
    setPedidoCompletado(true);
    vaciarCarrito();
  };

  // ----- PayPal -----
  const paypalOnClick = (_data, actions) => {
    const problema = validarFormulario();
    if (problema) {
      setError(problema);
      return actions.reject();
    }
    setError('');
    return actions.resolve();
  };

  const paypalCrearOrden = async () => {
    try {
      const orden = await crearOrdenPayPal(pedidoRef.current);
      return orden.id;
    } catch (err) {
      setError(err.message || 'No pudimos iniciar el pago con PayPal.');
      throw err;
    }
  };

  const paypalAprobado = async (data) => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await capturarPagoPayPal({ paypalOrderId: data.orderID, pedido: pedidoRef.current });
      finalizarPedido(respuesta.pedido?.id);
    } catch (err) {
      setError(err.message || 'No pudimos completar el pago. No se realizó ningún cobro.');
    } finally {
      setCargando(false);
    }
  };

  // ----- Contra entrega -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (esPayPal) return; // con PayPal se paga con sus botones
    if (!cliente) {
      pedirSesion('login');
      return;
    }
    const problema = validarFormulario();
    if (problema) {
      setError(problema);
      return;
    }

    // Resumen del pedido antes de guardarlo
    const totalArticulos = cart.reduce((n, item) => n + item.cantidad, 0);
    const ok = await confirmar({
      titulo: '¿Confirmar tu pedido?',
      mensaje: (
        <div className="text-left bg-vivero-cream rounded-xl p-4 space-y-1">
          <p><strong>Artículos:</strong> {totalArticulos}</p>
          <p><strong>Envío a:</strong> {envioSeleccionado.municipio}, {envioSeleccionado.departamento}</p>
          <p><strong>Dirección:</strong> {datosEnvio.direccion}</p>
          <p className="text-base pt-1"><strong>Total a pagar al recibir:</strong> {formatearQ(total)}</p>
        </div>
      ),
      textoConfirmar: 'Sí, confirmar pedido',
      textoCancelar: 'Revisar',
    });
    if (!ok) return;

    setCargando(true);
    setError('');

    try {
      const respuesta = await crearPedido(armarPedido());
      finalizarPedido(respuesta.pedido?.id);
    } catch (err) {
      setError(err.message || 'No pudimos registrar tu pedido. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de Éxito
  if (pedidoCompletado) {
    return (
      <div className="min-h-screen bg-vivero-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg text-center border border-vivero-green/20">
          <CheckCircle className="w-20 h-20 text-vivero-green mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-serif text-vivero-dark mb-2">¡Pedido Confirmado!</h1>
          {numeroPedido && <p className="text-vivero-purple font-bold text-lg mb-4">Pedido #{numeroPedido}</p>}
          <p className="text-vivero-dark/70 mb-8">
            {esPayPal
              ? 'Tu pago con PayPal se realizó con éxito. Tu pedido será preparado y enviado a la dirección indicada.'
              : 'Hemos recibido tu solicitud exitosamente. Tu pedido será preparado y enviado a la dirección indicada. El pago se realizará al momento de la entrega.'}
          </p>
          <Link to="/mi-cuenta" className="inline-block bg-vivero-purple text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-colors">
            Ver mis pedidos
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

  // Sin sesión: primero hay que iniciar sesión (el pedido se guarda a nombre del cliente)
  if (!cliente) {
    return (
      <div className="min-h-screen bg-vivero-cream flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md border border-vivero-green/20">
          <div className="bg-vivero-dark w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-vivero-yellow">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-vivero-dark mb-2">Inicia sesión para continuar</h1>
          <p className="text-vivero-dark/60 mb-6">
            Necesitamos tu cuenta para registrar el pedido y que puedas seguir su estado en <strong>Mi cuenta</strong>.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => pedirSesion('login')}
              className="w-full bg-vivero-purple text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" /> Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => pedirSesion('registro')}
              className="w-full border border-vivero-purple/30 text-vivero-purple font-bold py-3.5 rounded-xl hover:bg-vivero-purple/5 transition-colors flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Crear cuenta
            </button>
          </div>
          <Link to="/" className="inline-flex items-center mt-6 text-vivero-dark/60 font-semibold hover:text-vivero-purple">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const sinZonas = envios.estado === 'listo' && envios.lista.length === 0;
  const puedeConfirmar = envios.estado === 'listo' && Boolean(envioSeleccionado) && !cargando;

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
              {esPayPal ? <CreditCard className="w-8 h-8 mr-3 text-vivero-green" /> : <Truck className="w-8 h-8 mr-3 text-vivero-green" />}
              {esPayPal ? 'Pago con PayPal' : 'Detalles de Envío'}
            </h1>
            <p className="text-vivero-dark/60 mb-8 border-b border-gray-100 pb-4">
              {esPayPal
                ? 'Ingresa los datos del domicilio donde deseas recibir tus plantas y paga de forma segura con PayPal o tarjeta.'
                : 'Ingresa los datos del domicilio donde deseas recibir tus plantas. Pago en efectivo al recibir.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2">Nombre de quien recibe</label>
                  <input type="text" required value={datosEnvio.nombre} onChange={(e) => setDatosEnvio({ ...datosEnvio, nombre: e.target.value })} className={claseCampo} placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center"><Phone className="w-4 h-4 mr-1" /> Teléfono de contacto</label>
                  <input type="tel" required value={datosEnvio.telefono} onChange={(e) => setDatosEnvio({ ...datosEnvio, telefono: e.target.value })} className={claseCampo} placeholder="Ej. 4455 6677" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1" /> Departamento</label>
                  <select
                    required
                    value={datosEnvio.departamento}
                    onChange={(e) => cambiarDepartamento(e.target.value)}
                    disabled={envios.estado !== 'listo' || sinZonas}
                    className={claseCampo}
                  >
                    {envios.estado === 'cargando' && <option value="">Cargando…</option>}
                    {departamentos.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-vivero-dark mb-2">Municipio</label>
                  <select
                    required
                    value={datosEnvio.envioId}
                    onChange={(e) => setDatosEnvio({ ...datosEnvio, envioId: e.target.value })}
                    disabled={envios.estado !== 'listo' || sinZonas}
                    className={claseCampo}
                  >
                    {envios.estado === 'cargando' && <option value="">Cargando…</option>}
                    {municipios.map((m) => (
                      <option key={m.id} value={String(m.id)}>
                        {m.municipio}{m.zonaReferencia ? ` — ${m.zonaReferencia}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {envios.estado === 'error' && (
                <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-sm font-medium">
                  {envios.error} Recarga la página para intentarlo de nuevo.
                </p>
              )}
              {sinZonas && (
                <p className="text-vivero-dark bg-vivero-yellow/20 rounded-xl p-3 text-sm font-medium">
                  Todavía no hay zonas de envío configuradas. Mientras tanto, puedes hacer tu pedido por WhatsApp.
                </p>
              )}

              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Dirección exacta</label>
                <input type="text" required value={datosEnvio.direccion} onChange={(e) => setDatosEnvio({ ...datosEnvio, direccion: e.target.value })} className={claseCampo} placeholder="Ej. 4ta Avenida 10-22, Colonia Las Margaritas" />
              </div>

              <div>
                <label className="block text-sm font-bold text-vivero-dark mb-2">Referencias (Opcional)</label>
                <textarea value={datosEnvio.referencias} onChange={(e) => setDatosEnvio({ ...datosEnvio, referencias: e.target.value })} rows="2" className={`${claseCampo} resize-none`} placeholder="Ej. Casa de portón negro a la par de la tienda."></textarea>
              </div>

              {error && (
                <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-sm font-medium">{error}</p>
              )}

              {!esPayPal && (
                <button type="submit" disabled={!puedeConfirmar} className="w-full bg-vivero-dark text-white font-bold py-4 rounded-xl hover:bg-vivero-green transition-colors flex justify-center items-center shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-4">
                  {cargando ? 'Procesando pedido...' : 'Confirmar Pedido (Pagar al recibir)'}
                </button>
              )}

              {esPayPal && (
                <div className="mt-4 space-y-3">
                  {totalDolares !== null && (
                    <p className="text-sm text-vivero-dark/70 text-center">
                      PayPal cobra en dólares: pagarás <strong>${totalDolares.toFixed(2)} USD</strong>
                      {' '}(tipo de cambio Q{tasaCambio.toFixed(2)} por $1).
                    </p>
                  )}

                  {paypal.estado === 'cargando' ? (
                    <p className="text-center text-vivero-dark/60 py-4">Cargando PayPal…</p>
                  ) : !paypal.clientId ? (
                    <p className="text-vivero-dark bg-vivero-yellow/20 rounded-xl p-3 text-sm font-medium text-center">
                      El pago con PayPal aún no está disponible. Elige otro método de pago.
                    </p>
                  ) : cargando ? (
                    <p className="text-center font-semibold text-vivero-dark py-4">Confirmando tu pago…</p>
                  ) : (
                    <PayPalScriptProvider options={{ clientId: paypal.clientId, currency: 'USD', intent: 'capture' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                        disabled={!puedeConfirmar}
                        forceReRender={[total, envioSeleccionado?.id]}
                        onClick={paypalOnClick}
                        createOrder={paypalCrearOrden}
                        onApprove={paypalAprobado}
                        onCancel={() => setError('Cancelaste el pago. Puedes intentarlo de nuevo cuando quieras.')}
                        onError={() => setError((e) => e || 'Hubo un problema con PayPal. Intenta de nuevo.')}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
              )}
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
                    <div className="font-bold text-vivero-purple">{formatearQ(obtenerPrecioSeguro(item.precio) * item.cantidad)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-vivero-dark/70">
                  <span>Subtotal</span>
                  <span>{formatearQ(subtotal)}</span>
                </div>
                <div className="flex justify-between text-vivero-dark/70">
                  <span>Costo de envío</span>
                  <span>{envioSeleccionado ? formatearQ(costoEnvio) : 'Por definir'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-vivero-dark pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span className="text-vivero-green">{formatearQ(total)}</span>
                </div>
                {esPayPal && totalDolares !== null && (
                  <div className="flex justify-between text-sm text-vivero-dark/60">
                    <span>Equivalente PayPal</span>
                    <span>${totalDolares.toFixed(2)} USD</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}