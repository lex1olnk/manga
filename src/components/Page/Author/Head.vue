<template lang="pug">
section.page-author-head
  .background
  a.edit(v-if="isWriteable" :href="`/authors/${author.id}/edit`")
  .foreground
    div
      .avatar(v-if="author.avatar" :style="author.avatar ? `background-image: url(/upload/author/avatar/${author.avatar})` : ''")
        img(:src="`/upload/author/avatar/${author.avatar}`")
    div
      h1 {{ author.name }}
      .stats
        .likes(@click="like" :class="isLiked ? 'liked' : ''")
          div {{ author.likers_count }}
          div Лайков
        .books
          div {{ author.books_count }}
          div Работ
        .subscribers
          div {{ author.subscribers_count }}
          div Подписчиков
        .chapters
          div {{ author.chapters_in_month }}
          div Глав в месяц
      .socials(v-if="socials")
        div
          a(v-for="social in socials" :key="social.id" href="#")
            div TeamDeadInsides
            div {{ social.uri }}
      button.subscribe(@click="subscribe") {{ isSubscribed ? 'Отписаться' : 'Следить за автором' }}
</template>

<script setup>
  const emit = defineEmits(['like', 'subscribe'])
  const props = defineProps(['author', 'isLiked', 'isSubscribed', 'isWriteable', 'socials'])

  function like() {
    useApi(props.isLiked ? '/author/unlike' : '/author/like', {method: 'POST', body: {author: props.author}})
      .then(response => {
        if ('liked' in response) emit('like', response)
      })
      .catch(console.error)
  }

  function subscribe() {
    useApi(props.isSubscribed ? '/author/unsubscribe' : '/author/subscribe', {method: 'POST', body: {author: props.author}})
      .then(response => {
        if ('subscribed' in response) emit('subscribe', response)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-author-head
  background: #fff
  border-radius: 4px
  height: 297px
  margin: 0 auto
  position: relative
  width: 988px

  .background
    background: transparent url(/images/author-background.png) no-repeat center top
    height: 206px
    left: 0
    position: absolute
    right: 0
    top: 0

  .edit
    background: transparent url(/images/edit-btn.svg) no-repeat left top
    display: inline-block
    height: 28px
    position: absolute
    right: 16px
    top: 13px
    width: 28px
    z-index: 10

  .foreground
    display: flex
    position: relative

    & > div:first-child
      flex-shrink: 0
      height: 296px
      padding: 30px 30px
      width: 296px

    & > div:nth-child(2)
      flex-grow: 1
      padding-left: 1px
      padding-top: 49px

  .avatar
    background-position: center center
    background-size: cover
    border: 2px solid #fff
    border-radius: 50%
    height: 100%

    img
      display: none

  h1
    color: #fff
    font-size: 20px
    margin: 0
    text-shadow: #000 2px 2px 2px

  .stats
    background: rgba(0, 0, 0, .3)
    border-radius: 4px
    color: #fff
    display: flex
    height: 49px
    left: -9px
    margin-top: 11px
    padding: 3px 0 0 9px
    position: relative
    width: 443px

    & > div
      & > div:first-child
        font-size: 12px
        line-height: 26px

      & > div:nth-child(2)
        font-size: 10px
        line-height: 10px

    .likes
      background: transparent url(/images/likes.svg) no-repeat left center
      cursor: pointer
      padding-left: 42px

      &.liked
        background-image: url(/images/likes-fill.svg)

    .books
      background: transparent url(/images/books-counter.svg) no-repeat left center
      margin-left: 22px
      padding-left: 43px

    .subscribers
      margin-left: 51px

    .chapters
      background: transparent url(/images/chart.svg) no-repeat left center
      margin-left: 36px
      padding-left: 39px

  .socials
    display: flex
    height: 38px
    margin-top: 16px

    a
      background: transparent url(/images/vk-white.svg) no-repeat left top
      color: #fff
      display: inline-block
      margin-right: 20px
      padding-left: 45px

      & > div:first-child
        line-height: 16px
        padding-top: 4px

      & > div:nth-child(2)
        font-size: 12px

  .subscribe
    background: #ff5a5a
    border: none
    border-radius: 6px
    color: #fff
    cursor: pointer
    display: inline-block
    font-size: 16px
    font-weight: 700
    line-height: 45px
    margin-top: 29px
    padding: 0px 40px
</style>
