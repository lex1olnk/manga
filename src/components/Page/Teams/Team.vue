<template lang="pug">
article.page-teams--team
  .details
    .head
      .avatar
        div(v-if="team.avatar" :style="`background-image: url(/upload/team/avatar/${team.avatar})`")
          img(src="/images/book1.png")
      a(:href="`/teams/${team.id}`").info.clearfix
        .name {{ team.name }}
        .population {{ team.subscribers_count }}
        .likes {{ team.likers_count }}
    .description
      p {{ team.description }}
  .books(v-if="team.books.length")
    a(v-for="book in team.books" :href="`/books/${book.id}`")
      img(src="/images/book1.png")
</template>

<script setup>
  const props = defineProps(['team'])
</script>

<style lang="sass">
.page-teams--team
  background: #fff
  border-radius: 6px
  display: flex
  height: 180px
  justify-content: space-between
  margin-bottom: 14px

  .details
    width: 584px

    .head
      display: flex
      height: 68px
      padding: 9px 0 0 16px

    .avatar
      height: 58px
      width: 58px

      div
        background-position: center
        background-size: cover
        border-radius: 50%
        height: 100%

      img
        display: none

    .info
      color: #000
      cursor: pointer
      margin-left: 6px
      min-width: 148px
      padding: 5px 10px 10px 9px

    .name
      font-size: 16px
      margin-bottom: 5px

    .population
      background: transparent url(/images/icon-man-black.svg) no-repeat left center
      display: inline-block
      font-size: 14px
      margin-left: 5px
      padding-left: 23px
      vertical-align: middle

    .likes
      background: transparent url(/images/icon-heart-black.svg) no-repeat left center
      background-size: 18px
      display: inline-block
      font-size: 12px
      margin-left: 12px
      padding-left: 24px
      vertical-align: middle

    .description
      padding: 9px 7px 0 8px

      p
        color: #000
        font-size: 12px
        height: 95px
        margin: 0
        padding: 7px 8px 7px 8px

  .books
    display: flex
    margin-right: 12px
    padding: 9px 0
    width: 358px

    a
      margin-left: 10px
      width: 114px

      a:first-child
        margin-left: 0

      img
        border-radius: 8px
        width: 100%

  &.has-cover
    background-size: cover

    .details
      .info
        background: rgba(0, 0, 0, .3)
        border-radius: 4px
        color: #fff

      .population
        background-image: url(/images/icon-man.svg)

      .likes
        background-image: url(/images/likes.svg)

    .description
      p
        background: rgba(0, 0, 0, .3)
        border-radius: 4px
        color: #fff
</style>
