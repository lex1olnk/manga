<template lang="pug">
.page-team--header
  a.edit(v-if="isWriteable" :href="`/teams/${team.id}/edit`")
  .background(:style="team.background ? `background-image: url(/upload/team/background/${team.background})` : ''")
  .foreground
    .avatar
      div(v-if="team.avatar" :style="`background-image: url(/upload/team/avatar/${team.avatar})`")
        img
    .details
      h1 {{ team.name }}
      .stats
        a.creator(v-if="creator" :href="`/users/${creator.id}`")
          div {{ creator.name }}
          div Создатель
        .likes(@click="like" :class="isLiked ? 'liked' : ''")
          div {{ team.likers_count }}
          div Лайков
        .books
          div {{ team.books_count }}
          div Работ
        .subscribers
          div {{ team.subscribers_count }}
          div Подписчиков
        .chapters
          div {{ team.chapters_in_month }}
          div Глав в месяц
      .socials
        a(v-for="social in socials" :href="social.uri")
          div TeamDeadInsides
          div {{ social.uri }}
      button.subscribe(@click="subscribe") {{ isSubscribed ? 'Отписаться' : 'Следить за командой'}}
</template>

<script setup>
  const emit = defineEmits(['like', 'subscribe'])
  const props = defineProps(['creator', 'isLiked', 'isSubscribed', 'isWriteable', 'socials', 'team'])

  function like() {
    useApi(props.isLiked ? '/team/unlike' : '/team/like', {method: 'POST', body: {team: props.team}})
      .then(response => {
        if ('liked' in response) emit('like', response)
      })
      .catch(console.error)
  }

  function subscribe() {
    useApi(props.isSubscribed ? '/team/unsubscribe' : '/team/subscribe', {method: 'POST', body: {team: props.team}})
      .then(response => {
        if ('subscribed' in response) emit('subscribe', response)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-team--header
  background: #fff
  border-radius: 4px
  height: 297px
  position: relative

  .edit
    background: transparent url(/images/edit-btn.svg) no-repeat left top
    height: 30px
    position: absolute
    right: 14px
    top: 13px
    width: 30px
    z-index: 10

  .background
    background-color: #ff5a5a
    background-position: center
    background-size: cover
    height: 211px
    left: 0
    position: absolute
    right: 0
    top: 0

  .foreground
    display: flex
    position: relative

  .avatar
    height: 296px
    padding: 30px 30px
    width: 296px

    div
      background-position: center
      background-size: cover
      background-image: url(/images/author-avatar.png)
      border: 2px solid #fff
      border-radius: 50%
      height: 100%

    img
      display: none

  .details
    flex-grow: 1
    padding-top: 49px

    h1
      color: #fff
      font-size: 20px
      font-weight: 600
      text-shadow: #000 2px 2px 2px

    .stats
      background: rgba(0, 0, 0, .3)
      border-radius: 4px
      color: #fff
      display: flex
      left: -8px
      padding: 8px
      position: relative

      & > *
        color: #fff
        text-decoration-color: #fff

        div:first-child
          font-size: 12px
          line-height: 16px

        div:nth-child(2)
          font-size: 10px
          margin-top: 2px

      .creator
        background: transparent url(/images/books-counter.svg) no-repeat left center
        padding-left: 43px

      .likes
        background: transparent url(/images/likes.svg) no-repeat left center
        cursor: pointer
        margin-left: 16px
        padding-left: 41px

        &.liked
          background-image: url(/images/likes-fill.svg)

      .books
        background: transparent url(/images/books-counter.svg) no-repeat left center
        margin-left: 23px
        padding-left: 42px

      .subscribers
        background: transparent url(/images/icon-man.svg) no-repeat left center
        background-size: 23px 24px
        margin-left: 19px
        padding-left: 32px

      .chapters
        background: transparent url(/images/chart.svg) no-repeat left center
        margin-left: 36px
        padding-left: 39px

    .socials
      display: flex
      margin-top: 18px
      min-height: 37px

      a
        background: transparent url(/images/vk-white.svg) no-repeat left center
        color: #fff
        height: 37px
        margin-right: 20px
        padding-left: 46px

        div:first-child
          line-height: 24px

        div:nth-child(2)
          font-size: 12px
          line-height: 8px

    .subscribe
      background: #ff5a5a
      border: none
      border-radius: 6px
      color: #fff
      cursor: pointer
      font-size: 16px
      font-weight: 700
      line-height: 45px
      margin-top: 28px
      padding: 0px 40px
</style>
