<template lang="pug">
.page-book
  .page-container
    PageBookHead(:book="book" :is-writeable="isWriteable" :translator="translator")
    Tabs
      ul.tabs
        li.active(data-block="details") Подробности
        li(data-block="chapters") Главы
        li(v-if="errors.length" data-block="errors") Ошибки
        li(v-if="isWriteable" data-block="translators") Переводчики

      section.tabs-block.details.active
        PageBookDetails(
          @comment="onComment"
          @comment-like="onCommentLike"
          @rate="onRate"
          :book="book"
          :comments="comments"
          :rate-counts="rateCounts"
          :raters-count="Object.values(rateCounts).reduce((a, b) => a + b, 0)"
          :translator-books="translatorBooks"
        )
      section.tabs-block.chapters
        PageBookChaptersWriter(v-if="isWriteable")
        PageBookChaptersReader(v-else @pay="pay" :book="book" :chapters="chapters")
      section.tabs-block.errors(v-if="errors.length")
        PageBookErrors(@delete="onErrorDelete" :errors="errors")
      section.tabs-block.translators(v-if="isWriteable")
        h1 Переводчики
        p {{ translator.name }}

</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage
      const user = await event.context.context.user()

      const book = await storage.book.findOne({id: route.params.id}, {
        with: ['author', 'reading_history', 'user_rate'],
        actor: user,
      })
      if (!book) return []

      const isWriteable = await storage.book.isWriteable(book, user)

      const data = await Promise.all([
        isWriteable,
        storage.user.findOne({id: book.translator_id}),
        storage.book.find({id: {'!=': book.id}, translator_id: book.translator_id}),
        storage.bookComment.find({book_id: book.id}, {order: {id: 'desc'}, with: ['is_liked'], actor: user}),
        storage.chapter.find({book_id: book.id}, {order: {number: 'asc'}, with: ['is_readable'], actor: user}),
        isWriteable ? storage.chapterError.find({}, {filterByBookId: book.id, with: ['chapter', 'user']}) : [],
        storage.book.getRateCounts(book),
        storage.book.attachFandoms([book]),
        storage.book.attachGenres([book]),
        storage.book.attachTags([book]),
      ])

      data[1] = storage.user.toPublic(data[1])
      data[2] = data[2].map(book => storage.book.toPublic(book))
      data[3] = data[3].map(comment => storage.bookComment.toPublic(comment))
      data[4] = data[4].map(chapter => storage.chapter.toPublic(chapter))

      return [storage.book.toPublic(book), ...data]
    } catch(e) {console.error(e)}
  })

  const book = ref(data.value?.[0])
  const isWriteable = ref(data.value?.[1])
  const translator = ref(data.value?.[2])
  const translatorBooks = ref(data.value?.[3])
  const comments = ref(data.value?.[4])
  const chapters = ref(data.value?.[5])
  const errors = ref(data.value?.[6])
  const rateCounts = ref(data.value?.[7])

  if (!book.value) throw createError({statusCode: 404, data: {message: 'Книга не найдена'}})

  function onComment({comment}) {
    comments.value.unshift(comment)
  }

  function onCommentLike(response, comment) {
    comment.is_liked = response.liked ? true : (response.disliked ? false : null)
    comment.dislikers_count = response.dislikers_count
    comment.likers_count = response.likers_count
  }

  function onErrorDelete(error) {
    errors.value = errors.value.filter(err => err.id !== error.id)
  }

  function onRate(data) {
    book.value.rate = data.rate
    book.value.user_rate = data.value
    rateCounts.value = data.rateCounts
  }

  function pay(pay) {
    if (pay.type === 'chapters') {
      const payedChapters = {}
      for (const number of pay.details.chapters) payedChapters[number] = true

      for (const chapter of chapters.value) {
        if (chapter.number in payedChapters) chapter.is_readable = true
      }
    }
  }
</script>

<style lang="sass">
.page-book
  padding-top: 7px

  .page-container
    margin: 0 auto
    width: 988px

  .page-tabs
    padding-top: 14px

  .tabs-block.details
    margin-top: 8px
    padding: 8px 16px 0
</style>
