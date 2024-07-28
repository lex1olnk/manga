<template lang="pug">
section.new-top-section
  h1.section-header
    span Новинки
  .clearfix
  .top-type
    span Топ авторских
  ol
    li
      a(:href="`/books/1`") С системой Marvel в мире Naruto
    li
      a(:href="`/books/1`") Я - зомби? Какого хрена?!
</template>

<script setup>
  const props = defineProps(['books'])
</script>

<style lang="sass">
.new-top-section
  margin-top: 16px

  .top-type
    background: #ff5a5a
    margin-top: 9px
    padding-right: 32px

    span
      display: block
      background: #fff
      line-height: 32px
      padding-left: 13px

  ol
    background: #fff
    font-size: 11px
    margin: 1px 0 0
    padding: 18px

    li
      margin-bottom: 6px

      a
        color: #000
</style>
