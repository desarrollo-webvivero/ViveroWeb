import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Leaf } from 'lucide-react';
import { useCliente } from './ClienteContext';

const formVacio = { nombre: '', correo: '', telefono: '', password: '', confirmar: '' };

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

export default function AuthModal() {
  const { authAbierto, vistaInicial, cerrarAuth, iniciarSesion, registrar } = useCliente();

  const [vista, setVista] = useState('login');
  const [form, setForm] = useState(formVacio);
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Al abrir: formulario limpio y pestaña solicitada
  useEffect(() => {
    if (authAbierto) {
      setVista(vistaInicial);
      setForm(formVacio);
      setError('');
      setVerPassword(false);
      setCargando(false);
    }
  }, [authAbierto, vistaInicial]);

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto
  useEffect(() => {
    if (!authAbierto) return;
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
  }, [authAbierto, cerrarAuth]);

  if (!authAbierto) return null;

  const esLogin = vista === 'login';

  const cambiarVista = (nueva) => {
    setVista(nueva);
    setError('');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!esLogin) {
      if (form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (form.password !== form.confirmar) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setCargando(true);
    try {
      if (esLogin) {
        await iniciarSesion({ correo: form.correo.trim(), password: form.password });
      } else {
        await registrar({
          nombre: form.nombre.trim(),
          correo: form.correo.trim(),
          telefono: form.telefono.trim(),
          password: form.password,
        });
      }
      cerrarAuth();
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
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
            <Leaf className="w-7 h-7" />
          </div>
          <h2 id="auth-titulo" className="text-2xl font-bold text-vivero-dark font-serif">
            {esLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p className="text-vivero-dark/60 text-sm mt-1">
            {esLogin
              ? 'Inicia sesión para ver tus pedidos y comprar más rápido.'
              : 'Regístrate para guardar tus datos y dar seguimiento a tus pedidos.'}
          </p>
        </div>

        {/* Pestañas */}
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
              !esLogin ? 'bg-white text-vivero-purple shadow-sm' : 'text-vivero-dark/60 hover:text-vivero-dark'
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!esLogin && (
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

          {!esLogin && (
            <Campo
              icono={Phone}
              type="tel"
              name="telefono"
              placeholder="Teléfono (ej. 5555-1234)"
              autoComplete="tel"
              inputMode="tel"
              minLength={8}
              value={form.telefono}
              onChange={handleChange}
              required
            />
          )}

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

          {!esLogin && (
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
          )}

          {error && (
            <p role="alert" className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-vivero-purple text-white font-bold py-3.5 rounded-xl hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cargando ? 'Un momento…' : esLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

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
      </div>
    </div>
  );
}