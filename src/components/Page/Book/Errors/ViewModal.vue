<template lang="pug">
Modal(@before-open="beforeOpen")
  section.modal.chapter-error-view-modal
    .lock(v-if="locked")
      p Загрузка...
    h1 Проверка ошибки
    label Изначальный вид
    textarea(v-model="source")
    label Исправленный вид
    textarea(v-model="correct")
    .errors(v-if="errors.length")
      div(v-for="error in errors") {{ error.message }}
    .actions
      button(@click="$emit('close')") Закрыть
      button(@click="remove") Удалить
      button Принять
</template>

<script setup>
  const correct = ref('')
  const errors = ref([])
  const emit = defineEmits(['close', 'delete'])
  const locked = ref(false)
  const props = defineProps(['error'])
  const source = ref()

  function beforeOpen() {
    correct.value = props.error.correct
    source.value = props.error.source
  }

  function remove() {
    errors.value = []
    locked.value = true

    useApi('/chapter-error/delete', {
      method: 'POST',
      body: {
        'chapter-error': {
          id: props.error.id
        }
      },
      'suppress-errors': true,
    })
      .then(response => {
        if ('$errors' in response) errors.value = response.$errors
        if (response.success) emit('delete', props.error)
      })
      .catch(console.error)
      .finally(() => locked.value = false)
  }
</script>

<style lang="sass">
.chapter-error-view-modal
  position: relative
  width: 650px

  .lock
    bottom: 0
    left: 0
    position: absolute
    right: 0
    top: 0
    z-index: 10

    p
      color: #fff
      margin-top: 50%
      text-align: center

  label
    font-size: 13.5px
    margin-top: 8px

  textarea
    border: 1px solid #e8e8e8
    border-radius: 16px
    height: 120px
    margin-top: 8px
    padding: .5em 1em
    resize: none
    width: 100%

  .actions
    margin-top: 8px
    text-align: center

    button
      background: #ff5a5a
      border: none
      color: #fff
      cursor: pointer
      border-radius: 17px
      line-height: 37px
      margin: 0 7px
      padding: 0 24px 0

  .errors
    div
      color: #ff5a5a
      font-size: 14px
</style>
