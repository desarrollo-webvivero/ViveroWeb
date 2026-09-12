const BASE_URL = 'https://vivero-backend-2.onrender.com';

// Funciones individuales
export async function loginCliente(credenciales) {
  const response = await fetch(`${BASE_URL}/api/clientes/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas o error en el servidor');
  }
  return response.json();
}

export async function registrarProducto(productoData) {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productoData),
  });

  if (!response.ok) {
    throw new Error('Error al guardar el producto en la base de datos');
  }
  return response.json();
}

export async function verificarStock(productoId, cantidad) {
  const response = await fetch(`${BASE_URL}/api/productos/verificar-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productoId, cantidad }),
  });
  return response;
}

// Objeto apiService para compatibilidad con AdminPanel.jsx
export const apiService = {
  crearProducto: registrarProducto,
  login: loginCliente,
  verificarStock: verificarStock
};