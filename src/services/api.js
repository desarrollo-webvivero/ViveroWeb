const BASE_URL = import.meta.env.VITE_API_URL || 'https://vivero-backend-2.onrender.com';

// Rutas de clientes: si tu compañero las cambia, cámbialas AQUÍ
const RUTAS_CLIENTES = {
  registro: '/api/clientes/registro',
  verificar: '/api/clientes/verificar',
  reenviarCodigo: '/api/clientes/reenviar-codigo',
  login: '/api/clientes/login',
};

// Error que guarda el mensaje del backend y su código (status)
export class ErrorApi extends Error {
  constructor(mensaje, { status, requiereVerificacion = false } = {}) {
    super(mensaje);
    this.status = status;
    this.requiereVerificacion = requiereVerificacion;
  }
}

// Envía un POST con JSON. Devuelve la respuesta del backend, o lanza ErrorApi
// con el "mensaje" que mande el backend (ya viene en español).
async function postJson(ruta, cuerpo) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorApi('No pudimos conectar con el servidor. Intenta de nuevo en un momento.');
  }

  let datos = {};
  try {
    datos = await response.json();
  } catch {
    // la respuesta no trae JSON
  }

  if (!response.ok) {
    throw new ErrorApi(datos.mensaje || 'Ocurrió un error. Intenta de nuevo.', {
      status: response.status,
      requiereVerificacion: datos.requiereVerificacion === true,
    });
  }
  return datos;
}

// Lo que está a la IZQUIERDA de los ":" es el nombre que recibe el backend
export function registrarCliente({ nombre, correo, telefono, password, canal }) {
  return postJson(RUTAS_CLIENTES.registro, {
    nombreCompleto: nombre,
    correoElectronico: correo,
    telefono: telefono,
    contrasena: password,
    canalVerificacion: canal, // "EMAIL" o "WHATSAPP"
  });
}

export function verificarCuenta({ correo, codigo }) {
  return postJson(RUTAS_CLIENTES.verificar, {
    correoElectronico: correo,
    codigo: codigo,
  });
}

export function reenviarCodigo({ correo, canal }) {
  return postJson(RUTAS_CLIENTES.reenviarCodigo, {
    correoElectronico: correo,
    canalVerificacion: canal,
  });
}

export function loginCliente({ correo, password }) {
  return postJson(RUTAS_CLIENTES.login, {
    correoElectronico: correo,
    contrasena: password,
  });
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
  registrarCliente: registrarCliente,  
  verificarCuenta: verificarCuenta,
  reenviarCodigo: reenviarCodigo,
  verificarStock: verificarStock
};