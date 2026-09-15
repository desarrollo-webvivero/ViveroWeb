import React, { useState } from 'react';
import { X, Mail, Lock, User, Keyround, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen,onClose, onLoginSuccess }) {
    const [view, setView] = useState('login'); 
    const [Loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState ({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        codigo: ''
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        
        try {
            console.log('Intentando iniciar sesión con:', formData.email, formData.password);
            
            setTimeout(() => {
                setLoading(false);
                if (onLoginSuccess) onLoginSuccess();
                onClose();
            }, 1000);
        }catch (err) {
            setLoading(false);
            setErrorMsg('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            console.log('Registrando usuario:',formData);

            setTimeout(() => {
                setLoading(false);
                setView('verify');
            }, 1000);

        } catch (err) {
            setLoading(false);
            setErrorMsg('Error al registrar la cuenta. Por favor, inténtalo de nuevo.');
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try{
            console.log('Verificando código:', formData.codigo, 'para:', formData.email);

            setTimeout(() => {
                setLoading(false);
                alert('¡Cuenta verificada con éxito!');
                if (onLoginSuccess) onLoginSuccess();
                onClose();
            }, 1000);
        } catch (err) {
            setLoading(false);
            setErrorMsg('Codigo incorrecto o expirado. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        /* CAPA CONTENEDORA (Fondo Oscuro con Desfoque) */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vivero-dark/60 backdrop-blur-md transition-opacity">
      
      {/* TARJETA BLANCA PRINCIPAL */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-vivero-green/20 overflow-hidden transform transition-all">
        
        {/* BOTÓN CERRAR (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-vivero-dark bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ENCABEZADO Y TÍTULOS DINÁMICOS */}
        <div className="p-6 bg-vivero-cream text-center border-b border-vivero-green/10">
          <img src="/logo.png" alt="Vivero Pensamiento" className="h-12 mx-auto mb-2" />
          <h2 className="text-xl font-serif font-bold text-vivero-dark">
            {view === 'login' && '¡Bienvenido de nuevo!'}
            {view === 'register' && 'Crea tu Cuenta'}
            {view === 'verify' && 'Verifica tu Correo'}
          </h2>
          <p className="text-xs text-vivero-dark/70 mt-1">
            {view === 'login' && 'Ingresa tus datos para continuar con tu compra'}
            {view === 'register' && 'Regístrate para gestionar tus compras y envíos'}
            {view === 'verify' && `Hemos enviado un código de 6 dígitos a ${formData.email}`}
          </p>
        </div>

        {/* CAJA DE ERRORES */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <div className="p-6">
          {/* ================= VISTA 1: LOGIN ================= */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-vivero-green hover:bg-opacity-90 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center pt-2 text-xs text-vivero-dark/70">
                ¿No tienes una cuenta?{' '}
                <button 
                  type="button" 
                  onClick={() => { setView('register'); setErrorMsg(''); }} 
                  className="font-bold text-vivero-purple hover:underline"
                >
                  Regístrate aquí
                </button>
              </div>
            </form>
          )}

          {/* ================= VISTA 2: REGISTRO ================= */}
          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-vivero-purple hover:bg-opacity-90 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta y Enviar Código'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-vivero-dark/70">
                ¿Ya tienes cuenta?{' '}
                <button 
                  type="button" 
                  onClick={() => { setView('login'); setErrorMsg(''); }} 
                  className="font-bold text-vivero-green hover:underline"
                >
                  Inicia sesión
                </button>
              </div>
            </form>
          )}

          {/* ================= VISTA 3: VERIFICACIÓN CÓDIGO ================= */}
          {view === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vivero-dark mb-1 text-center">Código de Verificación</label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="codigo"
                    required
                    maxLength={6}
                    value={formData.codigo}
                    onChange={handleChange}
                    placeholder="123456" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-vivero-green focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || formData.codigo.length < 6}
                className="w-full py-3 bg-vivero-green hover:bg-opacity-90 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{loading ? 'Verificando...' : 'Confirmar Código'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-vivero-dark/70">
                ¿No recibiste el correo?{' '}
                <button 
                  type="button" 
                  onClick={() => alert('Nuevo código enviado')}
                  className="font-bold text-vivero-purple hover:underline"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    );




}