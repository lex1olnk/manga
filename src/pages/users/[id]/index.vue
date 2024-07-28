<template lang="pug">
.page-user
  PageUserHead(
    :is-liked="isLiked"
    :is-subscribed="isSubscribed"
    :is-writeable="isWriteable"
    :socials="socials"
    :user="user"
    @like="onLike"
    @subscribe="onSubscribe"
  )
  Tabs
    ul.tabs
      li(data-block="about") О пользователе
      li(data-block="bookmarks") Закладки
      li(data-block="books") Работы
      li.active(data-block="notifications") Уведомления
      li(data-block="subscriptions") Подписки

    section.tabs-block.about
      h1 Описание
      p Название тайтла - <br>Ян Хе-Джи - известная звезда SNS с более чем 100 000 подписчиками в Instagram. Из-за своей популярности девушка получила много признаний, но, несмотря на это, она не имеет большого опыта с противоположным полом. Однажды Хе-Джи получила приглашение от SNS пойти на свидание с другой популярной звездой, за которой она 
    section.tabs-block.bookmarks
      PageUserBookmarks
    section.tabs-block.books
      h1 Работы
    section.tabs-block.notifications.active
      PageUserNotifications
    section.tabs-block.subscriptions
      h1 Подписки
</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage
      const currentUser = await event.context.context.user()

      const user = await storage.user.findOne({id: route.params.id})
      if (!user) return []

      const data = await Promise.all([
        storage.user.isWriteable(user, currentUser),
        storage.user.isLiked(user, currentUser),
        storage.user.isSubscribed(user, currentUser),
        storage.user.getSocials(user),
      ])

      return [data[0] ? user : storage.user.toPublic(user), ...data]
    } catch(e) {console.log(e)}
  })

  const user = ref(data.value[0])
  const isWriteable = ref(data.value[1])
  const isLiked = ref(data.value[2])
  const isSubscribed = ref(data.value[3])
  const socials = ref(data.value[4])

  if (!user) throw createError({statusCode: 404, data: {message: 'Пользователь не найден'}})

  function onLike(data) {
    user.value.likers_count = data.likers_count
    isLiked.value = data.liked
  }

  function onSubscribe(data) {
    user.value.subscribers_count = data.subscribers_count
    isSubscribed.value = data.subscribed
  }
</script>

<style lang="sass">
.page-user
  margin: 0 auto
  padding-top: 22px
  width: 988px

  .page-tabs
    padding-top: 8px

    .tabs-block
      margin-top: 8px

      &.about
        padding: 14px 16px

        h1
          font-size: 20px
          margin: 0

        p
          font-size: 14px
          margin: 16px 0 0
</style>
