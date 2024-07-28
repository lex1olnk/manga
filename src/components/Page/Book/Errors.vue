<template lang="pug">
.page-book--errors
  DataTable.errors(@sort="value => sort = value" :sort="sort")
    template(#head)
      tr
        th.name Название
        th.date Дата
        th.line Строка
        th.paragraph Абзац
        th.user Пользователь
        th.view &nbsp;
    template(#body)
      tr(v-for="error in sortedErrors")
        td.name {{ chapterName({name: error.chapter_name, number: error.chapter_number}) }}
        td {{ formatTimeDate(error.created_at) }}
        td 152
        td {{ error.paragraph }}
        td {{ error.user_name }}
        td
          button(@click="showError(error)") Посмотреть

  PageBookErrorsViewModal(
    @close="vfm.close('book-error-view-modal')"
    @delete="onDelete"
    :error="selectedError"
    modal-id="book-error-view-modal"
  )
</template>

<script setup>
  import {useVfm} from 'vue-final-modal'

  const emit = defineEmits(['delete'])
  const props = defineProps(['errors'])
  const selectedError = ref({})
  const sort = ref('asc')
  const vfm = useVfm()

  const sortedErrors = computed(() => {
    return props.errors.sort((a, b) => {
      let result = a.created_at > b.created_at ? 1 : (a.created_at < b.created_at ? -1 : 0)
      if (sort.value === 'desc') result *= -1
      return result
    })
  })

  function onDelete(error) {
    emit('delete', error)
    vfm.close('book-error-view-modal')
  }

  function showError(error) {
    selectedError.value = error
    setTimeout(() => vfm.open('book-error-view-modal'), 0)
  }
</script>

<style lang="sass">
.page-book--errors
  padding: 18px 15px 50px

  .errors
    .table-wrapper
      margin-top: 17px

    thead
      .name
        padding-left: 14px

      .date
        text-align: center
        width: 132px

      .line
        width: 98px

      .paragraph
        width: 77px

      .user
        width: 109px

      .view
        width: 147px

    tbody
      .name
        padding-left: 14px

      button
        background: #ff5a5a
        border: none
        border-radius: 4px
        color: #fff
        cursor: pointer
        font-size: 12px
        line-height: 24px
        padding: 0 13px
</style>
