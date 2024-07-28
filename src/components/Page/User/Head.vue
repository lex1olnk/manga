<template lang="pug">
.page-user--head
  a.edit(v-if="isWriteable" :href="`/users/${user.id}/edit`")
  .background
  .foreground
    .avatar
      div(v-if="user.avatar" :style="`background-image: url(/upload/user/avatar/${user.avatar})`")
      img(v-if="user.avatar" :src="`/upload/user/avatar/${user.avatar}`")
    .details
      h1 {{ user.name }}
      .stats
        .likes(@click="like" :class="isLiked ? 'liked' : ''")
          div {{ user.likers_count }}
          div Лайков
        .books
          div {{ user.books_count }}
          div Работ
        .subscribers
          div {{ user.subscribers_count }}
          div Подписчиков
        .chapters
          div {{ user.chapters_in_month }}
          div Глав в месяц
      .links
        div
          a(v-for="social in socials" :href="social.uri")
            div TeamDeadInsides
            div {{ social.uri }}
      button.subscribe(@click="subscribe") {{ isSubscribed ? 'Отписаться' : 'Следить за автором' }}
</template>

<script setup>
  const emit = defineEmits(['like', 'subscribe'])
  const props = defineProps(['isLiked', 'isSubscribed', 'isWriteable', 'socials', 'user'])

  function like() {
    useApi(props.isLiked ? '/user/unlike' : '/user/like', {method: 'POST', body: {user: props.user}})
      .then(response => {
        if ('liked' in response) emit('like', response)
      })
      .catch(console.error)
  }

  function subscribe() {
    useApi(props.isSubscribed ? '/user/unsubscribe' : '/user/subscribe', {method: 'POST', body: {user: props.user}})
      .then(response => {
        if ('subscribed' in response) emit('subscribe', response)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-user--head
  background: #fff
  position: relative

  .edit
    background: transparent url(/images/edit-btn.svg) no-repeat center center
    height: 30px
    position: absolute
    right: 14px
    top: 12px
    width: 30px
    z-index: 10

  .background
    background: #ff5a5a
    height: 145px
    left: 0
    position: absolute
    right: 0
    top: 0

  .foreground
    display: flex
    padding-bottom: 25px
    position: relative

  .avatar
    height: 296px
    padding: 30px 0 0 30px
    width: 296px

    div
      background-position: center center
      background-size: cover
      border: 2px solid #fff
      border-radius: 50%
      height: 100%

    img
      display: none

  .details
    margin-left: 29px
    padding-top: 49px

    h1
      color: #fff
      font-size: 20px
      margin: 0 0 0 2px
      text-shadow: #000 2px 2px 2px

  .stats
    border-radius: 4px
    color: #fff
    display: flex
    height: 49px
    left: -9px
    margin-top: 11px
    padding: 3px 0 0 14px
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

  .links
    display: flex
    height: 38px
    margin-left: 2px
    margin-top: 28px

    a
      background: transparent url(/images/vk-grey.svg) no-repeat left top
      color: #000
      display: inline-block
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
    margin-top: 18px
    padding: 0px 37px
</style>
