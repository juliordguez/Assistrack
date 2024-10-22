import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Para asegurarse de que las cookies (HttpOnly) se envíen con cada solicitud
});

// Variable para rastrear si el refresh token está siendo procesado
let isRefreshing = false;
let failedQueue = [];

// Función para procesar las peticiones que fallaron mientras se estaba renovando el token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Interceptor para manejar errores y renovar el token
apiClient.interceptors.response.use((response) => {
  // Si la respuesta es exitosa (código 200-299), simplemente devolver la respuesta
  return response;
}, async (error) => {
  const originalRequest = error.config;
  
  // Verificar si el error tiene una respuesta asociada
  if (error.response) {
    // Si el código de respuesta es 401 (no autorizado), manejar la renovación del token
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está renovando el token, guarda la petición en la cola
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Petición para obtener un nuevo access_token usando el refresh_token (enviado automáticamente en las cookies)
        const response = await apiClient.post('/auth/refresh');

        const newAccessToken = response.data.access_token;
        
        // Procesar la cola de peticiones fallidas
        processQueue(null, newAccessToken);

        // Reintentar la petición original con el nuevo access_token
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return apiClient(originalRequest);

      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  }

  // Si no es un 401, rechazar el error normalmente
  return Promise.reject(error);
});

export default apiClient;
