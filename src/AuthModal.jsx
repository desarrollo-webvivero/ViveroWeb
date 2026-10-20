import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Leaf, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCliente } from './ClienteContext';

const formVacio = {
  nombre: '',
  correo: '',
  telefono: '',
  password: '',
  confirmar: '',
  canal: 'EMAIL', // "EMAIL" o "WHATSAPP"
  codigo: '',
};

const ESPERA_REENVIO = 30; // segundos antes de poder pedir otro código

// Misma regla que el backend: mínimo 8 caracteres, con letras y números
const contrasenaValida = (p) => p.length >= 8 && /\p{L}/u.test(p) && /\d/.test(p);

// Definido fuera del componente para que los inputs no pierdan el foco al escribir
function Campo({ icono: Icono, derecha, ...props }) {
  return (
    <div className="relative">
      <Icono className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vivero-dark/40 w-5 h-5" />
      <input
        {...props}
        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-purple outline-none transition-shadow"
      />
      {derecha}
    </div>
  );
}

function SelectorCanal({ valor, onElegir, titulo }) {
  const opciones = [
    { id: 'EMAIL', texto: 'Correo' },
    { id: 'WHATSAPP', texto: 'WhatsApp' },
  ];
  return (
    <div>
      <p className="text-sm font-medium text-vivero-dark/70 mb-2">{titulo}</p>
      <div className="grid grid-cols-2 gap-2">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onElegir(o.id)}
            aria-pressed={valor === o.id}
            className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              valor === o.id
                ? 'border-vivero-purple bg-vivero-purple/10 text-vivero-purple'
                : 'border-gray-200 text-vivero-dark/60 hover:border-vivero-purple/40'
            }`}
          >
            {o.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

// Solo existe mientras el modal está abierto: así el formulario siempre arranca limpio
export default function AuthModal() {
  const { authAbierto } = useCliente();
  if (!authAbierto) return null;
  return <AuthModalContenido />;
}

function AuthModalContenido() {
  const { vistaInicial, cerrarAuth, iniciarSesion, registrar, verificar, reenviar } = useCliente();

  const [vista, setVista] = useState(vistaInicial); // 'login' | 'registro' | 'verificacion'
  const [form, setForm] = useState(formVacio);
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);
  const [espera, setEspera] = useState(0);

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') cerrarAuth();
    };
    document.addEventListener('keydown', onKey);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrevio;
    };
  }, [cerrarAuth]);

  // Cuenta regresiva del botón "Reenviar código"
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const esLogin = vista === 'login';
  const esRegistro = vista === 'registro';
  const esVerificacion = vista === 'verificacion';
  const nombreCanal = form.canal === 'WHATSAPP' ? 'WhatsApp' : 'correo';

  const cambiarVista = (nueva) => {
    setVista(nueva);
    setError('');
    setAviso('');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCodigo = (e) => setForm({ ...form, codigo: e.target.value.replace(/\D/g, '').slice(0, 6) });
  const elegirCanal = (canal) => setForm({ ...form, canal });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    const correo = form.correo.trim();

    if (esRegistro) {
      if (!contrasenaValida(form.password)) {
        setError('La contraseña debe tener al menos 8 caracteres, con letras y números.');
        return;
      }
      if (form.password !== form.confirmar) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (form.canal === 'WHATSAPP' && !form.telefono.trim()) {
        setError('Para recibir el código por WhatsApp necesitas indicar tu teléfono.');
        return;
      }
    }

    setCargando(true);
    try {
      if (esLogin) {
        await iniciarSesion({ correo, password: form.password });
        cerrarAuth();
      } else if (esRegistro) {
        const datos = await registrar({
          nombre: form.nombre.trim(),
          correo,
          telefono: form.telefono.trim(),
          password: form.password,
          canal: form.canal,
        });
        setVista('verificacion');
        if (datos.codigoEnviado === false) {
          setAviso('Cuenta creada, pero no pudimos enviar el código. Presiona "Reenviar código".');
        } else {
          setAviso(`¡Cuenta creada! Te enviamos un código de 6 dígitos por ${nombreCanal}.`);
          setEspera(ESPERA_REENVIO);
        }
      } else {
        // Verificación: si el código es correcto, entramos directo
        await verificar({ correo, codigo: form.codigo });
        await iniciarSesion({ correo, password: form.password });
        cerrarAuth();
      }
    } catch (err) {
      if (esLogin && err.requiereVerificacion) {
        // Credenciales correctas pero la cuenta aún no está verificada
        setVista('verificacion');
        setAviso('Tu cuenta aún no está verificada. Escribe el código que te enviamos o solicita uno nuevo.');
      } else if (esRegistro && err.status === 409) {
        setError(`${err.message} Si aún no verificaste tu cuenta, usa "Iniciar sesión" para continuar con la verificación.`);
      } else {
        setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleReenviar = async () => {
    setError('');
    setAviso('');
    setCargando(true);
    try {
      await reenviar({ correo: form.correo.trim(), canal: form.canal });
      setAviso(`Si todo está bien, te enviamos un nuevo código por ${nombreCanal}.`);
      setEspera(ESPERA_REENVIO);
    } catch (err) {
      setError(err.message || 'No pudimos enviar el código. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const botonOjo = (
    <button
      type="button"
      onClick={() => setVerPassword(!verPassword)}
      aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-vivero-dark/40 hover:text-vivero-dark transition-colors"
    >
      {verPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );

  const titulo = esLogin ? 'Bienvenido de nuevo' : esRegistro ? 'Crea tu cuenta' : 'Verifica tu cuenta';
  const subtitulo = esLogin
    ? 'Inicia sesión para ver tus pedidos y comprar más rápido.'
    : esRegistro
      ? 'Regístrate para guardar tus datos y dar seguimiento a tus pedidos.'
      : `Escribe el código de 6 dígitos que enviamos a ${form.correo.trim()}.`;
  const textoBoton = esLogin ? 'Iniciar sesión' : esRegistro ? 'Crear cuenta' : 'Verificar cuenta';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-vivero-dark/60 backdrop-blur-sm"
      onClick={cerrarAuth}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-titulo"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-8 border border-vivero-green/20"
      >
        <button
          type="button"
          onClick={cerrarAuth}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-2 text-vivero-dark/40 hover:text-vivero-dark hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-vivero-dark w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-vivero-yellow">
            {esVerificacion ? <ShieldCheck className="w-7 h-7" /> : <Leaf className="w-7 h-7" />}
          </div>
          <h2 id="auth-titulo" className="text-2xl font-bold text-vivero-dark font-serif">
            {titulo}
          </h2>
          <p className="text-vivero-dark/60 text-sm mt-1">{subtitulo}</p>
        </div>

        {/* Pestañas (no se muestran mientras se verifica el código) */}
        {!esVerificacion && (
          <div className="grid grid-cols-2 bg-vivero-cream rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => cambiarVista('login')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                esLogin ? 'bg-white text-vivero-purple shadow-sm' : 'text-vivero-dark/60 hover:text-vivero-dark'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => cambiarVista('registro')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                esRegistro ? 'bg-white text-vivero-purple shadow-sm' : 'text-vivero-dark/60 hover:text-vivero-dark'
              }`}
            >
              Registrarse
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {esRegistro && (
            <Campo
              icono={User}
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              autoComplete="name"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          )}

          {!esVerificacion && (
            <Campo
              icono={Mail}
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              autoComplete="email"
              value={form.correo}
              onChange={handleChange}
              required
            />
          )}

          {esRegistro && (
            <Campo
              icono={Phone}
              type="tel"
              name="telefono"
              placeholder="Teléfono (ej. 5555-1234)"
              autoComplete="tel"
              inputMode="tel"
              value={form.telefono}
              onChange={handleChange}
              required={form.canal === 'WHATSAPP'}
            />
          )}

          {!esVerificacion && (
            <Campo
              icono={Lock}
              type={verPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              autoComplete={esLogin ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={handleChange}
              derecha={botonOjo}
              required
            />
          )}

          {esRegistro && (
            <>
              <Campo
                icono={Lock}
                type={verPassword ? 'text' : 'password'}
                name="confirmar"
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                value={form.confirmar}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-vivero-dark/50 -mt-2">
                Mínimo 8 caracteres, con letras y números.
              </p>
              <SelectorCanal
                titulo="¿Dónde quieres recibir tu código de verificación?"
                valor={form.canal}
                onElegir={elegirCanal}
              />
            </>
          )}

          {esVerificacion && (
            <>
              <Campo
                icono={ShieldCheck}
                type="text"
                name="codigo"
                placeholder="Código de 6 dígitos"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                value={form.codigo}
                onChange={handleCodigo}
                required
              />
              <SelectorCanal
                titulo="Si necesitas un código nuevo, envíalo por:"
                valor={form.canal}
                onElegir={elegirCanal}
              />
            </>
          )}

          {aviso && (
            <p role="status" className="text-vivero-dark text-sm text-center bg-vivero-green/10 rounded-xl px-4 py-3">
              {aviso}
            </p>
          )}

          {error && (
            <p role="alert" className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando || (esVerificacion && form.codigo.length !== 6)}
            className="w-full bg-vivero-purple text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cargando ? 'Un momento…' : textoBoton}
          </button>

          {esVerificacion && (
            <button
              type="button"
              onClick={handleReenviar}
              disabled={cargando || espera > 0}
              className="w-full py-3 rounded-xl text-sm font-semibold text-vivero-purple border border-vivero-purple/30 hover:bg-vivero-purple/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {espera > 0 ? `Reenviar código (${espera}s)` : 'Reenviar código'}
            </button>
          )}
        </form>

        {esVerificacion ? (
          <p className="text-center text-sm text-vivero-dark/60 mt-6">
            <button
              type="button"
              onClick={() => cambiarVista('login')}
              className="inline-flex items-center font-semibold text-vivero-purple hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver a iniciar sesión
            </button>
          </p>
        ) : (
          <p className="text-center text-sm text-vivero-dark/60 mt-6">
            {esLogin ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => cambiarVista(esLogin ? 'registro' : 'login')}
              className="font-semibold text-vivero-purple hover:underline"
            >
              {esLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}