<template lang="pug">
section.updated-books-section(v-if="books.length")
  h1.section-header
    span Лента обновлений
  .clearfix
  .section-content
    .book(v-for="book in books" :key="book.id")
      img(:src="`/images/book1.png`")
      .content
        a.name(:href="`/books/${book.id}`") {{ book.name }}
        .alt-name(v-if="book.alt_name") {{ book.alt_name }}
        .genres(v-if="book.genres.length")
          span(v-for="genre in book.genres") {{ genre.name }}
        .chapters
          div
            span Глава 1. начало
          div
            span Глава 2. начало
        .tags
          span.when {{ formatDate(book.updated_at) }}
          span {{ bookTypeName(book.type) }}
          span {{ bookStatusName(book.status) }}
        .clearfix
</template>

<script setup>
  const props = defineProps(['books'])
</script>

<style lang="sass">
.updated-books-section
  margin-top: 8px

  .section-content
    margin-top: 8px

  .book
    background: #fff
    height: 152px
    margin-bottom: 5px

    img
      background: rgba(255, 0, 0, .3)
      float: left
      height: 100%
      width: 105px

    .content
      margin-left: 121px
      padding-top: 8px

    .name
      color: #000
      font-size: 14px

    .alt-name
      font-size: 12px
      margin-top: 4px

    .genres
      margin-top: 8px

      span
        border-bottom: 2px solid #ff5a5a
        display: inline-block
        font-size: 10px
        line-height: 13px
        margin-left: 10px
        padding: 0 8px
        vertical-align: top

        &:first-child
          margin-left: 0

    .chapters
      div
        height: 20px

      span
        background: #ffe8e8
        display: inline-block
        font-size: 11px
        line-height: 15px
        padding: 0px 8px
        vertical-align: top

    .tags
      margin-top: 7px

      span
        background: #ff5a5a
        color: white
        display: inline-block
        font-size: 10px
        line-height: 20px
        margin-right: 8px
        padding: 0 8px
        vertical-align: top

        &:first-child
          margin-left: 0

      .when
        background: transparent
        color: #000
        float: right
        font-size: 12px
        margin-right: 5px

</style>
