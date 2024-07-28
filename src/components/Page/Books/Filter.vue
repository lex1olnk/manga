<template lang="pug">
aside.filter-section
  h1.section-header
    span Фильтры
  .clearfix

  section
    label Тип
    MultiInput(v-model="filter.types" :autocomplete-source="typesAutocomplete" :search-empty="true")
      template(#item="item")
        span(@click.prevent="item.select(item.index)") {{ item.name }}

    label Жанры
    MultiInput(v-model="filter.genres" :autocomplete-source="autocompleteGenres" :autocomplete-source-data="filter.genres" :search-empty="true")
      template(#item="item")
        span(@click.prevent="item.select(item.index)") {{ item.name }}

    label Теги
    MultiInput(v-model="filter.tags" :autocomplete-source="autocompleteTags" :autocomplete-source-data="filter.tags" :search-empty="true")
      template(#item="item")
        span(@click.prevent="item.select(item.index)") {{ item.name }}

    label Фандомы
    MultiInput(v-model="filter.fandoms" :autocomplete-source="autocompleteFandoms" :autocomplete-source-data="filter.fandoms" :search-empty="true")
      template(#item="item")
        span(@click.prevent="item.select(item.index)") {{ item.name }}

    fieldset.status
      legend Статус перевода

      span
        input(v-model="filter.status" type="radio" value="progress")
        label переводится

      span
        input(v-model="filter.status" type="radio" value="discarded")
        label заброшен

      span
        input(v-model="filter.status" type="radio" value="frozen")
        label заморожен

      span
        input(v-model="filter.status" type="radio" value="done")
        label завершён

    fieldset.age-rate
      legend Для взрослых

      div
        div
          input(v-model="filter.ageRate" type="radio" value="0")
          label для всех

        div
          input(v-model="filter.ageRate" type="radio" value="16")
          label +16

        div
          input(v-model="filter.ageRate" type="radio" value="18")
          label +18

    fieldset.range.year
      legend Год выпуска

      div
        div
          label от
          input(v-model.number="filter.yearFrom" type="text")

        div
          label до
          input(v-model.number="filter.yearTo" type="text")

    fieldset.range
      legend Глав

      div
        div
          label от
          input(v-model.number="filter.chaptersFrom" type="text")

        div
          label до
          input(v-model.number="filter.chaptersTo" type="text")

    fieldset.range
      legend Рейтинг

      div
        div
          label от
          input(v-model.number="filter.rateFrom" type="text")

        div
          label до
          input(v-model.number="filter.rateTo" type="text")
</template>

<script setup>
  const props = defineProps(['filter'])

  async function typesAutocomplete() {
    const types = {}
    for (const type of ['original', 'translation', 'orig_fanfic', 'trans_fanfic']) {
      types[type] = true
    }
    for (const type of props.filter.types) delete types[type.type]

    return Object.keys(types).map(type => {
      return {
        id: type,
        name: bookTypeName(type),
        value: {
          type,
          name: bookTypeName(type),
        },
      }
    })
  }
</script>

<style lang="sass">
.filter-section
  margin-left: 16px
  width: 307px

  section
    background: #fff
    border-radius: 8px
    margin-top: 11px
    padding: 7px 16px 20px 15px

    label
      display: block
      margin-top: 8px
      width: 100%

      &:first-child
        margin-top: 0

    input[type="text"]
      border: 1px solid #e8e8e8
      border-radius: 6px
      height: 32px
      margin-top: 2px
      padding: 0 15px
      width: 100%

    .multi-input
      position: relative

      .autocomplete
        border: none
        flex-grow: 1
        padding: 0
        position: static

        input
          border: none
          height: 24px
          margin: 0
          padding: 0

    fieldset
      border: none
      margin: 16px 0 0
      padding: 0

      legend
        font-size: 14px

      label
        display: inline
        font-size: 14px
        vertical-align: middle

      input
        vertical-align: middle

    .status
      legend
        margin-bottom: 4px

      span
        display: inline-block
        line-height: 25px
        width: 49%

      label
        margin-left: 9px

      input
        display: inline-block
        height: 14px
        margin: 0
        width: 14px

    .age-rate
      margin-top: 17px

      legend
        margin-bottom: 4px
        margin-left: 2px

      & > div
        display: flex
        justify-content: space-between
        padding-right: 74px

      label
        margin-left: 4px

    .range
      margin-top: 10px

      &.year
        margin-top: 20px

      & > div
        display: flex
        justify-content: space-between
        margin-top: 2px

      label
        display: block

      input
        width: 130px
</style>
