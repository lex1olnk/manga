<template lang="pug">
.comments-section
  h2 Комментарии: {{ comments.length }}
  .add
    textarea(@keyup.ctrl.enter="send")

  article.comment(v-for="comment in comments" :key="comment.id")
    .user {{ comment.user_name }} {{ getCommentorType ? `[ ${getCommentorType(comment)} ]` : '' }}
    .when {{ formatDate(comment.created_at) }}
    .content {{ comment.content }}
    .actions
      .likes(@click="like(comment, true)" :class="comment.is_liked === true ? 'selected' : ''") {{ comment.likers_count }} Понравилось
      .dislikes(@click="like(comment, false)" :class="comment.is_liked === false ? 'selected' : ''") {{ comment.dislikers_count }} Не понравилось
      .answer Ответить
</template>

<script setup>
  const emit = defineEmits(['comment', 'comment-like'])
  const props = defineProps(['comments', 'entity-id', 'entity-type', 'get-commentor-type', 'save-body'])

  function like(comment, positive) {
    const url = comment.is_liked === positive ? `/${props.entityType}-comment/unlike` : `/${props.entityType}-comment/like`
    useApi(url, {method: 'POST', body: {[`${props.entityType}-comment`]: comment, positive}})
      .then(response => {
        if ('liked' in response) emit('comment-like', response, comment)
      })
      .catch(console.error)
  }

  function send(event) {
    useApi(`/${props.entityType}/comment`, {
      method: 'POST',
      body: {[props.entityType]: {id: props.entityId, ...(props.saveBody || {})}, content: event.target.value}
    })
      .then(response => {
        if ('comment' in response) {
          event.target.value = ''
          emit('comment', response)
        }
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.comments-section
  h2
    font-size: 20px
    margin: 0

  .add
    padding-top: 18px

    textarea
      border: 1px solid #454545
      border-radius: 6px
      height: 185px
      padding: 1em
      resize: none
      width: 100%

  .comment
    background: #e8e8e8
    margin-top: 21px
    padding: 3px 30px 7px 64px

    .user
      line-height: 22px

    .when
      font-size: 12px
      line-height: 16px
      margin-top: 10px

    .content
      font-size: 14px
      line-height: 22px
      margin-top: 8px

    .actions
      display: flex
      font-size: 14px
      margin-top: 8px

      div
        cursor: pointer
        margin-right: 8px

        &.selected
          font-weight: 700
</style>
