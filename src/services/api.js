// URL base que apuntará a App Runner o Localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiService = {
  // Petición POST para Login (autentica contra la tabla USUARIOS)
  login: async (password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    return await response.json();
  },

  // Petición POST para guardar planta (inserta en las tablas PRODUCTOS / CATEGORIAS)
  crearProducto: async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoData)
    });

    if (!response.ok) {
      throw new Error('Error al registrar la planta en la base de datos');
    }

    return await response.json();
  }
};