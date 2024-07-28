<template lang="pug">
.multi-input
  template(v-for="(item, index) in items")
    slot(name="item" v-bind="item" :index="index" :select="select")
      span {{ item }}
  template(v-if="limit < 1 || items.length < limit")
    Autocomplete(
      v-if="autocompleteSource"
      @select="item => add(item.value)"
      :clear-after-select="true"
      :search-empty="searchEmpty"
      :source="autocompleteSource"
      :sourceData="autocompleteSourceData"
    )
    input(v-else v-model="value" @keyup.enter="add($event.target.value)" size="1")
</template>

<script setup>
  const items = defineModel({default: [], required: true})
  const props = defineProps({
    'autocomplete-source': {},
    'autocomplete-source-data': {},
    'item-wrapper': {},
    'limit': {default: 0},
    'search-empty': {},
  })
  const value = ref('')

  function add(item) {
    if (typeof(item) === 'string') item = item.trim()
    if (!item) return

    item = props.itemWrapper ? props.itemWrapper(item) : item
    items.value.push(item)
    value.value = ''
  }

  function select(index) {
    items.value.splice(index, 1)
  }
</script>

<style lang="sass">
.multi-input
  border: 1px solid #e8e8e8
  border-radius: 6px
  display: flex
  flex-wrap: wrap
  line-height: 34px
  padding-left: 8px
  padding-top: 5px

  span
    border: 1px solid #e8e8e8
    border-radius: 8px
    font-size: 14px
    line-height: 22px
    margin-bottom: 5px
    margin-right: 8px
    padding: 0 8px
    vertical-align: middle

  input
    border: none
    flex-grow: 1
    height: 24px
    margin-bottom: 5px
    margin-right: 8px
    vertical-align: middle
</style>
