<template lang="pug">
.page-user--notifications
  TabsLight
    ul.tabs
      li(data-block="all") Все
      li(data-block="book") Книга
      li.active(data-block="comments") Комментарии
      li(data-block="system") Системные
      li(data-block="team") Команда
      li(data-block="reports") Репорты
    section.tabs-block.all
      h1 Все
    section.tabs-block.book
      h1 Книга
    section.tabs-block.comments.active
      div
        PageUserNotificationsNotification
        PageUserNotificationsNotification
        PageUserNotificationsNotification
    section.tabs-block.system
      h1 Системные
    section.tabs-block.team
      h1 Команда
    section.tabs-block.reports
      h1 Репорты
</template>

<style lang="sass">
.page-user--notifications
  padding: 2px 14px

  .tabs-block > div
    padding: 10px 1px
</style>
