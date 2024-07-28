import { Datepicker } from 'vanillajs-datepicker'

export default defineNuxtPlugin(app => {
  return {
    provide: {
      Datepicker
    }
  }
})
