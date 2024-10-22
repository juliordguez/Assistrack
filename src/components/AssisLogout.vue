<template>
  <div>Logging out...</div>
</template>

<script>
import apiClient from '@/ApiClient'; // Asegúrate de que la ruta sea correcta

export default {
  async created() {
    try {
      // Llamada al backend para realizar el logout
      await apiClient.post('/auth/logout'); // Llama al endpoint de logout

      // Si usabas localStorage, elimina estos elementos si los estás usando
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirige al login después de limpiar
      this.$router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Redirigir al login incluso si hay un error (opcional)
      this.$router.push("/login");
    }
  }
};
</script>
