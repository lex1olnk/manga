<template lang="pug">
a.book-mini-card(:href="`/books/${book.id}`")
  img(src="/images/book1.png")
  .shadow
  .tag(v-if="book.bookmark") {{ bookmarkTypeName(book.bookmark) }}
  .rate(v-if="book.rate") {{ book.rate }}
  .name {{ book.name }}
</template>

<script setup>
  const props = defineProps(['book'])
</script>

<style lang="sass">
a.book-mini-card
  border-radius: 8px
  height: 267px
  margin-bottom: 8px
  overflow: hidden
  position: relative
  width: 184px

  img
    width: 100%

  .tag
    background: #ff5a5a
    color: #fff
    font-size: 10px
    line-height: 20px
    padding: 0 10px
    position: absolute
    right: 0
    top: 0

  .rate
    background: transparent url(/images/rate-star.svg) no-repeat 4px center
    bottom: 27px
    color: #fff
    font-size: 12px
    line-height: 16px
    padding: 0 21px
    position: absolute

  .name
    bottom: 9px
    color: #fff
    font-size: 12px
    left: 0
    line-height: 16px
    padding: 0 6px
    position: absolute
    right: 0

  .shadow
    background: linear-gradient(transparent, black)
    border-radius: 8px
    bottom: 0
    height: 50px
    left: 0
    position: absolute
    right: 0
</style>
