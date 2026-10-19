import React, { useEffect, useRef, useState } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useCliente } from './ClienteContext';

// variant: 'desktop' (barra superior) | 'mobile' (menú hamburguesa)
// onAction: se llama al abrir el modal o cerrar sesión (sirve para cerrar el menú móvil)
export default function UserMenuButton({ variant = 'desktop', onAction }) {
  const { cliente, abrirAuth, cerrarSesion } = useCliente();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    if (!abierto) return;
    const alHacerClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', alHacerClicFuera);
    return () => document.removeEventListener('mousedown', alHacerClicFuera);
  }, [abierto]);

  const primerNombre = cliente?.nombre?.split(' ')[0] || '';

  const handleAbrir = () => {
    onAction?.();
    abrirAuth('login');
  };

  const handleSalir = () => {
    cerrarSesion();
    setAbierto(false);
    onAction?.();
  };

  /* ---------- MÓVIL ---------- */
  if (variant === 'mobile') {
    const claseFila =
      'flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-vivero-dark hover:bg-vivero-green hover:text-vivero-cream transition-colors';

    if (!cliente) {
      return (
        <button type="button" onClick={handleAbrir} className={claseFila}>
          <User className="w-5 h-5 flex-shrink-0" />
          <span>Mi cuenta</span>
        </button>
      );
    }
    return (
      <>
        <div className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-vivero-purple">
          <User className="w-5 h-5 flex-shrink-0" />
          <span>Mi cuenta{primerNombre && ` · ${primerNombre}`}</span>
        </div>
        <button type="button" onClick={handleSalir} className={claseFila}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </>
    );
  }

  /* ---------- DESKTOP ---------- */
  const claseLink = 'text-vivero-dark hover:text-vivero-purple transition-colors inline-flex items-center gap-1.5';

  if (!cliente) {
    return (
      <button type="button" onClick={handleAbrir} className={claseLink}>
        <User className="w-4 h-4 flex-shrink-0" />
        <span>Mi cuenta</span>
      </button>
    );
  }

  return (
    <div ref={contenedorRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={claseLink}
      >
        <User className="w-4 h-4 flex-shrink-0" />
        <span>Mi cuenta</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-vivero-green/20 py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-vivero-dark truncate">{cliente.nombre || 'Mi cuenta'}</p>
            {cliente.correo && <p className="text-xs text-vivero-dark/60 truncate">{cliente.correo}</p>}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSalir}
            className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}