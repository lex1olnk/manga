<template lang="pug">
Modal(@before-open="beforeOpen")
  section.modal.page-chapter--error-modal
    .lock(v-if="locked")
      p Здесь должен быть прелодер...
    h1 Нашли ошибку?
    template(v-if="sent")
      p Спасибо за указание на найденную ошибку. Мы сообщим о ней переводчикам.
      p &nbsp;
    template(v-else)
      p Напишите исправленный вид в текстовое поле снизу, переводчики проверят и исправят.
      textarea(v-model="correct" :class="correctError ? 'error' : ''")
    .actions
      button.close(@click="$emit('close')") {{ sent ? 'Закрыть' : 'Отмена' }}
      button.send(v-if="!sent" @click="submit") Отправить
</template>

<script setup>
  const correct = ref('')
  const correctError = ref(false)
  const emit = defineEmits(['close'])
  const locked = ref(false)
  let paragraph = 0
  const props = defineProps(['chapter'])
  const sent = ref(false)
  let source = ''

  function beforeOpen() {
    correct.value = ''
    correctError.value =false
    paragraph = 0
    sent.value = false

    const selection = document.getSelection()
    source = selection.toString().trim()

    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      let paragraphElement = range.startContainer.parentNode
      if (paragraphElement.nodeName !== 'p') paragraphElement = paragraphElement.closest('p')

      const container = paragraphElement.closest('.content')
      const paragraphs = container.querySelectorAll('p')
      for (let index = 0; index < paragraphs.length; index++) {
        if (paragraphs[index] === paragraphElement) paragraph = index + 1
      }
    }
  }

  function submit() {
    correctError.value = false
    locked.value = true

    useApi('/error/chapter', {
      method: 'POST',
      body: {
        book_id: props.chapter.book_id,
        correct: correct.value,
        number: props.chapter.number,
        paragraph,
        source,
      },
      'suppress-errors': true,
    })
      .then(response => {
        if ('$errors' in response) {
          for (const error of response.$errors) {
            if (error?.field === 'correct') correctError.value = true
          }
        }

        if ('error' in response) sent.value = true
      })
      .catch(console.error)
      .finally(() => locked.value = false)
  }
</script>

<style lang="sass">
.vfm__content
  .page-chapter--error-modal
    margin-top: 55px
    padding-bottom: 16px

.page-chapter--error-modal
  position: relative
  width: 649px

  .lock
    background: rgba(0, 0, 0, .3)
    bottom: 0
    left: 0
    position: absolute
    right: 0
    top: 0

    p
      color: #fff
      padding-top: 50%
      text-align: center

  p
    font-size: 13.5px
    margin: 8px 0 0

  textarea
    border: 1px solid #e8e8e8
    border-radius: 16px
    height: 120px
    margin: 8px 0 0
    padding: .5em 1em
    resize: none
    width: 100%

  .actions
    margin-top: 5px
    text-align: center

    button
      background: #ff5a5a
      border: none
      border-radius: 18px
      color: #fff
      cursor: pointer
      line-height: 37px
      padding: 0 26px

    .close
      margin-right: 20px
</style>
