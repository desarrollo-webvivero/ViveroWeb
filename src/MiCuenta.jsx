import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
} from 'lucide-react';
import { useCliente } from './ClienteContext';
import { obtenerPedidosCliente } from './services/api';

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

function Etiqueta({ estado }) {
  const e = ESTILOS_ESTADO[estado] ?? ESTILOS_ESTADO.PENDIENTE;
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${e.clase}`}>{e.texto}</span>;
}

function TarjetaPedido({ pedido }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl">
      <div>
        <p className="font-bold text-vivero-dark">Pedido #{pedido.id}</p>
        <p className="text-sm text-vivero-dark/60">{formatearFecha(pedido.fecha)}</p>
        {pedido.metodo && <p className="text-xs text-vivero-dark/50 mt-1">{pedido.metodo}</p>}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-vivero-dark">{formatearQuetzales(pedido.total)}</span>
        <Etiqueta estado={pedido.estado} />
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

  const [pestana, setPestana] = useState('resumen'); // 'resumen' | 'pedidos' | 'perfil'
  const [carga, setCarga] = useState({ estado: 'cargando', pedidos: [], error: '' });
  const [intento, setIntento] = useState(0);

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

  const salir = () => {
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
    <div className="min-h-screen bg-vivero-cream p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-vivero-dark hover:text-vivero-purple font-medium transition-colors mb-8 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
        </Link>

        {/* Bienvenida */}
        <div className="bg-vivero-dark text-white rounded-3xl p-8 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-vivero-yellow font-bold text-sm uppercase tracking-wider mb-1">Mi cuenta</p>
            <h1 className="text-3xl font-bold font-serif">¡Hola, {primerNombre}!</h1>
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold font-serif text-xl text-vivero-dark">Pedidos recientes</h2>
                  {pedidos.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setPestana('pedidos')}
                      className="text-sm font-semibold text-vivero-purple hover:underline"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {pedidos.slice(0, 3).map((p) => (
                    <TarjetaPedido key={p.id} pedido={p} />
                  ))}
                </div>
                {estadoPedidos}
              </div>
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
                  <TarjetaPedido key={p.id} pedido={p} />
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
      </div>
    </div>
  );
}