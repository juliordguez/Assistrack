const fs = require('fs');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    server: {
      type: 'https',
      options: {
        key: 'ssl/localhost.key',  // Opcional, si tienes un certificado
        cert: 'ssl/localhost.crt',  // Opcional, si tienes un certificado
      },
    },
  },
});