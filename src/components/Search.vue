<template lang="pug">
VueFinalModal(
  @before-open="books = []"
  :click-to-close="true"
  content-class="vfm-search-modal"
  content-transition="vfm-slide-up"
  overlay-transition="fade"
)
  .search-modal
    .filter
      input(@input="filter")
    .results
      PerfectScrollbar(ref="scrollbar")
        .books
          .book(v-for="book in books" :key="book.id")
            .image
            .info
              a(:href="`/books/${book.id}`") {{ book.name }}
                template(v-if="book.alt_name") <br />{{ book.alt_name }}
              .type Тайтл
                span.rate {{ book.rate }}
</template>

<script setup>
  import {PerfectScrollbar} from 'vue3-perfect-scrollbar'
  import {VueFinalModal} from 'vue-final-modal'

  const books = ref([])
  let controller
  const scrollbar = ref(null)
  let scrollbarUpdateTimeout = null

  function filter(event) {
    const text = event.target.value.trim()

    if (controller && !controller.signal.aborted) controller.abort('api.repeat.stop')

    if (text.length) {
      controller = new AbortController()
      useApi(`/search/global?text=${encodeURIComponent(text)}`, {signal: controller.signal})
        .then(response => {
          books.value = []

          if ('books' in response) {
            for (const book of response.books) {
              books.value.push(book)
            }
          }
        })
        .catch(console.error)
        .finally(() => {
          if (scrollbarUpdateTimeout) clearTimeout(scrollbarUpdateTimeout)
          scrollbarUpdateTimeout = setTimeout(() => scrollbar.value.ps.update(), 500)
        })
    } else {
      books.value = []

      if (scrollbarUpdateTimeout) clearTimeout(scrollbarUpdateTimeout)
      scrollbarUpdateTimeout = setTimeout(() => scrollbar.value.ps.update(), 500)
    }
  }
</script>

<style lang="sass">
.vfm__content.vfm-search-modal
  display: block
  margin: 0 auto
  padding-top: 10px
  width: 617px

.search-modal
  left: -55px
  position: relative

  .filter
    background: #fff url(/images/head-search.svg) no-repeat 11px center
    border-radius: 6px
    height: 36px
    margin-right: 17px
    padding-left: 37px

    input
      background: transparent
      border: none
      font-size: 11.5px
      line-height: 36px
      padding: 0
      width: 100%

  .results
    margin-top: 12px

    .ps
      .ps__rail-y
        background: #fff
        border-radius: 2px
        opacity: 1
        width: 12px

      .ps__thumb-y
        background: #d9d9d9
        border-radius: 2px
        right: 0
        width: 100%

  .books
    height: 344px

  .book
    background: #fff
    border-radius: 6px
    display: flex
    margin-bottom: 2px
    margin-right: 17px
    height: 84px

    .image
      background: transparent url(/images/book1.png) no-repeat center center
      background-size: cover
      width: 57px

    .info
      flex-grow: 1
      padding: 11px 9px 0

      a
        display: inline-block
        font-size: 11.5px
        line-height: 20px

      .type
        font-size: 12px
        margin-top: 2px

      .rate
        background: transparent url(/images/rate-star.svg) no-repeat left center
        background-size: 6px
        display: inline-block
        font-size: 10px
        margin-left: 9px
        padding-left: 10px
</style>
