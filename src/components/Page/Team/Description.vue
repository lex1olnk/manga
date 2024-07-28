<template lang="pug">
.page-team--description
  .teammates(v-if="Object.values(teammates).length")
    h2 Участники команды:
    div
      a(v-for="teammate in teammates" :href="`/users/${teammate.id}`")
        .avatar(:style="teammate.avatar ? `background-image: url(/upload/user/avatar/${teammate.avatar})` : ''")
        div
          .name {{ teammate.name }}
          .role {{ teammateRoleName(teammate.team_role) }}

  .description
    h2 Описание
    p {{ team.description }}

  .books(v-if="books.length")
    h2 Работы команды: {{ books.length }}
    div
      BookMiniCard(v-for="book in books" :key="book.id" :book="book")

  Comments(
    :comments="comments"
    :entity-id="team.id"
    entity-type="team"
    :get-commentor-type="getCommentorType"
    @comment="(...args) => emit('comment', ...args)"
    @comment-like="(...args) => emit('comment-like', ...args)"
  )
</template>

<script setup>
  const emit = defineEmits(['comment', 'comment-like'])
  const props = defineProps(['books', 'comments', 'team', 'teammates'])

  function getCommentorType(comment) {
    return teammateRoleName(props.teammates[comment.created_by]?.team_role)
  }
</script>

<style lang="sass">
.page-team--description
  padding-bottom: 50px

  .teammates
    h2
      font-size: 16px
      margin: 0
      padding: 15px 16px 0

    & > div
      display: flex
      flex-wrap: wrap
      padding: 18px 16px 0

    a
      display: flex
      margin: 0 16px 16px 0

      .avatar
        background-position: center
        background-size: cover
        border: 1px solid #e8e8e8
        border-radius: 50%
        height: 32px
        width: 32px

      & > div:nth-child(2)
        color: #000
        padding-left: 13px

      .name
        font-size: 14px

      .role
        font-size: 12px

  .description
    padding: 13px 16px 0

    h2
      font-size: 20px
      margin: 0

    p
      font-size: 15px
      margin: 0
      padding: 6px 0 0

  .books
    padding: 83px 16px 0

    h2
      font-size: 16px
      margin: 0

    & > div
      display: flex
      flex-wrap: wrap
      justify-content: space-around
      padding-top: 12px

    a
      height: 267px
      width: 184px

  .comments-section
    padding: 27px 14px 0
</style>
