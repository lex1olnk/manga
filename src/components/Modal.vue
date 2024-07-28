<template lang="pug">
VueFinalModal(:click-to-close="false" content-transition="vfm-slide-up" overlay-transition="fade")
  slot
</template>

<script setup>
  import {VueFinalModal} from 'vue-final-modal'
</script>

<style lang="sass">
.vfm__content
  align-items: center
  display: flex
  justify-content: center
  padding-top: 100px

  .modal
    background: #fff
    border-radius: 8px
    padding: 24px 16px

    h1
      font-size: 15.5px
      margin: 0

    label
      display: block
      font-size: 14px
</style>
