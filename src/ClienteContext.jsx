import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  loginCliente as apiLoginCliente,
  registrarCliente as apiRegistrarCliente,
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
    // Nunca guardamos la contraseña; solo lo que devuelva el backend
    const datos = data?.cliente ?? data;
    setCliente(datos);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
  };

  const iniciarSesion = async ({ correo, password }) => {
    const data = await apiLoginCliente({ correo, password });
    guardarSesion(data);
  };

  const registrar = async ({ nombre, correo, telefono, password }) => {
    await apiRegistrarCliente({ nombre, correo, telefono, password });
    // Tras registrarse, iniciamos sesión automáticamente
    await iniciarSesion({ correo, password });
  };

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
        cerrarSesion,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};