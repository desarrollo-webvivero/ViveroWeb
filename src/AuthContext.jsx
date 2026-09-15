import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';

// 1. Crear el contexto global
const AuthContext = createContext();

// 2. Proveedor de autenticación (AuthProvider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado revisando localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error al recuperar sesión local:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de Login conectada a la API
  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { token: newToken, user: userData } = response;

      if (userData && !userData.is_verified) {
        throw new Error('Debes verificar tu correo electrónico antes de ingresar.');
      }

      if (newToken && userData) {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Función de Registro
  const register = async (nombre, email, password) => {
    try {
      const response = await api.register({ nombre, email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Función de Verificación de Código
  const verifyCode = async (email, codigo) => {
    try {
      const response = await api.verifyEmail({ email, codigo });
      const { token: newToken, user: userData } = response;

      if (newToken && userData) {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Función de Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user && user.is_verified;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      loading, 
      login, 
      register, 
      verifyCode, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Componente para proteger rutas privadas
export const RutaProtegida = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; // Esperar mientras se verifica el localStorage

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// 4. Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};