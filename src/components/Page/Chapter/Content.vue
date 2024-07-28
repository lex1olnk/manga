<template lang="pug">
section.page-chapter--content
  h1 {{ chapter.volume ? `${chapter.volume}. ` : '' }}Глава {{ chapter.number }} - {{ chapter.name || 'Без названия'}}
  .wrapper(ref="contentWrapper" @mousemove="wrapperMouseMove" :style="`width: ${style.containerWidth}%;`")
    button.error-trigger(ref="errorTrigger" v-show="selectedText" @click.prevent="vfm.open('error-modal')") ошибка
    div.content(
      v-html="chapter.content"
      :style="`background: ${colorSchemes[style.colorScheme].bg}; color: ${colorSchemes[style.colorScheme].font}; font-size: ${style.fontSize}px; line-height: ${style.lineHeight / 100}em;`"
    )

  PageChapterErrorModal(
    @close="vfm.close('error-modal')"
    :chapter="chapter"
    modal-id="error-modal"
  )
</template>

<script setup>
  import {useVfm} from 'vue-final-modal'

  const colorSchemes = [
    {},
    {bg: '#fff', font: '#000'},
    {bg: 'blue', font: 'yellow'},
    {bg: 'green', font: 'red'},
    {bg: '#0ff', font: '#ff0'},
    {bg: '#f0f', font: '#0f0'},
  ]
  const contentWrapper = ref(null)
  const errorTrigger = ref(null)
  let errorTriggerWidth = null
  let mouseX = 0
  let mouseY = 0
  const props = defineProps(['chapter', 'style'])
  const selectedText = ref(null)
  const vfm = useVfm()

  onMounted(() => {
    document.addEventListener('selectionchange', event => {
      const selection = document.getSelection()
      if (!selection.rangeCount) {
        selectedText.value = null
        return
      }

      const range = selection.getRangeAt(0)

      if (contentWrapper.value.contains(range.startContainer) && contentWrapper.value.contains(range.endContainer)) {
        let startParagraph = range.startContainer.parentNode
        if (startParagraph.nodeName !== 'p') startParagraph = startParagraph.closest('p')
        let endParagraph = range.endContainer.parentNode
        if (endParagraph.nodeName !== 'p') endParagraph = endParagraph.closest('p')

        if (startParagraph === endParagraph) {
          selectedText.value = selection.toString().trim() || null
        } else {
          selectedText.value = null
        }
      } else {
        selectedText.value = null
      }

      if (selectedText.value) {
        const wrapperRects = contentWrapper.value.getClientRects()
        const wrapperRect = wrapperRects[wrapperRects.length - 1]

        errorTriggerWidth ||= errorTrigger.value.getClientRects()[0]?.width || 0
        const left = mouseX - wrapperRect.left - errorTriggerWidth / 2
        const top = mouseY - wrapperRect.top + 20

        errorTrigger.value.style.left = `${left}px`
        errorTrigger.value.style.top = `${top}px`
      }
    })

    contentWrapper.value.addEventListener('mousemove', event => {
      mouseX = event.clientX
      mouseY = event.clientY
    })
  })

  const paragraphMargin = computed(() => `${props.style.paragraphMargin / 10}em`)
</script>

<style lang="sass">
.page-chapter--content
  background: #fff
  padding: 25px 30px 136px

  h1
    font-size: 13.4px
    margin-bottom: 21px

  .wrapper
    margin: 0 auto
    position: relative

    .error-trigger
      background: #ff5a5a
      border: none
      border-radius: 6px
      color: #fff
      cursor: pointer
      font-size: 16px
      font-weight: 700
      line-height: 36px
      padding: 0 30px
      position: absolute

    p
      font-size: inherit
      margin-bottom: 0
      margin-top: v-bind('paragraphMargin')
      text-align: justify

      &::selection
        background-color: rgba(185, 0, 0, .4)
</style>
