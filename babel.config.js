

javascriptCopiarmodule.exports = {
  presets: [
    'react-app',
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-syntax-flow'
  ],
  env: {
    production: {
      // Configuración específica para producción
      // Sin React Refresh
    },
    development: {
      // Configuración específica para desarrollo
      plugins: [
        // Plugins de desarrollo como React Refresh
      ]
    }
  }
};