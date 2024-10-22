<template>
  <div class="cards-container">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card"
      @click="navigateTo(card.route)"
    >
      <img :src="card.icon" alt="Call Center Icon" class="card-icon" />
      <div class="card-content">
        <h3>{{ card.title }}</h3>
        <p>{{ card.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallCenterCards',
  data() {
    return {
      cards: [
        {
          title: 'Hora de entrada',
          subtitle: 'Registra tu asistencia aqui',
          icon: require('@/assets/logo.png'),
          route: '/asistencia/registro-entrada'
        },
        {
          title: 'Entrada a comedor',
          subtitle: 'Registra ru entrada a comedor',
          icon: require('@/assets/logo.png'),
          route: '/comedor/registro-entrada'
        },
        {
          title: 'Salida de comedor',
          subtitle: 'Registra tu salida de comedor',
          icon: require('@/assets/logo.png'),
          route: '/comedor/registro-salida'
        },
        {
          title: 'Hora de salida',
          subtitle: 'Registra tu hora de salida aqui',
          icon: require('@/assets/logo.png'),
          route: '/asistencia/registro-entrada'
        },
        // Añade más tarjetas según sea necesario
      ]
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  padding: 16px;
  width: 100%;
  height: 0vh;
  align-items:first baseline;
  justify-items: center;
}

.card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0px;
  width: 100%;
  max-width: 250px;
  height: 200px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
}

.card:hover {
  background-color: #f0f0f0;
}

.card-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  margin-top: 60px;
}

.card-content h3 {
  margin: 0;
  font-size: 1.2em;
}

.card-content p {
  margin: 0;
  color: #777;
  font-size: 1em;
}
</style>
