import {createVfm} from 'vue-final-modal'

export default defineNuxtPlugin(app => {
  const vfm = createVfm()

  app.vueApp.use(vfm)
})
