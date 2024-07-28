<template lang="pug">
span.autocomplete
  input(v-model="value" @blur="blur" @focus="focus" @input="load" type="text" size="1")
  .options(v-if="show")
    .options-lock(v-if="locked")
      p Загрузка...
    .option(v-for="option in options" :key="option.id" @click="select(option)") {{ option.name }}
</template>

<script setup>
  const cancel = ref([])
  const emit = defineEmits(['select'])
  const locked = ref(false)
  const model = defineModel({})
  const options = ref([])
  const props = defineProps({
    'clear-after-select': {},
    'name': {},
    'search-empty': {},
    'source': {},
    'source-data': {},
  })
  let request = null
  const show = ref(false)
  const value = ref(props.name)

  function blur() {
    setTimeout(() => show.value = false, 300)
  }

  function focus(event) {
    if (options.value.length) show.value = true
    else if (props.searchEmpty) load(event)
  }

  function load(event) {
    if (cancel.value.length) cancel.value[cancel.value.length - 1] = true
    if (request) clearTimeout(request)

    model.value = null

    request = setTimeout(() => {
      locked.value = true
      show.value = true

      const number = cancel.value.length
      cancel.value.push(false)

      props.source(event.target.value.trim(), props.sourceData)
        .then(response => {
          if (cancel.value[number]) return

          options.value = Array.isArray(response) ? response : []
        })
        .catch(console.error)
        .finally(() => {
          if (!cancel.value[number]) locked.value = false
        })
    }, 300)
  }

  function select(option) {
    emit('select', option)
    model.value = option.value
    value.value = props.clearAfterSelect ? '' : option.name
    options.value = []
    show.value = false
  }
</script>

<style lang="sass">
.autocomplete
  display: inline-block
  position: relative

  input
    height: 100%
    width: 100%

  .options
    background: #fff
    border: 1px solid #e8e8e8
    left: 0
    min-width: 100%
    padding: .5em 0
    position: absolute
    top: 100%
    z-index: 10

    .options-lock
      background: rgba(0, 0, 0, .3)
      bottom: 0
      left: 0
      position: absolute
      right: 0
      top: 0

      p
        color: #fff

  .option
    cursor: pointer
    padding: 0 1em

    &:hover
      background: #e8e8e8
</style>
