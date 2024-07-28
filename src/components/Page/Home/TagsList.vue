<template lang="pug">
section.genres-section
  h1.section-header
    span {{ title }}
  .clearfix
  .section-content
    a.genre(v-for="tag in tags" :key="tag.id" :href="makeUrl(tag)") {{ tag.name }}
</template>

<script setup>
  const props = defineProps(['make-url', 'tags', 'title'])
</script>

<style lang="sass">
.genres-section
  margin-top: 15px

  .section-content
    background: #fff
    border-radius: 6px
    margin-top: 9px
    padding: 8px

  .genre
    background: #ff5a5a
    border-radius: 6px
    color: #fff
    cursor: pointer
    display: inline-block
    font-size: 10px
    line-height: 20px
    margin-bottom: 8px
    margin-right: 8px
    padding: 0 10px
    vertical-align: top

    &:hover
      text-decoration-color: #fff
</style>
