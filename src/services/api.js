export const apiService = {
  crearProducto: async (productoData) => {
    const response = await fetch('https://vivero-backend-2.onrender.com/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar producto en la API');
    }

    return await response.json();
  }
};