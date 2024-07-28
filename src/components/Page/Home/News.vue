<template lang="pug">
section.news-section
  h1.section-header
    span Новости
  .clearfix
  ul
    li(v-for="story in news" :key="story.id")
      a(href="#") {{ story.name }}
      .date {{ formatDate(story.created_at) }}
      .author {{ story.creator_name }}
</template>

<script setup>
  const props = defineProps(['news'])
</script>

<style lang="sass">
.news-section
  ul
    background: #fff
    border-radius: 6px
    list-style-type: none
    margin: 5px 0 0
    padding: 0 0 8px

    li
      font-size: 12px
      padding: 8px 8px 1px
      position: relative

      a
        color: #000

      .date
        margin-top: 3px

      .author
        bottom: 1px
        position: absolute
        right: 7px
</style>
