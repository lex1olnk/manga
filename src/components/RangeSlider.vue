<template lang="pug">
.range-slider
  .track(ref="track" @click="onTrackClick")
    .thumb(@mousedown="startTrack" @mousemove.stop :style="`left: ${left}%`")
</template>

<script setup>
  const emit = defineEmits(['change'])
  const model = defineModel({required: true})
  const props = defineProps(['max', 'min'])
  const track = ref(null)
  let trackRect = null

  const left = computed(() => {
    return (model.value - props.min) / (props.max - props.min) * 100
  })

  function calc(left, position, right) {
    let percent = (position - left) / (right - left) * 100
    percent = Math.max(0, Math.min(percent, 100))
    const value = props.min + Math.round((props.max - props.min) * percent / 100)

    if (model.value !== value) {
      model.value = value
      emit('change', value)
    }
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()
    calc(trackRect.left, event.clientX, trackRect.right)
  }

  function onDocumentMouseUp(event) {
    document.removeEventListener('mouseup', onDocumentMouseUp)
    document.removeEventListener('mousemove', onDocumentMouseMove)
  }

  function onTrackClick(event) {
    const rect = track.value.getClientRects()[0]
    calc(rect.left, event.clientX, rect.right)
  }

  function startTrack(event) {
    trackRect = track.value.getClientRects()[0]
    document.addEventListener('mouseup', onDocumentMouseUp)
    document.addEventListener('mousemove', onDocumentMouseMove)
  }
</script>

<style lang="sass">
.range-slider
  .track
    cursor: pointer
    height: 12px
    padding-top: 5px
    position: relative

    &::before
      background: #000
      content: ""
      display: block
      height: 1px

  .thumb
    background: #000
    border-radius: 6px
    cursor: pointer
    height: 12px
    margin: -6px
    position: absolute
    width: 12px
</style>
