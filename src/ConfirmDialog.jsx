import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';

// Ventana de confirmación reutilizable para toda la página.
//
// Uso en cualquier componente:
//   const confirmar = useConfirm();
//   const ok = await confirmar({ titulo: '¿Cerrar sesión?', mensaje: '...', textoConfirmar: 'Sí, salir' });
//   if (!ok) return;
//
// Opciones: titulo, mensaje (texto o JSX), textoConfirmar, textoCancelar, peligro (true = botón rojo)

const ConfirmContext = createContext(null);

export function useConfirm() {
  const confirmar = useContext(ConfirmContext);
  if (!confirmar) throw new Error('useConfirm debe usarse dentro de <ConfirmProvider>');
  return confirmar;
}

export function ConfirmProvider({ children }) {
  const [dialogo, setDialogo] = useState(null);
  const resolverRef = useRef(null);

  // Abre la ventana y devuelve una promesa: true si confirma, false si cancela
  const confirmar = useCallback(
    (opciones = {}) =>
      new Promise((resolve) => {
        resolverRef.current?.(false); // si había otra abierta, se cancela
        resolverRef.current = resolve;
        setDialogo({
          titulo: '¿Estás seguro?',
          mensaje: '',
          textoConfirmar: 'Sí, continuar',
          textoCancelar: 'Cancelar',
          peligro: false,
          ...opciones,
        });
      }),
    []
  );

  const responder = useCallback((resultado) => {
    resolverRef.current?.(resultado);
    resolverRef.current = null;
    setDialogo(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {dialogo && <VentanaConfirmacion {...dialogo} onResponder={responder} />}
    </ConfirmContext.Provider>
  );
}

function VentanaConfirmacion({ titulo, mensaje, textoConfirmar, textoCancelar, peligro, onResponder }) {
  const botonConfirmarRef = useRef(null);

  // Escape = cancelar, foco en el botón principal y sin scroll del fondo
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onResponder(false);
    };
    document.addEventListener('keydown', onKey);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    botonConfirmarRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onResponder]);

  const Icono = peligro ? AlertTriangle : HelpCircle;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-vivero-dark/60 backdrop-blur-sm"
      onMouseDown={() => onResponder(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        aria-describedby="confirm-mensaje"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-vivero-green/20 text-center"
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            peligro ? 'bg-red-50 text-red-500' : 'bg-vivero-dark text-vivero-yellow'
          }`}
        >
          <Icono className="w-7 h-7" />
        </div>

        <h2 id="confirm-titulo" className="text-2xl font-bold font-serif text-vivero-dark mb-2">
          {titulo}
        </h2>
        {mensaje && (
          <div id="confirm-mensaje" className="text-vivero-dark/70 text-sm mb-6">
            {mensaje}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={() => onResponder(false)}
            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-vivero-dark/70 hover:bg-gray-50 transition-colors"
          >
            {textoCancelar}
          </button>
          <button
            ref={botonConfirmarRef}
            type="button"
            onClick={() => onResponder(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-colors ${
              peligro ? 'bg-red-500 hover:bg-red-600' : 'bg-vivero-dark hover:bg-vivero-green'
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}