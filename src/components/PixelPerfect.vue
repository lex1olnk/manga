<template lang="pug">
.pixel-perfect-button.toggle(v-if="page" @click="toggle")
.pixel-perfect-button.transparency(v-if="page" @click="transparency")
.pixel-perfect(v-if="page" ref="layout")
  img(:src="`/images/design-page-${page}.png`" :style="`left: ${left}`")
</template>

<script setup>
  import {ref} from 'vue'

  const layout = ref(null)
  const props = defineProps(['left', 'page'])

  function transparency() {
    layout.value.classList.toggle('transparent')
  }

  function toggle() {
    layout.value.classList.toggle('visible')
  }
</script>

<style lang="sass">
.pixel-perfect-button
  border-radius: 10px
  cursor: pointer
  height: 40px
  left: 20px
  position: fixed
  width: 40px
  z-index: 10001

  &.toggle
    background: rgba(255, 0, 0, .5)
    top: 70px

  &.transparency
    background: rgba(0, 0, 255, .5)
    top: 120px

.pixel-perfect
  display: none
  position: absolute
  text-align: center
  width: 100%
  z-index: 10000

  &.transparent
    opacity: .5

  &.visible
    display: block

  img
    position: relative
</style>
