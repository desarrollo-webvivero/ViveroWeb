import React, { createContext, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { apiService } from './services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (password) => {
   try {
      // Reemplaza la validación local ('vivero2026') por la consulta a Spring Boot
      const data = await apiService.login(password);
      if (data.success || data.token) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al autenticar:", error);
      return false;
    }
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