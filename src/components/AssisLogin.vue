<template>
  <div class="login-container">
    <div class="login-card">
      <div class="cloud-icon">
        <img src="path/to/cloud-icon.png" alt="Company Icon" />
      </div>
      <h2 class="company-name">Company Name</h2>
      <h3>Sign In</h3>
      <p>Hola, bienvenido a Control TEAP</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" placeholder="example@email.com" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" placeholder="••••••••" required />
        </div>
        <button type="submit" class="sign-in-button">Sign In</button>
      </form>

      <div class="forgot-password">
        <a href="#">Forgot Password?</a>
      </div>
      <div class="sign-up">
        <a href="#">Sign Up</a>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/ApiClient'; // Asegúrate de usar la ruta correcta a tu archivo apiClient

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        await apiClient.post('/auth/login', {
          email: this.email,
          password: this.password
        });

        // Redirigir a la página principal o ruta protegida
        this.$router.push('/');
      } catch (error) {
        // Manejo de errores
        console.log(error.response);
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.cloud-icon img {
  width: 50px;
  margin-bottom: 1rem;
}

.company-name {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 90%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.sign-in-button {
  width: 60%;
  padding: 10px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sign-in-button:hover {
  background-color: #e63946;
}

.forgot-password, .sign-up {
  margin-top: 1rem;
}

a {
  color: #ff5252;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
