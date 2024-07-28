import Config from './config/config.js'

export default defineNuxtConfig({
  devServer: {
    port: Config.server.port
  },
  modules: [
    'vue3-carousel-nuxt'
  ],
  css: [
    'vue-final-modal/style.css',
    'vue3-perfect-scrollbar/style.css',
  ]
})
