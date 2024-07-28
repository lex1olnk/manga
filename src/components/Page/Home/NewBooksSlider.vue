<template lang="pug">
section.new-books-slider-section(v-if="books.length")
  h1.section-header
    span Новинки
  .clearfix
  .carousel-container
    Carousel(:items-to-show="6.5" snap-align="start" :wrap-around="true")
      Slide(v-for="book in books" :key="book.id")
        a(@click="click" @mousedown="mouseDown" :href="`/books/${book.id}`")
          .shadow
          .name {{ book.name }}
          img(src="/images/book1.png")
</template>

<script setup>
  const props = defineProps(['books'])

  function click(event) {
    const dX = Math.abs(event.clientX - event.target.dataset.startX)
    const dY = Math.abs(event.clientY - event.target.dataset.startY)

    if (dX > 5 || dY > 5) event.preventDefault()

    delete(event.target.dataset.startX)
    delete(event.target.dataset.startY)
  }

  function mouseDown(event) {
    event.target.dataset.startX = event.clientX
    event.target.dataset.startY = event.clientY
  }
</script>

<style lang="sass">
.new-books-slider-section
  .carousel-container
    background: #fff
    border-radius: 6px
    margin-top: 8px
    padding: 11px 9px 10px 8px

    a
      height: 100%
      margin-right: 8px
      position: relative
      width: 121px

    .shadow
      background: linear-gradient(transparent, black)
      border-radius: 8px
      bottom: 0
      height: 28px
      left: 0
      position: absolute
      right: 0

    .name
      bottom: 5px
      color: #fff
      font-size: 11px
      left: 8px
      overflow: hidden
      position: absolute
      right: 8px
      text-align: left
      text-overflow: ellipsis
      white-space: nowrap

    img
      border-radius: 8px
      width: 121px
</style>
