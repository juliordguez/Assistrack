import { createRouter, createWebHistory } from 'vue-router';
import apiClient from './ApiClient';
import Dashboard from './components/AssisDashboard.vue';
import Messages from './components/AssisMessages.vue';
import Users from './components/AssisUsers.vue';
import Groups from './components/AssisGroups.vue';
import AbsenceHistories from './components/AssisAbsence.vue';
import Incapacity from './components/AssisIncapacity.vue';
import MealLog from './components/AssisMealLog.vue';
import VacationPermission from './components/AssisVacationPermission.vue';
import TardinessPermission from './components/AssisTardinessPermission.vue';
import Login from './components/AssisLogin.vue';
import Logout from './components/AssisLogout.vue';
import AsistenciaEntrada from './components/AppHoraEntrada.vue';


// // Función para obtener el valor de una cookie (no utilizada ahora)
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/messages', component: Messages, meta: { requiresAuth: true } },
  { path: '/users', component: Users, meta: { requiresAuth: true } },
  { path: '/groups', component: Groups, meta: { requiresAuth: true } },
  { path: '/absenceHistories', component: AbsenceHistories, meta: { requiresAuth: true } },
  { path: '/incapacityPermissions', component: Incapacity, meta: { requiresAuth: true } },
  { path: '/mealLogs', component: MealLog, meta: { requiresAuth: true } },
  { path: '/vacationPermissions', component: VacationPermission, meta: { requiresAuth: true } },
  { path: '/tardinessPermissions', component: TardinessPermission, meta: { requiresAuth: true } },
  { path: '/login', component: Login, name: 'Login' },
  {path: '/logout', name: 'logout', component: Logout},
  {path: '/asistencia/registro-entrada', name: 'AsistenciaEntrada', component: AsistenciaEntrada}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach(async (to, from, next) => {
    try {
      // Si la ruta requiere autenticación
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // Llamada al backend para verificar si la sesión es válida
        const response = await apiClient.get('/auth/verify'); // Ruta para verificar la validez del token en las cookies
        if (response.status === 200) {
          next(); // Permitir el acceso si la respuesta es exitosa
        } else {
          // Si no se recibe 200, intentar renovar el token
          await refreshAccessToken();
          next(); // Permitir el acceso tras la renovación
        }
      } else {
        next(); // Permitir el acceso si no requiere autenticación
      }
    } catch (error) {
      // Manejar errores 401
      if (error.response && error.response.status === 401) {
        // Intentar renovar el token
        try {
          await refreshAccessToken();
          next(); // Permitir el acceso tras la renovación
        } catch (refreshError) {
          console.error("Error al renovar el token:", refreshError);
          next('/login'); // Redirigir a login si la renovación falla
        }
      } else {
        // Manejar otros errores de manera adecuada
        console.error("Error al verificar la sesión:", error);
        next(); // O continuar según el caso
      }
    }
  });


// Función para renovar el access token
async function refreshAccessToken() {
    try {
      const response = await apiClient.post('/auth/refresh'); // Ruta para renovar el token
      if (response.status === 200) {
        console.log('Token renovado exitosamente');
        // El nuevo token se manejará automáticamente en las cookies
        return response.data.access_token; // Opcional, puedes devolver el token si lo necesitas
      }
    } catch (error) {
      console.error("Error al intentar renovar el token:", error);
      throw error; // Lanzar el error para manejarlo en el guard
    }
  }

export default router;



// import { createRouter, createWebHistory } from 'vue-router';
// import apiClient from './ApiClient'; // Asegúrate de importar apiClient correctamente
// import Dashboard from './components/AssisDashboard.vue';
// import Messages from './components/AssisMessages.vue';
// import Users from './components/AssisUsers.vue';
// import Groups from './components/AssisGroups.vue';
// import AbsenceHistories from './components/AssisAbsence.vue';
// import Incapacity from './components/AssisIncapacity.vue';
// import MealLog from './components/AssisMealLog.vue';
// import VacationPermission from './components/AssisVacationPermission.vue';
// import TardinessPermission from './components/AssisTardinessPermission.vue';
// import Login from './components/AssisLogin.vue';

// const routes = [
//   { path: '/', component: Dashboard, meta: { requiresAuth: true }},
//   { path: '/messages', component: Messages, meta: { requiresAuth: true }},
//   { path: '/users', component: Users, meta: { requiresAuth: true }},
//   { path: '/groups', component: Groups, meta: { requiresAuth: true }},
//   { path: '/absenceHistories', component: AbsenceHistories, meta: { requiresAuth: true }},
//   { path: '/incapacityPermissions', component: Incapacity, meta: { requiresAuth: true }},
//   { path: '/mealLogs', component: MealLog, meta: { requiresAuth: true }},
//   { path: '/vacationPermissions', component: VacationPermission, meta: { requiresAuth: true }},
//   { path: '/tardinessPermissions', component: TardinessPermission, meta: { requiresAuth: true }},
//   { path: '/login', component: Login, name: 'Login' },  // Añadimos el nombre de la ruta
//   {
//     path: '/logout',
//     beforeEnter(to, from, next) {
//       const refreshToken = localStorage.getItem('refreshToken');
  
//       if (refreshToken) {
//         apiClient.post('/auth/logout', { refresh_token: refreshToken })
//           .then(() => {
//             localStorage.removeItem('accessToken'); 
//             localStorage.removeItem('refreshToken');
//             console.log(localStorage.getItem('refreshToken'));
//             console.log(localStorage.getItem('refreshToken'));

//             next({ path: '/login' });
//           })
//           .catch((error) => {
//             console.error('Error invalidando el token en el servidor:', error);
//             if (error.response && error.response.status === 401) {
//               localStorage.removeItem('accessToken');
//               localStorage.removeItem('refreshToken');
//             }
//             next({ path: '/login' });
//           });
//       } else {
//         localStorage.removeItem('accessToken'); 
//         next({ path: '/login' });
//       }
//     }
//   },
//   { path: '/:pathMatch(.*)*', redirect: '/login' }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// // **Guardia de navegación global**
// router.beforeEach((to, from, next) => {
//   const accessToken = localStorage.getItem('access_token');
  
//   // Si la ruta requiere autenticación
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!accessToken) {
//       // Si no hay token, redirigir al login
//       next({ name: 'Login' });
//     } else {
//       // Si hay token, permitir el acceso
//       next();
//     }
//   } else {
//     // Si no requiere autenticación, continuar
//     next();
//   }
// });

// export default router;
