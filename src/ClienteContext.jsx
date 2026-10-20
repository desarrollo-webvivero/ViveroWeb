import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  loginCliente as apiLoginCliente,
  registrarCliente as apiRegistrarCliente,
  verificarCuenta as apiVerificarCuenta,
  reenviarCodigo as apiReenviarCodigo,
} from './services/api';

const ClienteContext = createContext(null);

export const useCliente = () => {
  const ctx = useContext(ClienteContext);
  if (!ctx) throw new Error('useCliente debe usarse dentro de <ClienteProvider>');
  return ctx;
};

const CLAVE_STORAGE = 'cliente_vivero';

const leerSesionGuardada = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
};

// Convierte lo que responde el backend al formato que usa la página.
// El login responde: { mensaje, clienteId, nombreCompleto, correoElectronico }
const normalizarCliente = (d = {}) => ({
  id: d.clienteId ?? d.id ?? d.idCliente,
  nombre: d.nombreCompleto ?? d.nombre,
  correo: d.correoElectronico ?? d.correo,
  telefono: d.telefono,
});

export const ClienteProvider = ({ children }) => {
  // Sesión del CLIENTE (la del administrador sigue en AuthContext)
  const [cliente, setCliente] = useState(leerSesionGuardada);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [vistaInicial, setVistaInicial] = useState('login'); // 'login' | 'registro'

  const abrirAuth = useCallback((vista = 'login') => {
    setVistaInicial(vista);
    setAuthAbierto(true);
  }, []);

  const cerrarAuth = useCallback(() => setAuthAbierto(false), []);

  const guardarSesion = (data) => {
    // Nunca guardamos la contraseña; solo los datos que devuelve el backend
    const sesion = normalizarCliente(data);
    setCliente(sesion);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesion));
  };

  const iniciarSesion = async ({ correo, password }) => {
    const data = await apiLoginCliente({ correo, password });
    guardarSesion(data);
  };

  // Crea la cuenta y el backend envía el código. NO inicia sesión todavía:
  // primero hay que verificar el código.
  const registrar = (datos) => apiRegistrarCliente(datos);

  const verificar = (datos) => apiVerificarCuenta(datos);

  const reenviar = (datos) => apiReenviarCodigo(datos);

  const cerrarSesion = () => {
    setCliente(null);
    localStorage.removeItem(CLAVE_STORAGE);
  };

  return (
    <ClienteContext.Provider
      value={{
        cliente,
        estaLogueado: Boolean(cliente),
        authAbierto,
        vistaInicial,
        abrirAuth,
        cerrarAuth,
        iniciarSesion,
        registrar,
        verificar,
        reenviar,
        cerrarSesion,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};