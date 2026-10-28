import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Package,
  User,
  Mail,
  Phone,
  Leaf,
  LogOut,
  RefreshCw,
  ShoppingBag,
  BadgeCheck,
  MessageCircle,
  X,
  MapPin,
  CreditCard,
  Eye,
} from 'lucide-react';
import { useCliente } from './ClienteContext';
import { useConfirm } from './ConfirmDialog';
import { obtenerPedidosCliente, obtenerDetallePedido } from './services/api';
import Footer from './Footer';

const WHATSAPP = '50244508589'; // +502 4450-8589

const ESTILOS_ESTADO = {
  PENDIENTE: { texto: 'Pendiente', clase: 'bg-yellow-100 text-yellow-700' },
  ENVIADO: { texto: 'En camino', clase: 'bg-blue-100 text-blue-700' },
  ENTREGADO: { texto: 'Entregado', clase: 'bg-green-100 text-green-700' },
  CANCELADO: { texto: 'Cancelado', clase: 'bg-red-100 text-red-700' },
};

// El backend puede nombrar los campos de dos maneras; aquí los unificamos
const normalizarPedido = (p) => ({
  id: p.id ?? p.idCotizacion,
  fecha: p.fecha ?? p.fechaSolicitud,
  total: p.total ?? p.totalEstimado,
  estado: String(p.estado ?? 'PENDIENTE').toUpperCase(),
  metodo: p.metodo ?? p.metodoPago,
});

