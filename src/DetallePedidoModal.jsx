import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import { obtenerDetallePedido } from './services/api';

// Ventana con el detalle de un pedido (productos, entrega y pago).
// Se cierra con la X, con Escape o haciendo clic fuera.
//
// Props:
//   resumen   -> datos que ya tenemos del pedido { id, fecha, estado, metodo, total, clienteNombre }
//   clienteId -> si se manda, el backend solo responde si el pedido es de ese cliente (Mi cuenta)
//   modoAdmin -> muestra también los datos de contacto del cliente (panel de administración)
//   onCerrar  -> función para cerrar la ventana

const ESTILOS_ESTADO = {
  PENDIENTE: { texto: 'Pendiente', clase: 'bg-yellow-100 text-yellow-700' },
  ENVIADO: { texto: 'En camino', clase: 'bg-blue-100 text-blue-700' },
  ENTREGADO: { texto: 'Entregado', clase: 'bg-green-100 text-green-700' },
  CANCELADO: { texto: 'Cancelado', clase: 'bg-red-100 text-red-700' },
};

const NOMBRE_METODO = {
  CONTRA_ENTREGA: 'Pago contra entrega',
  PAYPAL: 'PayPal',
  WHATSAPP: 'WhatsApp',
};

const nombreMetodo = (m) => NOMBRE_METODO[m] ?? m ?? '—';
const formatearQuetzales = (valor) => `Q${(Number(valor) || 0).toFixed(2)}`;
const formatearFecha = (valor) => {
  if (!valor) return '—';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
};

function Etiqueta({ estado }) {
  const e = ESTILOS_ESTADO[estado] ?? ESTILOS_ESTADO.PENDIENTE;
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${e.clase}`}>{e.texto}</span>;
}

function FilaTotal({ etiqueta, valor, fuerte = false }) {
  return (
    <div className={`flex justify-between ${fuerte ? 'text-lg font-bold text-vivero-dark pt-2 border-t border-gray-100' : 'text-sm text-vivero-dark/70'}`}>
      <span>{etiqueta}</span>
      <span className={fuerte ? 'text-vivero-green' : ''}>{valor}</span>
    </div>
  );
}

function Seccion({ icono: Icono, titulo, children }) {
  return (
    <section>
      <h3 className="flex items-center font-bold text-vivero-dark mb-3">
        <Icono className="w-4 h-4 mr-2 text-vivero-green" /> {titulo}
      </h3>
      {children}
    </section>
  );
}

export default function DetallePedidoModal({ resumen, clienteId, modoAdmin = false, onCerrar }) {
  const [carga, setCarga] = useState({ estado: 'cargando', detalle: null });

  useEffect(() => {
    let cancelado = false;
    obtenerDetallePedido(resumen.id, clienteId)
      .then((detalle) => !cancelado && setCarga({ estado: 'listo', detalle }))
      .catch(() => !cancelado && setCarga({ estado: 'basico', detalle: null }));
    return () => {
      cancelado = true;
    };
  }, [resumen.id, clienteId]);

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

  // Si el detalle no está disponible en el servidor, mostramos lo que ya tenemos del pedido
  const d = carga.detalle ?? { ...resumen, productos: [] };
  const estado = String(d.estado ?? resumen.estado ?? 'PENDIENTE').toUpperCase();
  const productos = d.productos ?? [];
  const zona = [d.municipio, d.departamento].filter(Boolean).join(', ');
  const clienteNombre = d.clienteNombre || resumen.clienteNombre;

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
          <h2 id="detalle-titulo" className="text-2xl font-bold font-serif text-vivero-dark">Pedido #{d.id ?? resumen.id}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Etiqueta estado={estado} />
            <span className="text-sm text-vivero-dark/60">{formatearFecha(d.fecha)}</span>
          </div>
        </div>

        {carga.estado === 'cargando' ? (
          <p className="text-center text-vivero-dark/60 py-10">Cargando detalle…</p>
        ) : (
          <div className="space-y-6">
            {/* Cliente (solo administrador) */}
            {modoAdmin && (
              <Seccion icono={User} titulo="Cliente">
                <div className="bg-vivero-cream rounded-2xl p-4 text-sm space-y-2">
                  <p className="flex items-center font-medium text-vivero-dark">
                    <User className="w-4 h-4 mr-2 text-vivero-dark/50" /> {clienteNombre || '—'}
                  </p>
                  {d.clienteTelefono && (
                    <a href={`tel:${d.clienteTelefono}`} className="flex items-center text-vivero-purple font-medium hover:underline w-fit">
                      <Phone className="w-4 h-4 mr-2 text-vivero-dark/50" /> {d.clienteTelefono}
                    </a>
                  )}
                  {d.clienteCorreo && (
                    <a href={`mailto:${d.clienteCorreo}`} className="flex items-center text-vivero-purple font-medium hover:underline w-fit break-all">
                      <Mail className="w-4 h-4 mr-2 text-vivero-dark/50 flex-shrink-0" /> {d.clienteCorreo}
                    </a>
                  )}
                </div>
              </Seccion>
            )}

            {/* Productos */}
            <Seccion icono={ShoppingBag} titulo="Productos">
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
            </Seccion>

            {/* Entrega */}
            <Seccion icono={MapPin} titulo="Entrega">
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
            </Seccion>

            {/* Pago */}
            <Seccion icono={CreditCard} titulo="Pago">
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                <FilaTotal etiqueta="Método" valor={nombreMetodo(d.metodo)} />
                {d.subtotal != null && <FilaTotal etiqueta="Productos" valor={formatearQuetzales(d.subtotal)} />}
                {d.costoEnvio != null && <FilaTotal etiqueta="Envío" valor={formatearQuetzales(d.costoEnvio)} />}
                <FilaTotal etiqueta="Total" valor={formatearQuetzales(d.total)} fuerte />
              </div>
            </Seccion>

            {carga.estado === 'basico' && (
              <p className="text-xs text-center text-vivero-dark/50">
                No pudimos cargar el detalle completo. Se muestra la información básica del pedido.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}