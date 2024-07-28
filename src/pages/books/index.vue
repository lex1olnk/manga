<template lang="pug">
.page-catalog
  .lock(v-if="loading")
    p Загрузка...
  section.content-section
    h1.section-header
      span Тайтлы
    .clearfix

    .filter-bar
      input(v-model="name" type="text" placeholder="Поиск по названию тайтла")
      button(@click="submit") Искать
      label Сортировка:
      select(v-model="sort")
        option(value="create") Дата создания
        option(value="update") Дата обновления
        option(value="viewers") Просмотры
        option(value="rate") Рейтинг
        option(value="raters") Кол-во оценок
        option(value="chapters_trans") Кол-во переведённых глав
        option(value="likers") Кол-во лайков
        option(value="chapters_free") Кол-во бесплатных глав
        option(value="bookmarks") Кол-во в закладках

    p(v-if="loading") Загрузка
    article(v-for="book in books" :key="book.id")
      div
        img(src="/images/book1.png")
      div.content
        .head
          a.name(:href="`/books/${book.id}`") {{ book.name }}
          .rate(v-if="book.rate") {{ book.rate }}
          .translation-status
            span {{ bookStatusName(book.status) }}
        .attributes
          span Год: {{ book.year }}
          span Автор: {{ book.author_name }}
          span Переводчик: {{ book.translator_name }}
          span Глав: {{ book.chapters_count }}
        .tags
          span(v-for="genre in book.genres" :key="genre.id") {{ genre.name }}
        .description {{ book.description }}
  PageBooksFilter(:filter="filter")
</template>

<script setup>
  const loading = ref(false)
  const name = ref('')
  const sort = ref('update')

  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage

      const books = await storage.book.catalogSearch({sort: sort.value, ...route.query})

      const filterData = await Promise.all([
        route.query.fandoms ? storage.fandom.find({id: route.query.fandoms.split(',')}) : [],
        route.query.genres ? storage.genre.find({id: route.query.genres.split(',')}) : [],
        route.query.tags ? storage.tag.find({id: route.query.tags.split(',')}) : [],
      ])
      const filter = {
        fandoms: filterData[0].map(fandom => {
          return {
            id: fandom.id,
            name: fandom.name,
          }
        }),
        genres: filterData[1].map(genre => {
          return {
            id: genre.id,
            name: genre.name,
          }
        }),
        tags: filterData[2].map(tag => {
          return {
            id: tag.id,
            name: tag.name,
          }
        }),
        types: route.query.types
          ? route.query.types.split(',').map(type => {
            return {
              type,
              name: bookTypeName(type),
            }
          })
          : [],
      }

      return [
        books.map(book => storage.book.toPublic(book)),
        filter,
      ]
    } catch(e) {console.error(e)}
  })

  const books = ref(data.value[0])
  const filter = ref(data.value[1])

  function buildQuery(filter) {
    const args = [`sort=${sort.value}`]

    if (name.value) args.push('name=' + encodeURIComponent(name.value))

    for (const field of ['ageRate', 'chaptersFrom', 'chaptersTo', 'rateFrom', 'rateTo', 'status', 'yearFrom', 'yearTo']) {
      if(filter[field]) args.push(`${field}=${encodeURIComponent(filter[field])}`)
    }

    const fandoms = filter.fandoms.map(fandom => fandom.id)
    if (fandoms.length) args.push('fandoms=' + encodeURIComponent(fandoms.join(',')))

    const genres = filter.genres.map(genre => genre.id)
    if (genres.length) args.push('genres=' + encodeURIComponent(genres.join(',')))

    const tags = filter.tags.map(tag => tag.id)
    if (tags.length) args.push('tags=' + encodeURIComponent(tags.join(',')))

    const types = filter.types.map(type => type.type)
    if (types.length) args.push('types=' + encodeURIComponent(types.join(',')))

    return args.join('&')
  }

  function submit() {
    loading.value = true

    const query = buildQuery(filter.value)

    useApi(`/search/books?${query}`)
      .then(response => {
        if ('books' in response) books.value = response.books
      })
      .catch(console.error)
      .finally(() => loading.value = false)
  }
</script>

<style lang="sass">
.page-catalog
  display: flex
  padding-top: 27px
  position: relative

  .lock
    background: rgba(0, 0, 0, .3)
    bottom: 0
    left: 0
    position: absolute
    right: 0
    top: 0
    z-index: 100

    p
      color: #fff
      margin-top: 50%
      text-align: center

  .content-section
    margin-left: 100px
    width: 956px

    .filter-bar
      background: #fff
      border-radius: 8px
      height: 57px
      margin: 13px 0 10px
      padding: 10px 13px 0 16px

      input
        height: 36px
        padding: 0 15px
        width: 532px

      button
        background: transparent
        border: none
        border-radius: 6px
        cursor: pointer
        font-size: 14px
        height: 36px
        margin-left: 10px

        &:hover
          background: #e8e8e8

      label
        display: inline-block
        font-size: 14px
        line-height: 34px
        margin-left: 70px

      select
        float: right
        width: 159px

    article
      background: #fff
      border-radius: 0 0 8px 0
      display: flex
      height: 176px
      margin-bottom: 8px
      overflow: hidden

      img
        width: 122px

      .content
        flex-grow: 1

      .head
        display: flex
        background: #ff5a5a
        height: 38px

      .name
        color: #fff
        display: inline-block
        font-size: 13.5px
        line-height: 38px
        margin: 0
        padding: 0 16px
        text-decoration-color: #fff

      .rate
        background: transparent url(/images/rate-star.svg) no-repeat left center
        color: #fff
        font-size: 12px
        line-height: 38px
        padding-left: 17px

      .translation-status
        line-height: 38px
        padding-left: 9px

        span
          background: #fff
          border-radius: 4px
          font-size: 13px
          display: inline-block
          vertical-align: middle
          line-height: 20px
          padding: 0 18px

      .attributes
        display: flex
        font-size: 14px
        padding: 10px 16px 0 16px

        span
          margin-right: 15px

      .tags
        font-size: 14px
        padding: 5px 16px 0 16px

        span
          margin-right: 7px

      .description
        font-size: 12px
        padding: 11px 16px 11px 16px
</style>
