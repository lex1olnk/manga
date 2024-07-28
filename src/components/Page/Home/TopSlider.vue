<template lang="pug">
section.top-slider-section(v-if="books.length")
  Carousel(:items-to-show="6.5" snap-align="start" :wrap-around="true")
    Slide(v-for="book in books" :key="book.id")
      a.book(@click="click" @mousedown="mouseDown" :href="`/books/${book.id}`")
        .type {{ bookTypeName(book.type) }}
        .shadow
        .rate(v-if="book.rate") {{ book.rate }}
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
.top-slider-section
  background: #fff
  border-radius: 6px
  height: 297px
  padding: 15px 100px 17px

  .book
    cursor: pointer
    display: block
    flex-shrink: 0
    height: 265px
    margin-right: 8px
    position: relative
    width: 183px

    div
      position: absolute

    .type
      background: #ff5a5a
      color: #fff
      font-size: 10px
      line-height: 20px
      padding: 0 9px
      position: absolute
      right: 0
      top: 0

    .shadow
      background: linear-gradient(transparent, black)
      border-radius: 8px
      bottom: 0px
      height: 40px
      left: 0px
      position: absolute
      right: 0

    .rate
      background: transparent url(/images/rate-star.svg) no-repeat -1px 1px
      bottom: 20px
      color: #fff
      font-size: 12px
      left: 8px
      padding-left: 16px
      position: absolute

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
</style>
