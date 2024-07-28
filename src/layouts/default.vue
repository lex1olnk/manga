<template lang="pug">
PixelPerfect(page="chapter-style" left="0")
div.page-top-wrapper
  div(style="height: 2px")
  Header
  slot
  Footer
  ModalsContainer
</template>

<script setup>
  import {ModalsContainer} from 'vue-final-modal'
</script>

<style lang="sass">
@font-face
  font-family: Nunito
  font-style: normal
  src: url(/fonts/nunito/Nunito-VariableFont_wght.ttf)

@font-face
  font-family: Nunito
  font-style: italic
  src: url(/fonts/nunito/Nunito-Italic-VariableFont_wght.ttf)

*
  box-sizing: border-box
  font-family: Nunito, sans-serif
  font-weight: 400
  outline: none

  &:first-child
    margin-top: 0

html, body
  background: #f2f2f2
  padding: 0
  margin: 0

.clearfix::after
  content: ""
  display: table
  clear: both

.page-top-wrapper
  margin: 0 auto
  width: 1480px

  .section-header
    background: #ff5a5a
    float: left
    font-weight: 400
    height: 35px
    padding-left: 25px
    margin: 0

    span
      background: #fff
      display: inline-block
      font-size: 14px
      line-height: 35px
      padding: 0 16px
      vertical-align: top

a
  color: #000
  text-decoration: none

  &:hover
    text-decoration: underline
    text-decoration-color: #000

input
  &[type="text"], &[type="password"]
    border: 1px solid #e8e8e8
    border-radius: 6px
    color: #333333
    display: inline-block
    line-height: 34px
    padding: 0 1em

    &:focus
      border-color: #b6b6b6

select
  background: transparent
  border: 1px solid #e8e8e8
  border-radius: 6px
  color: #333333
  display: inline-block
  height: 36px
  padding: 0 1em

  &:focus
    border-color: #b6b6b6

input.error[type="text"],
input.error[type="password"],
select.error,
textarea.error
  border-color: red

ul, ol
  list-style-position: inside
</style>
