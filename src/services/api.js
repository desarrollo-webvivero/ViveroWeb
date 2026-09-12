const BASE_URL = 'https://vivero-backend-2.onrender.com';



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

export async function verificarStock(productoId, cantidad) {
  const response = await fetch(`${BASE_URL}/api/productos/verificar-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productoId, cantidad }),
  });
  return response;
}

export async function obtenerProductos() {
  const response = await fetch(`${BASE_URL}/api/productos`);
  if (!response.ok) {
    throw new Error('Error al cargar inventario');
  }
  return response.json();
}

// Nota: Al recibir archivos (FormData), el navegador asigna los headers automáticamente.
export async function crearProducto(formData) {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    method: 'POST',
    body: formData, 
  });

  if (!response.ok) {
    throw new Error('Error al guardar el producto en la base de datos');
  }
  return response.json();
}

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

export async function eliminarProducto(id) {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el producto');
  }
  return true;
}



export const apiService = {
  login: loginCliente,
  verificarStock: verificarStock,
  obtenerProductos: obtenerProductos,
  crearProducto: crearProducto,
  actualizarProducto: actualizarProducto,
  eliminarProducto: eliminarProducto
};