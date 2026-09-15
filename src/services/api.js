const BASE_URL = 'https://vivero-backend-2.onrender.com';



// Función auxiliar para manejar respuestas de la API de forma limpia
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Ocurrió un error en el servidor');
  }
  return data;
}

export const api = {
  // 1. Iniciar Sesión
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // 2. Registrar Usuario (Dispara el envío de correo con código)
  register: async ({ nombre, email, password }) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    return handleResponse(response);
  },

  // 3. Verificar Código de 6 Dígitos
  verifyEmail: async ({ email, codigo }) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo }),
    });
    return handleResponse(response);
  },

  // 4. Crear Orden de Pago en PayPal (Backend consulta precios reales)
  createPayPalOrder: async (cartItems) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/payments/create-paypal-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Autenticación por JWT
      },
      body: JSON.stringify({ items: cartItems }),
    });
    return handleResponse(response);
  },

  // 5. Capturar Pago de PayPal (Confirma que el cliente pagó)
  capturePayPalOrder: async (orderId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/payments/capture-paypal-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId }),
    });
    return handleResponse(response);
  }
};

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