<template>
    <div>
      <button @click="openCamera">Abrir Cámara</button>
      <div v-if="showVideo">
        <video ref="video" class="video-preview" autoplay></video>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CameraComponent',
    data() {
      return {
        showVideo: false,
        videoStream: null,
        ws: null, // Almacenar la instancia de WebSocket
      };
    },
    methods: {
      openCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              this.videoStream = stream;
              this.$refs.video.srcObject = stream;
              this.showVideo = true;
  
              // Si la conexión WebSocket está abierta, puedes enviar mensajes si lo necesitas
              if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send('Cámara activada');
              }
            })
            .catch(error => {
              console.error('Error accediendo a la cámara:', error);
              this.handleCameraError(error);
            });
        } else {
          console.error('La cámara no es soportada por el navegador.');
        }
      },
      stopCamera() {
        if (this.videoStream) {
          this.videoStream.getTracks().forEach(track => track.stop());
          this.videoStream = null;
          this.showVideo = false;
  
          // Enviar un mensaje a través del WebSocket si la cámara se detiene
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('Cámara detenida');
          }
        }
      },
      handleCameraError(error) {
        if (error.name === 'NotAllowedError') {
          alert('Permiso denegado para acceder a la cámara. Asegúrate de haber permitido el acceso a la cámara en la configuración del navegador.');
        } else if (error.name === 'NotFoundError') {
          alert('No se encontró una cámara disponible. Verifica que esté conectada.');
        } else {
          alert('Error desconocido al intentar acceder a la cámara. Intenta nuevamente.');
        }
      },
      initWebSocket() {
        // Inicializa la conexión WebSocket
        this.ws = new WebSocket('wss://192.168.30.116:8083/ws');
  
        // Maneja eventos WebSocket
        this.ws.onopen = () => {
          console.log('WebSocket conectado.');
          this.ws.send('Conexión establecida desde el cliente.');
        };
  
        this.ws.onmessage = event => {
          console.log('Mensaje recibido del servidor:', event.data);
          // Puedes manejar el mensaje del servidor aquí
        };
  
        this.ws.onclose = () => {
          console.log('WebSocket desconectado, intentando reconectar...');
          // Intenta reconectar si la conexión se cierra
          setTimeout(() => {
            this.initWebSocket();
          }, 5000);
        };
  
        this.ws.onerror = error => {
          console.error('Error en la conexión WebSocket:', error);
        };
      }
    },
    mounted() {
      this.initWebSocket(); // Inicia la conexión WebSocket cuando el componente se monta
    },
    beforeUnmount() {
      this.stopCamera();
  
      // Cierra la conexión WebSocket si está abierta
      if (this.ws) {
        this.ws.close();
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .video-preview {
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  </style>
  