const formatearFecha = (valor) => {
  if (!valor) return '—';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatearQuetzales = (valor) => `Q${(Number(valor) || 0).toFixed(2)}`;

const NOMBRE_METODO = {
  CONTRA_ENTREGA: 'Pago contra entrega',
  PAYPAL: 'PayPal',
  WHATSAPP: 'WhatsApp',
};
const nombreMetodo = (m) => NOMBRE_METODO[m] ?? m ?? '—';

function Etiqueta({ estado }) {
  const e = ESTILOS_ESTADO[estado] ?? ESTILOS_ESTADO.PENDIENTE;
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${e.clase}`}>{e.texto}</span>;
}

function TarjetaPedido({ pedido, onVerDetalle }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl">
      <div>
        <p className="font-bold text-vivero-dark">Pedido #{pedido.id}</p>
        <p className="text-sm text-vivero-dark/60">{formatearFecha(pedido.fecha)}</p>
        {pedido.metodo && <p className="text-xs text-vivero-dark/50 mt-1">{nombreMetodo(pedido.metodo)}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-bold text-vivero-dark">{formatearQuetzales(pedido.total)}</span>
        <Etiqueta estado={pedido.estado} />
        <button
          type="button"
          onClick={() => onVerDetalle(pedido)}
          className="inline-flex items-center px-3 py-1.5 rounded-xl border border-vivero-purple/30 text-vivero-purple text-sm font-semibold hover:bg-vivero-purple/5 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" /> Ver detalle
        </button>
      </div>
    </div>
  );
}

function FilaTotal({ etiqueta, valor, fuerte = false }) {
  return (
    <div className={`flex justify-between ${fuerte ? 'text-lg font-bold text-vivero-dark pt-2 border-t border-gray-100' : 'text-sm text-vivero-dark/70'}`}>
      <span>{etiqueta}</span>
      <span className={fuerte ? 'text-vivero-green' : ''}>{valor}</span>
    </div>
  );
}

// Ventana con el detalle de un pedido. Se cierra con la X, con Escape o haciendo clic fuera.
function DetallePedido({ pedido, clienteId, onCerrar }) {
  const [carga, setCarga] = useState({ estado: 'cargando', detalle: null });

  useEffect(() => {
    let cancelado = false;
    obtenerDetallePedido(pedido.id, clienteId)
      .then((detalle) => !cancelado && setCarga({ estado: 'listo', detalle }))
      .catch(() => !cancelado && setCarga({ estado: 'basico', detalle: null }));
    return () => {
      cancelado = true;
    };
  }, [pedido.id, clienteId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', onKey);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  // Si el detalle aún no está disponible en el servidor, mostramos lo que ya tenemos del pedido
  const d = carga.detalle ?? {
    id: pedido.id,
    fecha: pedido.fecha,
    estado: pedido.estado,
    metodo: pedido.metodo,
    total: pedido.total,
    productos: [],
  };
  const estado = String(d.estado ?? pedido.estado).toUpperCase();
  const productos = d.productos ?? [];
  const zona = [d.municipio, d.departamento].filter(Boolean).join(', ');

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-vivero-dark/60 backdrop-blur-sm"
      onMouseDown={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-titulo"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-vivero-green/20"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 text-vivero-dark/40 hover:text-vivero-dark hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="pr-10 mb-6">
          <p className="text-vivero-purple font-bold text-sm uppercase tracking-wider mb-1">Detalle del pedido</p>
          <h2 id="detalle-titulo" className="text-2xl font-bold font-serif text-vivero-dark">Pedido #{d.id}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Etiqueta estado={estado} />
            <span className="text-sm text-vivero-dark/60">{formatearFecha(d.fecha)}</span>
          </div>
        </div>

        {carga.estado === 'cargando' ? (
          <p className="text-center text-vivero-dark/60 py-10">Cargando detalle…</p>
        ) : (
          <div className="space-y-6">
            {/* Productos */}
            <section>
              <h3 className="flex items-center font-bold text-vivero-dark mb-3">
                <ShoppingBag className="w-4 h-4 mr-2 text-vivero-green" /> Productos
              </h3>
              {productos.length > 0 ? (
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-2xl">
                  {productos.map((p, i) => (
                    <li key={i} className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="font-medium text-vivero-dark truncate">{p.nombre}</p>
                        <p className="text-sm text-vivero-dark/60">
                          {p.cantidad} × {formatearQuetzales(p.precioUnitario)}
                        </p>
                      </div>
                      <span className="font-bold text-vivero-dark whitespace-nowrap">{formatearQuetzales(p.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-vivero-dark/60 bg-vivero-cream rounded-xl p-4">
                  El detalle de productos no está disponible para este pedido.
                </p>
              )}
            </section>

            {/* Entrega */}
            <section>
              <h3 className="flex items-center font-bold text-vivero-dark mb-3">
                <MapPin className="w-4 h-4 mr-2 text-vivero-green" /> Entrega
              </h3>
              <div className="bg-vivero-cream rounded-2xl p-4 text-sm space-y-1">
                <p>
                  <span className="text-vivero-dark/60">Zona: </span>
                  <span className="font-medium text-vivero-dark">
                    {zona || 'No disponible'}{d.zonaReferencia ? ` (${d.zonaReferencia})` : ''}
                  </span>
                </p>
                <p>
                  <span className="text-vivero-dark/60">Dirección: </span>
                  <span className="font-medium text-vivero-dark">{d.direccionEntrega || 'No registrada'}</span>
                </p>
              </div>
            </section>

            {/* Pago */}
            <section>
              <h3 className="flex items-center font-bold text-vivero-dark mb-3">
                <CreditCard className="w-4 h-4 mr-2 text-vivero-green" /> Pago
              </h3>
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                <FilaTotal etiqueta="Método" valor={nombreMetodo(d.metodo)} />
                {d.subtotal != null && <FilaTotal etiqueta="Productos" valor={formatearQuetzales(d.subtotal)} />}
                {d.costoEnvio != null && <FilaTotal etiqueta="Envío" valor={formatearQuetzales(d.costoEnvio)} />}
                <FilaTotal etiqueta="Total" valor={formatearQuetzales(d.total)} fuerte />
              </div>
            </section>

            {carga.estado === 'basico' && (
              <p className="text-xs text-center text-vivero-dark/50">
                Pronto podrás ver aquí más información de tus pedidos.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Dato({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-vivero-cream rounded-2xl">
      <div className="bg-white p-3 rounded-full text-vivero-purple shadow-sm">
        <Icono className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-vivero-dark/50 font-bold">{etiqueta}</p>
        <p className="text-vivero-dark font-medium break-words">{valor}</p>
      </div>
    </div>
  );
}

export default function MiCuenta() {
  const { cliente, abrirAuth, cerrarSesion } = useCliente();
  const navigate = useNavigate();
  const confirmar = useConfirm();

  const [pestana, setPestana] = useState('resumen'); // 'resumen' | 'pedidos' | 'perfil'
  const [carga, setCarga] = useState({ estado: 'cargando', pedidos: [], error: '' });
  const [intento, setIntento] = useState(0);
  const [pedidoAbierto, setPedidoAbierto] = useState(null); // pedido cuyo detalle se está viendo

  const clienteId = cliente?.id;

  // Trae los pedidos de ESTE cliente (se repite al presionar "Actualizar")
  useEffect(() => {
    if (!clienteId) return;
    let cancelado = false;
    obtenerPedidosCliente(clienteId)
      .then((lista) => {
        if (cancelado) return;
        const pedidos = lista
          .map(normalizarPedido)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCarga({ estado: 'listo', pedidos, error: '' });
      })
      .catch((err) => {
        if (cancelado) return;
        setCarga({ estado: 'error', pedidos: [], error: err.message || 'No pudimos cargar tus pedidos.' });
      });
    return () => {
      cancelado = true;
    };
  }, [clienteId, intento]);

  const recargar = () => {
    setCarga({ estado: 'cargando', pedidos: [], error: '' });
    setIntento((n) => n + 1);
  };

  const salir = async () => {
    const ok = await confirmar({
      titulo: '¿Cerrar sesión?',
      mensaje: 'Podrás volver a entrar cuando quieras con tu correo y contraseña.',
      textoConfirmar: 'Sí, cerrar sesión',
    });
    if (!ok) return;
    cerrarSesion();
    navigate('/');
  };

  // Sin sesión: invitamos a iniciar sesión
  if (!cliente) {
    return (
      <div className="min-h-screen bg-vivero-cream flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md border border-vivero-green/20">
          <div className="bg-vivero-dark w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-vivero-yellow">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-vivero-dark mb-2">Inicia sesión para ver tu cuenta</h1>
          <p className="text-vivero-dark/60 mb-6">Aquí encontrarás tus pedidos y tus datos.</p>
          <button
            type="button"
            onClick={() => abrirAuth('login')}
            className="w-full bg-vivero-purple text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg"
          >
            Iniciar sesión
          </button>
          <Link to="/" className="inline-flex items-center mt-5 text-vivero-purple font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const primerNombre = cliente.nombre?.split(' ')[0] || 'cliente';
  const { pedidos } = carga;
  const enProceso = pedidos.filter((p) => p.estado === 'PENDIENTE' || p.estado === 'ENVIADO').length;
  const entregados = pedidos.filter((p) => p.estado === 'ENTREGADO').length;

  const pestanas = [
    { id: 'resumen', texto: 'Inicio', icono: Home },
    { id: 'pedidos', texto: 'Mis pedidos', icono: Package },
    { id: 'perfil', texto: 'Mi perfil', icono: User },
  ];

  const estadoPedidos = (
    <>
      {carga.estado === 'cargando' && (
        <p className="text-vivero-dark/60 text-center py-10">Cargando tus pedidos…</p>
      )}

      {carga.estado === 'error' && (
        <div className="text-center py-10">
          <p className="text-red-500 font-medium mb-4">{carga.error}</p>
          <button
            type="button"
            onClick={recargar}
            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-vivero-purple/30 text-vivero-purple font-semibold hover:bg-vivero-purple/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Intentar de nuevo
          </button>
        </div>
      )}

      {carga.estado === 'listo' && pedidos.length === 0 && (
        <div className="text-center py-10">
          <ShoppingBag className="w-12 h-12 mx-auto text-vivero-dark/30 mb-4" />
          <p className="font-bold text-vivero-dark mb-1">Aún no tienes pedidos</p>
          <p className="text-vivero-dark/60 mb-5">Cuando hagas uno, aparecerá aquí con su estado.</p>
          <Link
            to="/"
            className="inline-block bg-vivero-dark text-white font-bold py-3 px-8 rounded-xl hover:bg-vivero-green transition-colors"
          >
            Explorar el catálogo
          </Link>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-vivero-cream font-sans flex flex-col">
      {/* Banner de bienvenida  */}
      <section className="relative bg-vivero-dark text-white overflow-hidden">
        <Leaf className="absolute -right-10 -bottom-16 w-72 h-72 text-white/5 rotate-12 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-16">
          <Link
            to="/"
            className="flex items-center text-white/80 hover:text-vivero-yellow font-medium transition-colors mb-5 w-fit"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-vivero-yellow font-bold text-sm uppercase tracking-wider mb-1">Mi cuenta</p>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif">¡Hola, {primerNombre}!</h1>
              <p className="text-white/70 mt-1">Qué gusto tenerte en Vivero El Pensamiento.</p>
            </div>
            <button
              type="button"
              onClick={salir}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-white/30 text-white/90 hover:bg-white/10 transition-colors text-sm font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 -mt-8 pb-16 relative">
        {/* Pestañas */}
        <div className="grid grid-cols-3 bg-white rounded-2xl p-1 mb-6 shadow-sm border border-gray-100">
          {pestanas.map(({ id, texto, icono: Icono }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPestana(id)}
              aria-pressed={pestana === id}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                pestana === id ? 'bg-vivero-purple/10 text-vivero-purple' : 'text-vivero-dark/60 hover:text-vivero-dark'
              }`}
            >
              <Icono className="w-4 h-4" /> <span>{texto}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-vivero-green/20">
          {/* ---------- INICIO ---------- */}
          {pestana === 'resumen' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { n: pedidos.length, t: 'Pedidos realizados' },
                  { n: enProceso, t: 'En proceso' },
                  { n: entregados, t: 'Entregados' },
                ].map(({ n, t }) => (
                  <div key={t} className="bg-vivero-cream rounded-2xl p-5 text-center">
                    <p className="text-3xl font-bold font-serif text-vivero-purple">
                      {carga.estado === 'listo' ? n : '–'}
                    </p>
                    <p className="text-sm text-vivero-dark/60">{t}</p>
                  </div>
                ))}
              </div>

              {/* CATEGORÍAS (mismo panel que en la página de inicio) */}
              <section id="categorias">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-vivero-dark font-serif mb-4">Nuestras Categorías</h2>
                  <div className="w-24 h-1 bg-vivero-purple mx-auto rounded-full mb-6"></div>
                  <p className="text-lg text-vivero-dark/70 max-w-2xl mx-auto">Encuentra la planta ideal según tus necesidades y espacios.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Link to="/interior" state={{ desde: '/mi-cuenta' }} className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5] block">
                    <img src="/plantas-interior.jpg" alt="Plantas de Interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                      <h3 className="text-2xl font-bold text-white font-serif mb-2">Plantas de Interior</h3>
                      <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Perfectas para dar vida a salas, oficinas y habitaciones.</p>
                      <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </div>
                  </Link>

                  <Link to="/frutales" state={{ desde: '/mi-cuenta' }} className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5] block">
                    <img src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop" alt="Árboles Frutales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                      <h3 className="text-2xl font-bold text-white font-serif mb-2">Árboles Frutales</h3>
                      <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cultiva tus propios frutos con nuestras especies nativas e injertos.</p>
                      <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </div>
                  </Link>

                  <Link to="/exterior" state={{ desde: '/mi-cuenta' }} className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5] block">
                    <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop" alt="Plantas Ornamentales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                      <h3 className="text-2xl font-bold text-white font-serif mb-2">Jardinería Exterior</h3>
                      <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Diseña jardines espectaculares con flores y follajes de temporada.</p>
                      <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </div>
                  </Link>
                </div>
              </section>
            </div>
          )}

          {/* ---------- PEDIDOS ---------- */}
          {pestana === 'pedidos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold font-serif text-xl text-vivero-dark">Mis pedidos</h2>
                <button
                  type="button"
                  onClick={recargar}
                  className="inline-flex items-center text-sm font-semibold text-vivero-purple hover:underline"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Actualizar
                </button>
              </div>
              <div className="space-y-3">
                {pedidos.map((p) => (
                  <TarjetaPedido key={p.id} pedido={p} onVerDetalle={setPedidoAbierto} />
                ))}
              </div>
              {estadoPedidos}
            </div>
          )}

          {/* ---------- PERFIL ---------- */}
          {pestana === 'perfil' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold font-serif text-xl text-vivero-dark">Mi perfil</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  <BadgeCheck className="w-4 h-4 mr-1" /> Cuenta verificada
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dato icono={User} etiqueta="Nombre completo" valor={cliente.nombre || '—'} />
                <Dato icono={Mail} etiqueta="Correo electrónico" valor={cliente.correo || '—'} />
                <Dato icono={Phone} etiqueta="Teléfono" valor={cliente.telefono || 'No registrado'} />
              </div>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero actualizar los datos de mi cuenta.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-semibold text-vivero-purple hover:underline"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> ¿Necesitas cambiar algún dato? Escríbenos por WhatsApp
              </a>
            </div>
          )}
        </div>
      </main>


      {/* Burbuja de WhatsApp */}
      <a
        href="https://wa.me/50244508589"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contacto por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      {pedidoAbierto && (
        <DetallePedido
          pedido={pedidoAbierto}
          clienteId={cliente.id}
          onCerrar={() => setPedidoAbierto(null)}
        />
      )}

      <Footer />
    </div>
  );
}