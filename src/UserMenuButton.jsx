import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useCliente } from './ClienteContext';
import { useConfirm } from './ConfirmDialog';

// variant: 'desktop' (barra superior) | 'mobile' (menú hamburguesa)
// onAction: se llama al abrir el modal, ir a Mi cuenta o cerrar sesión (sirve para cerrar el menú móvil)
export default function UserMenuButton({ variant = 'desktop', onAction }) {
  const { cliente, abrirAuth, cerrarSesion } = useCliente();
  const confirmar = useConfirm();
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

  const handleSalir = async () => {
    setAbierto(false);
    onAction?.();
    const ok = await confirmar({
      titulo: '¿Cerrar sesión?',
      mensaje: 'Podrás volver a entrar cuando quieras con tu correo y contraseña.',
      textoConfirmar: 'Sí, cerrar sesión',
    });
    if (ok) cerrarSesion();
  };

  /* ---------- MÓVIL ---------- */
  if (variant === 'mobile') {
    const claseFila =
      'flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-medium text-vivero-dark hover:bg-vivero-green hover:text-vivero-cream transition-colors';

    if (!cliente) {
      return (
        <button type="button" onClick={handleAbrir} className={claseFila}>
          <User className="w-5 h-5 mr-3" /> Mi cuenta
        </button>
      );
    }
    return (
      <>
        <Link to="/mi-cuenta" onClick={() => onAction?.()} className={claseFila}>
          <User className="w-5 h-5 mr-3" /> Mi cuenta{primerNombre && ` · ${primerNombre}`}
        </Link>
        <button type="button" onClick={handleSalir} className={claseFila}>
          <LogOut className="w-5 h-5 mr-3" /> Cerrar sesión
        </button>
      </>
    );
  }

  /* ---------- DESKTOP ---------- */
  // Mismo estilo que los demás links del menú
  const claseLink = 'text-vivero-dark hover:text-vivero-purple transition-colors';

  if (!cliente) {
    return (
      <button type="button" onClick={handleAbrir} className={`${claseLink} inline-flex items-center gap-2`}>
        <User className="w-5 h-5" />
        Mi cuenta
      </button>
    );
  }

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={`${claseLink} inline-flex items-center gap-2`}
      >
        <User className="w-5 h-5" />
        Mi cuenta
        <ChevronDown className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-vivero-green/20 py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-vivero-dark truncate">{cliente.nombre || 'Mi cuenta'}</p>
            {cliente.correo && <p className="text-xs text-vivero-dark/60 truncate">{cliente.correo}</p>}
          </div>
          <Link
            to="/mi-cuenta"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="flex items-center w-full px-4 py-2.5 text-sm text-vivero-dark hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4 mr-2" /> Mi perfil y pedidos
          </Link>
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