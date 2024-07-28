<template lang="pug">
.page-chapter-wrapper
  .style-modal-trigger(@click="vfm.open('style-modal')")
  PageChapterStyleModal(
    v-model="style"
    modal-id="style-modal"
  )
  .page-chapter
    PageChapterContent(:chapter="chapter" :style="style")

    .navigation.clearfix
      a.next(v-if="nextChapter" :href="`/books/${book.id}/chapters/${nextChapter.number}`") Следующая глава
      a.prev(v-if="prevChapter" :href="`/books/${book.id}/chapters/${prevChapter.number}`") Предыдущая глава

    Comments(
      @comment="onComment"
      @comment-like="onCommentLike"
      :comments="comments"
      :entity-id="chapter.id"
      entity-type="chapter"
      :save-body="{book_id: chapter.book_id, number: chapter.number}"
    )
</template>

<script setup>
  import {useVfm} from 'vue-final-modal'

  definePageMeta({
    middleware: ['auth-require']
  })

  const style = ref({
    colorScheme: 1,
    fontSize: 12,
    lineHeight: 135,
    containerWidth: 100,
    paragraphMargin: 16,
  })
  const vfm = useVfm()

  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage

      const [book, chapter, user] = await Promise.all([
        storage.book.findOne({id: route.params.id}),
        storage.chapter.findOne({book_id: route.params.id, number: route.params.number}),
        event.context.context.user()
      ])

      if (!book || !chapter) return []

      const isReadable = await storage.chapter.isReadable(chapter, user)
      if (!isReadable) return [storage.book.toPublic(book), storage.book.toPublic(chapter), false]

      await Promise.all([
        storage.chapter.view(chapter, user),
        storage.readingHistory.save({book_id: book.id, chapter_number: chapter.number}, user),
      ])

      const data = await Promise.all([
        storage.chapter.findOne({book_id: chapter.book_id, number: chapter.number - 1}),
        storage.chapter.findOne({book_id: chapter.book_id, number: chapter.number + 1}),
        storage.chapterComment.find({chapter_id: chapter.id}, {order: {id: 'desc'}, with: ['is_liked'], actor: user}),
      ])

      if (data[0]) data[0] = storage.chapter.toPublic(data[0])
      if (data[1]) data[1] = storage.chapter.toPublic(data[1])
      data[2] = data[2].map(comment => storage.chapterComment.toPublic(comment))

      return [
        storage.book.toPublic(book),
        storage.chapter.toReadable(chapter),
        isReadable,
        ...data
      ]
    } catch(e) {console.error(e)}
  })

  const book = ref(data.value?.[0])
  const chapter = ref(data.value?.[1])
  const isReadable = ref(data.value?.[2])
  const prevChapter = ref(data.value?.[3])
  const nextChapter = ref(data.value?.[4])
  const comments = ref(data.value?.[5])

  if (!chapter.value) throw createError({statusCode: 404, data: {message: 'Не найдено'}})
  if (!isReadable.value) throw createError({statusCode: 404, data: {message: 'Недоступно'}})

  function onComment({comment}) {
    comments.value.unshift(comment)
  }

  function onCommentLike(response, comment) {
    comment.is_liked = response.liked ? true : (response.disliked ? false : null)
    comment.dislikers_count = response.dislikers_count
    comment.likers_count = response.likers_count
  }
</script>

<style lang="sass">
.page-chapter-wrapper
  position: relative

  .style-modal-trigger
    bottom: 0
    cursor: pointer
    position: absolute
    right: 0
    top: 0
    width: 240px

    &:hover
      background: #e8e8e8

.page-chapter
  margin: 0 auto
  padding-top: 16px
  width: 988px

  .navigation
    margin-top: 27px

    a
      background: #ff5a5a
      border: none
      border-radius: 6px
      color: #fff
      display: inline-block
      font-size: 16px
      font-weight: 700
      line-height: 45px
      padding: 0 43px
      text-decoration: none !important

    .next
      float: right

  .comments-section
    background: #fff
    margin-top: 20px
    padding: 20px 18px 50px
</style>
