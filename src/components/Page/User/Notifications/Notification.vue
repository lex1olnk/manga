<template lang="pug">
.page-user--notifications--notification
  .image
    img(src="/images/book1.png")
  .details
    .type
      | Комментарий к главе
      span.when год назад
    .name Название книги - Название главы
    p Контент, текст комментария
    button.delete Удалить
</template>

<style lang="sass">
.page-user--notifications--notification
  border: 1px solid #e8e8e8
  border-radius: 8px
  display: flex
  height: 120px
  margin-bottom: 10px
  position: relative

  .image
    width: 83px

    img
      width: 100%

  .details
    margin-left: 12px
    padding-top: 11px

  .type
    font-size: 14px
    line-height: 18px

  .when
    font-size: 10px
    margin-left: 24px

  .name
    font-size: 14px
    margin-top: 10px

  p
    font-size: 12px
    margin: 10px 0

  .delete
    bottom: 8px
    background: #ff5a5a
    border: none
    border-radius: 6px
    color: #fff
    cursor: pointer
    line-height: 24px
    padding: 0 20px
    position: absolute
    right: 15px
</style>
