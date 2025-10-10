import { FetchInstance } from './instance';

// Creamos una instancia de nuestra clase FetchInstance
const serverApi = FetchInstance({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000', // Asegúrate de que esta URL es correcta
    headers: {
        'Content-Type': 'application/json',
        // Puedes añadir encabezados comunes aquí, como el de autorización
    },
});

export default serverApi;
