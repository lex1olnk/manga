<template lang="pug">
input(ref="input" @changeDate="changeDate")
</template>

<script setup>
  const input = ref(null)
  const value = defineModel({required: true})

  onMounted(() => {
    let date = ''

    if (value.value && !isNaN(value.value.getTime())) {
      const parts = value.value.toISOString().substring(0, 10).split('-')
      date = `${parts[2]}.${parts[1]}.${parts[0]}`
    }

    input.value.value = date

    const {$Datepicker} = useNuxtApp()
    const datepicker = new $Datepicker(input.value, {
      format: 'dd.mm.yyyy',
    })
  })

  function changeDate(event) {
    let date = null
    const parts = event.target.value.split('.')

    if (parts.length == 3) {
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)

      if (isNaN(date.getTime())) date = null
    }

    value.value = date
  }
</script>

<style lang="sass">
@import 'vanillajs-datepicker/sass/datepicker.scss'
</style>
