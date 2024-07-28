<template lang="pug">
.page-user--bookmarks
  TabsLight
    ul.tabs
      li.active(data-block="all") Все
      li(data-block="in-progress") Читаю
      li(data-block="preferred") Любимое
      li(data-block="discarded") Брошено
      li(data-block="planned") Буду читать
    section.tabs-block.all.active
      div
        BookMiniCard(v-for="index in 10" :book="{}")
    section.tabs-block.in-progress
      h1 Читаю
    section.tabs-block.preferred
      h1 Любимое
    section.tabs-block.discarded
      h1 Брошено
    section.tabs-block.planned
      h1 Буду читать
</template>

<style lang="sass">
.page-user--bookmarks
  padding: 2px 22px

  .tabs-block > div
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    padding-top: 9px

    a
      height: 267px
      width: 184px
</style>
