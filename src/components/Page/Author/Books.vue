<template lang="pug">
.page-author-books
  BookMiniCard(v-for="book in books" :key="book.id" :book="book")
</template>

<script setup>
  const props = defineProps(['books'])
</script>

<style lang="sass">
.page-author-books
  background: #fff
  display: flex
  flex-wrap: wrap
  justify-content: space-around
  margin-top: 8px
  padding: 17px 19px 17px 16px
</style>
