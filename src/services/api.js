
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

// Registro de productos (soporta FormData con imagen)
export async function registrarProducto(formData) {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    method: 'POST',
    body: formData, 
  });

  if (!response.ok) {
    throw new Error('Error al guardar el producto en la base de datos');
  }
  return response.json();
}

// Obtener la lista completa de productos
export async function obtenerProductos() {
  const response = await fetch(`${BASE_URL}/api/productos`);
  if (!response.ok) {
    throw new Error('Error al obtener la lista de productos');
  }
  return response.json();
}

// Actualizar un producto existente
export async function actualizarProducto(id, formData) {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el producto');
  }
  return response.json();
}

// Eliminar un producto
export async function eliminarProducto(id) {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
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

// Objeto apiService para compatibilidad completa con AdminPanel.jsx
export const apiService = {
  crearProducto: registrarProducto,
  obtenerProductos: obtenerProductos,
  actualizarProducto: actualizarProducto,
  eliminarProducto: eliminarProducto,
  login: loginCliente,
  verificarStock: verificarStock
};