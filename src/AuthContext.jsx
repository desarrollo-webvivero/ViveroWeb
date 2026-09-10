import React, { createContext, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (password) => {
    // Contraseña maestra temporal. Luego la validaremos con tu API de Spring Boot
    if (password === 'vivero2026') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente "Guardia de Seguridad"
export const RutaProtegida = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Si no está autenticado, lo patea a la pantalla de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, lo deja pasar al panel
  return children;
};