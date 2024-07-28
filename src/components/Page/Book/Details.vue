<template lang="pug">
.page-book--details
  h2 Описание
  p Название тайтла - <br />Ян Хе-Джи - известная звезда SNS с более чем 100 000 подписчиками в Instagram. Из-за своей популярности девушка получила много признаний, но, несмотря на это, она не имеет большого опыта с противоположным полом. Однажды Хе-Джи получила приглашение от SNS пойти на свидание с другой популярной звездой, за которой она 

  Carousel.gallery(:items-to-show="4" snap-align="start" :wrap-around="false" :class="5 > 4 ? 'slideable' : ''")
    Slide(v-for="slide in 5" :key="slide")
      .image(:style="`background-image: url(/images/book1.png)`")
        img(src="/images/book1.png")

  .rates-section
    h2 Оценка

    div
      .rates
        label Рейтинг за произведение

        .rate(v-for="value in [5, 4, 3, 2, 1]" @click="rate(value)" :class="book.user_rate === value ? 'selected' : ''")
          .value {{ value }}
          .percent
            div(:style="`width: ${rateCounts[value] / ratersCount * 100}%`")
          .count {{ rateCounts[value] }}

      .summary
        label Рейтинг за

        .rate
          .name Произведение
          .percent
            div(:style="`width: 50%`")
          .value 4.74
        .rate
          .name Перевод
          .percent
            div(:style="`width: 50%`")
          .value 4.74
        .rate
          .name Частота выхода глав
          .percent
            div(:style="`width: 50%`")
          .value 4.74

  .tag-list(v-if="book.genres.length")
    h3 Жанры
    .genres
      a.genre(v-for="genre in book.genres" :href="`/books?genres=${genre.id}`") {{ genre.name  }}

  .tag-list(v-if="book.tags.length")
    h3 Теги
    .tags
      a.genre(v-for="tag in book.tags" :href="`/books?tags=${tag.id}`") {{ tag.name }}

  .tag-list(v-if="book.fandoms.length")
    h3 Фандомы
    .fandoms
      a.genre(v-for="fandom in book.fandoms" :href="`/books?fandoms=${fandom.id}`") {{ fandom.name }}

  .translator-books(v-if="translatorBooks.length")
    h2 Другие работы переводчика {{ translatorBooks.length }}
    Carousel(:items-to-show="6" snap-align="start" :wrap-around="false")
      Slide(v-for="translatorBook in translatorBooks" :key="book.id" @click="click" @mousedown="mouseDown")
        BookMiniCard(:book="translatorBook")

  .complaint
    button Подать жалобу

  Comments(
    @comment="(...args) => emit('comment', ...args)"
    @comment-like="(...args) => emit('comment-like', ...args)"
    :comments="comments"
    :entity-id="book.id"
    entity-type="book"
  )
</template>

<script setup>
  const emit = defineEmits(['comment', 'comment-like', 'rate'])
  const props = defineProps(['book', 'comments', 'rate-counts', 'raters-count', 'translator-books'])

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

  function rate(value) {
    useApi('/book/rate', {
      method: 'POST',
      body: {book: {id: props.book.id}, value: value === props.book.user_rate ? 0 : value}
    })
      .then(response => {
        if ('rateCounts' in response) emit('rate', response)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-book--details
  padding-bottom: 50px

  & > p
    font-size: 14px
    margin: 16px 0 0
    text-align: justify

  h2
    font-size: 20px
    margin: 0

  h3
    font-size: 16px
    margin: 0

  .gallery
    margin-top: 5px

    .carousel__track
      justify-content: space-around

    .image
      background-position: center
      background-size: cover
      border-radius: 6px
      height: 296px
      width: 200px

      img
        display: none

    &.slideable
      justify-content: left

  .rates-section
    margin-bottom: 20px
    margin-top: 5px

    label
      font-size: 13.5px

    & > div
      display: flex
      justify-content: space-between
      margin-top: 13px
      padding-left: 3px

    .rate
      align-items: center
      cursor: pointer
      display: flex

      .name
        font-size: 13.5px
        width: 159px

      .value
        background: transparent url(/images/rate-star-primary.svg) no-repeat 12px center
        font-size: 14px
        width: 29px

      .percent
        background: #f2f2f2
        border-radius: 4px
        flex-grow: 1
        height: 8px

        div
          background: #ff5a5a
          border-radius: 4px
          height: 100%

      .count
        font-size: 14px
        text-align: right
        width: 50px

      &:hover, &.selected
        .value, .count
          font-weight: 700

        .percent
          background: #e8e8e8

    .rates
      width: 460px

      .rate
        margin-top: 11px

    .summary
      width: 470px

      .rate
        margin: 7px 0 13px

      .value
        background-position: 42px center
        padding-left: 9px
        width: 67px

  .tag-list
    margin-top: 9px

    div
      margin-top: 6px

    a
      background: #ff5a5a
      border-radius: 6px
      color: #fff
      display: inline-block
      font-size: 10.5px
      line-height: 20px
      margin-right: 12px
      padding: 0 7px 0 9px
      text-decoration-color: #fff

  .translator-books
    margin-top: 44px

    .carousel
      margin-top: 25px

    .book-mini-card
      border-radius: 6px
      height: 215px
      width: 145px

  .complaint
    margin-top: 32px
    text-align: right

    button
      background: #ff5a5a
      border: none
      border-radius: 6px
      color: #fff
      cursor: pointer
      font-size: 16px
      font-weight: 700
      line-height: 45px
      padding: 0 55px

  .comments-section
    margin-top: 76px
</style>
