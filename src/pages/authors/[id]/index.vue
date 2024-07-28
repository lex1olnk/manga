<template lang="pug">
.page-author
  PageAuthorHead(
    :author="author"
    :is-liked="isLiked"
    :is-subscribed="isSubscribed"
    :is-writeable="isWriteable"
    :socials="socials"
    @like="onLike"
    @subscribe="onSubscribe"
  )
  h1.section-header
    span Работы
  .clearfix
  PageAuthorBooks(:books="books")
</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage

      const author = await storage.author.findOne({id: route.params.id})
      if (!author) return []

      const user = await event.context.context.user()

      const data = await Promise.all([
        storage.author.isLiked(author, user),
        storage.author.isSubscribed(author, user),
        storage.author.isWriteable(author, user),
        storage.author.getSocials(author),
        storage.book.find({author_id: author.id}, {with: ['bookmark'], actor: user})
      ])

      data[4] = data[4].map(book => storage.book.toPublic(book))

      return [storage.author.toPublic(author), ...data]
    } catch(e) {console.error(e)}
  })

  const author = ref(data.value[0] || null)
  const isLiked = ref(data.value[1] || false)
  const isSubscribed = ref(data.value[2] || false)
  const isWriteable = ref(data.value[3] || false)
  const socials = ref(data.value[4] || [])
  const books = ref(data.value[5] || [])

  if (!author.value) {
    throw createError({statusCode: 404, data: {message: 'Автор не найден'}})
  }

  function onLike(data) {
    author.value.likers_count = data.likers_count
    isLiked.value = data.liked
  }

  function onSubscribe(data) {
    author.value.subscribers_count = data.subscribers_count
    isSubscribed.value = data.subscribed
  }
</script>

<style lang="sass">
.page-top-wrapper
  .page-author
    .section-header
      margin-top: 8px

.page-author
  margin: 0 auto
  padding-top: 22px
  width: 988px
</style>
