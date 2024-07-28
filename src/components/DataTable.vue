<template lang="pug">
.data-table
  .actions.clearfix
    span.sort(@click="changeSort" :class="sort") Сортировка
    slot(name="actions")
  .table-wrapper
    table
      thead
        slot(name="head")
      tbody
        slot(name="body")
</template>

<script setup>
  const emit = defineEmits(['sort'])
  const props = defineProps(['sort'])
  const sort = ref('asc')

  onMounted(() => {
    sort.value = props.sort
  })

  function changeSort() {
    sort.value = sort.value === 'desc' ? 'asc' : 'desc'
    emit('sort', sort.value)
  }

</script>

<style lang="sass">
.data-table
  .actions
    padding: 0 5px

    .sort
      cursor: pointer
      display: inline-block
      float: right
      line-height: 30px

      &::after
        background: transparent url(/images/icon-chapters-sort.svg) no-repeat center center
        content: ""
        display: inline-block
        height: 22px
        margin-left: 14px
        vertical-align: middle
        width: 22px

      &.desc
        &::after
          transform: rotate(180deg)

    button
      background: #ff5a5a
      border: none
      border-radius: 4px
      color: #fff
      cursor: pointer
      font-size: 14px
      line-height: 30px
      margin-right: 10px
      padding: 0 17px
      vertical-align: top

  .table-wrapper
    border: 1px solid #e8e8e8
    border-radius: 4px
    margin-top: 10px
    padding-bottom: 105px

    table
      border-collapse: collapse
      border-spacing: 0
      padding: 0
      width: 100%

    th, td
      padding: 0
      text-align: left

    thead
      tr
        border-bottom: 1px solid #e8e8e8
        height: 46px

      th
        font-size: 14px

    tbody
      tr
        border-bottom: 1px solid #e8e8e8
        height: 41px

      td
        font-size: 12px
</style>
