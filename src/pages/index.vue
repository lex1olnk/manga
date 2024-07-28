<template lang="pug">
.page-index
  PageHomeTopSlider(:books="adBooks")

  .page-content-wrap.page-container
    .page-content
      PageHomeNewBooksSlider(:books="newBooks")
      PageHomeUpdatesFeed(:books="updatedBooks")
    aside.page-sidebar
      PageHomeNews(:news="news")
      PageHomeNewTop
      PageHomeTagsList(:make-url="genre => `/books?genres=${genre.id}`" :tags="genres" title="Жанры")
      PageHomeTagsList(:make-url="fandom => `/books?fandoms=${fandom.id}`" :tags="fandom" title="Фандомы")
</template>

<script setup>
  useHead({
    bodyAttrs: {
      class: 'page-index-body'
    }
  })

  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const storage = event.context.storage

      const data = await Promise.all([
        storage.book.find({}, {limit: 10}),
        storage.book.find({}, {limit: 10}),
        storage.book.find({}, {limit: 3}),
        storage.genre.find({}),
        storage.fandom.find({}),
        storage.news.find({}, {order: {created_at: 'desc'}, limit: 4, with: ['creator']})
      ])

      await storage.book.attachGenres(data[2])

      return [
        data[0].map(book => storage.book.toPublic(book)),
        data[1].map(book => storage.book.toPublic(book)),
        data[2].map(book => storage.book.toPublic(book)),
        data[3],
        data[4],
        data[5].map(story => storage.news.toPublic(story)),
      ]
    } catch(e) {console.error(e)}
  })

  const adBooks = ref(data.value?.[0])
  const newBooks = ref(data.value?.[1])
  const updatedBooks = ref(data.value?.[2])
  const genres = ref(data.value?.[3])
  const fandom = ref(data.value?.[4])
  const news = ref(data.value?.[5])
</script>

<style lang="sass">
.page-index-body
  background: #d9d9d9

.page-index
  padding-top: 15px

  .page-container
    margin: 0 auto
    max-width: 1280px

  .page-content-wrap
    column-gap: 16px
    display: grid
    grid-template-columns: 864px 400px

  .page-content
    grid-column: 1
    padding-top: 15px

  .page-sidebar
    grid-column: 2
    grid-row: 1
    padding-top: 15px

  .books-slider-container
    background: #fff
    border-radius: 6px
    margin-top: 15px
    padding-top: 15px
    padding-bottom: 17px

    .page-container
      height: 265px
      overflow: hidden

  .section-content
    clear: both

  .new-books
    padding-top: 15px

    .section-content
      background: #fff
      border-radius: 5px
      height: 197px
      margin-top: 8px
      overflow: hidden
      padding: 11px 8px 10px

    .books
      height: 300px
      overflow-x: scroll
      white-space: nowrap

    .book
      background: rgba(255, 0, 0, 0.3)
      border-radius: 8px
      display: inline-block
      height: 176px
      margin-left: 8px
      width: 121px

      &:first-child
        margin-left: 0
</style>
