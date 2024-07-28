<template lang="pug">
.page-book--chapters--reader
  DataTable.chapters(@sort="value => sort = value" :sort="sort")
    template(#actions)
      button Подписаться
      button(@click="() => vfm.open('buy-modal')") Купить
      button Скачать
    template(#head)
      tr
        th.select(v-if="$context?.value?.user")
          input(ref="toggleChaptersInput" @change="toggleChapters" type="checkbox")
        th.name Название
        th.status Статус
        th.updated-at Обновлено
        th.views
          span
        th.likes
          span
        th.is-public
          span
    template(#body)
      tr(v-for="chapter in sortedChapters" :key="chapter.id")
        td.select(v-if="$context?.value?.user")
          input(v-if="!chapter.is_readable" @change="toggleChapter(chapter, $event)" type="checkbox" :checked="chapter.number in selectedNumbers")
        td.name
          a(:href="chapter.is_readable ? `/books/${book.id}/chapters/${chapter.number}` : null") Глава {{ chapter.number }}. {{ chapter.name || 'Без названия' }}
        td.status {{ bookStatusName(chapter.status) }}
        td.updated-at {{ formatDate(chapter.updated_at || chapter.created_at) }}
        td.views {{ chapter.viewers_count }}
        td.likes {{ chapter.likers_count }}
        td.is-public
          span(v-if="!chapter.is_public")

  PageBookBuyModal(
    @close="vfm.close('buy-modal')"
    @pay="pay"
    modal-id="buy-modal"
    type="chapters"
    :book="book"
    :chapters="chapters"
    :numbers="selectedNumbers"
  )
</template>

<script setup>
  const emit = defineEmits(['pay'])
  const props = defineProps(['book', 'chapters'])

  import {useVfm} from 'vue-final-modal'
  const vfm = useVfm()

  const selectedNumbers = ref({})
  const sort = ref('asc')
  const toggleChaptersInput = ref(null)

  const sortedChapters = computed(() => {
    return props.chapters.sort((a, b) => {
      let result = a.number < b.number ? -1 : a.number > b.number ? 1 : 0
      if (sort.value === 'desc') result *= -1
      return result
    })
  })

  function pay(pay) {
    vfm.close('buy-modal')
    emit('pay', pay)
  }

  function toggleChapter(chapter, event) {
    if (chapter.number in selectedNumbers.value) delete selectedNumbers.value[chapter.number]
    else selectedNumbers.value[chapter.number] = true

    if (!event.target.checked) toggleChaptersInput.value.checked = false
  }

  function toggleChapters(event) {
    if (event.target.checked) {
      for (const chapter of props.chapters) {
        selectedNumbers.value[chapter.number] = true
      }
    } else {
      selectedNumbers.value = {}
    }
  }
</script>

<style lang="sass">
.page-book--chapters--reader
  padding: 14px 15px 180px

  .chapters
    thead
      .select
        width: 44px

        input
          margin: 4px 0 0 12px

      .name
        padding-left: 10px

      .status
        width: 91px

      .updated-at
        width: 108px

      .views
        width: 54px

        span
          background: transparent url(/images/icon-chapters-eye.svg)
          display: inline-block
          height: 24px
          width: 24px

      .likes
        width: 53px

        span
          background: transparent url(/images/icon-chapters-heart.svg)
          display: inline-block
          height: 24px
          width: 24px

      .is-public
        width: 56px

        span
          background: transparent url(/images/icon-chapters-lock.svg)
          display: inline-block
          height: 24px
          width: 24px

      .edit
        width: 30px

    tbody
      .select
        input
          margin: 5px 0 0 12px

      .name
        padding-left: 10px

      .status
        padding-left: 2px

      .updated-at
        padding-left: 4px

      .views
        padding-left: 2px

      .likes
        padding-left: 2px

      .is-public
        span
          background: transparent url(/images/icon-chapters-lock.svg)
          display: inline-block
          height: 24px
          width: 24px

      .edit
        a
          background: transparent url(/images/icon-chapters-edit.svg)
          display: inline-block
          height: 20px
          width: 20px

</style>
