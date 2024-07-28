<template lang="pug">
.page-team
  PageTeamHeader(
    :creator="creator"
    :is-liked="isLiked"
    :is-subscribed="isSubscribed"
    :is-writeable="isWriteable"
    :socials="socials"
    :team="team"
    @like="onLike"
    @subscribe="onSubscribe"
  )
  Tabs
    ul.tabs
      li.active(data-block="description") Описание
      li(data-block="teammates") Участники

    section.tabs-block.description.active
      PageTeamDescription(
        :books="books"
        :comments="comments"
        :team="team"
        :teammates="teammates"
        @comment="onComment"
        @comment-like="onCommentLike"
      )
    section.tabs-block.teammates
      PageTeamTeammates(:team="team")
</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const route = useRoute()
      const event = useRequestEvent()
      const storage = event.context.storage

      const team = await storage.team.findOne({id: route.params.id})
      if (!team) return []

      const user = await event.context.context.user()

      const data = await Promise.all([
        storage.team.isWriteable(team, user),
        storage.team.isLiked(team, user),
        storage.team.isSubscribed(team, user),
        storage.team.getSocials(team),
        storage.team.getTeammates(team),
        storage.team.getBooks(team),
        storage.teamComment.find({team_id: team.id}, {order: {id: 'desc'}, with: ['is_liked'], actor: user}),
        storage.user.findOne({id: team.created_by})
      ])

      const teammates = {}
      for (const teammate of data[4]) {
        teammates[teammate.id] = storage.user.toPublic(teammate)
        teammates[teammate.id].team_role = teammate.team_role
      }
      data[4] = teammates

      data[5] = data[5].map(book => storage.book.toPublic(book))

      data[6] = data[6].map(comment => storage.teamComment.toPublic(comment))

      data[7] = storage.user.toPublic(data[7])

      return [storage.team.toPublic(team), ...data]
    } catch(e) {console.log(e)}
  })

  const team = ref(data.value?.[0])
  const isWriteable = ref(data.value?.[1])
  const isLiked = ref(data.value?.[2])
  const isSubscribed = ref(data.value?.[3])
  const socials = ref(data.value?.[4])
  const teammates = ref(data.value?.[5])
  const books = ref(data.value?.[6])
  const comments = ref(data.value?.[7])
  const creator = ref(data.value?.[8])

  if (!team) throw createError({statusCode: 404, data: {message: 'Команда не найдена'}})

  function onComment({comment}) {
    comments.value.unshift(comment)
  }

  function onCommentLike(response, comment) {
    comment.is_liked = response.liked ? true : (response.disliked ? false : null)
    comment.dislikers_count = response.dislikers_count
    comment.likers_count = response.likers_count
  }

  function onLike(data) {
    team.value.likers_count = data.likers_count
    isLiked.value = data.liked
  }

  function onSubscribe(data) {
    team.value.subscribers_count = data.subscribers_count
    isSubscribed.value = data.subscribed
  }
</script>

<style lang="sass">
.page-team
  margin: 0 auto
  padding-top: 22px
  width: 988px

  .page-team-header
    background: #fff
    height: 297px

  .page-tabs
    padding-top: 6px
</style>
