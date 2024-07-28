export default defineNuxtPlugin(async app => {
  return {
    provide: {
      context: useState('context'),
    }
  }
})
