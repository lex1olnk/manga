<template lang="pug">
.page-book--head
  .bg(:style="book.background ? `background-image: url(/upload/book/background/${book.background})` : ''")
  .fw
    span.age-rate(v-if="book.age_rate > 0") +{{ book.age_rate }}
    a.edit-btn(v-if="isWriteable" :href="`/books/${book.id}/edit`")
    h1 {{ book.name }}
    .alt-title(v-if="book.alt_name") {{ book.alt_name }}

    section
      .book-info
        ul
          li {{ bookTypeName(book.type) }}
          li {{ bookStatusName(book.status) }}
          li
        div
          dl
            dd {{ book.author_name }}
            dt Автор
            dd {{ book.likers_count }}
            dt Лайков
            dd {{ book.viewers_count }}
            dt Просмотров
            dd {{ book.bookmarks_count }} пользовател{{ pluralize(book.bookmarks_count, ['я','ей','ей']) }}
            dt В закладках у
          dl
            dd {{ bookStatusName(book.source_status) }}
            dt Статус оригинала
            dd {{ book.chapters_count }}
            dt Глав
            dd {{ book.year }}
            dt Год выхода
            dd {{ book.rate }}
            dt Общий рейтинг
      .img-wrapper
        .bookmark
          ul
            li(@click="bookmark(null)") Пусто
            li(
              v-for="type in ['process', 'discarded', 'favorite', 'planned']"
              :key="type"
              :data-type="type"
              @click="bookmark(type)"
            ) {{ bookmarkTypeName(type) }}
        img(src="/images/book2.png")
        br
        a(:href="`/books/${book.id}/chapters/${book.reading_history_chapter_number || 1}`") {{book.reading_history_chapter_number ? 'Продолжить чтение' : 'Читать' }}
      .translator-info
        .translator
          a(:href="`/users/${translator.id}`")
            .avatar(
              :class="translator.avatar ? 'has-image' : ''"
              :style="translator.avatar ? `background-image: url(/upload/user/avatar/${translator.avatar})` : ''"
            )
            .name {{ translator.name }}
        .socials
          a(href="#")
            span Team
            br
            | vk.com/team
          br
          a(href="#")
            span TeamDead
            br
            | vk.com/teamdead
          br
          a(href="#")
            span TeamDeadInsides
            br
            | vk.com/teamdeadinsides
          br
</template>

<script setup>
  const props = defineProps(['book', 'isWriteable', 'translator'])

  function bookmark(type) {
    useApi('/bookmark', {method: 'POST', body: {book: {id: props.book.id}, type}})
      .then(response => {
        console.log(response)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-book--head
  background: #fff
  position: relative

  .bg
    background-color: #ff5a5a
    background-position: center
    background-size: cover
    height: 227px
    position: absolute
    width: 100%

  .fw
    position: relative
    z-index: 10

  .age-rate
    background: #fff
    border-radius: 4px
    display: block
    font-size: 14px
    line-height: 40px
    padding: 0 7px
    position: absolute
    right: 61px
    top: 14px

  .edit-btn
    background: transparent url(/images/edit-btn.svg) no-repeat center center
    display: block
    height: 30px
    position: absolute
    right: 14px
    top: 18px
    width: 30px

  h1
    color: #fff
    font-size: 20px
    height: 43px
    margin: 0
    padding-top: 16px
    text-align: center
    text-shadow: #000 2px 2px 2px

  .alt-title
    color: #fff
    font-size: 20px
    height: 27px
    margin-top: 5px
    text-align: center
    text-shadow: #000 2px 2px 2px

  section
    display: flex
    padding-bottom: 18px

  .book-info
    padding-top: 136px
    width: 360px

    ul
      list-style-type: none
      margin: 0
      padding: 0
      text-align: center

      li
        background: #ff5a5a
        border: 1px solid #fff
        color: #fff
        display: inline-block
        font-size: 12px
        line-height: 24px
        padding: 0 20px

        &:first-child
          margin-right: 16px

        &:last-child
          border: none
          display: block

    div
      display: flex
      justify-content: space-between
      margin-top: 33px
      padding-left: 19px

    dl:first-child
      margin: 0
      width: 160px

    dl:last-child
      margin: 0
      width: 141px

    dd
      font-size: 12px
      margin: 0 0 3px
      padding-left: 46px
      position: relative

      &::before
        border: 1px solid #e8e8e8
        border-radius: 50%
        content: ""
        display: block
        height: 30px
        left: 0
        position: absolute
        top: 0
        width: 30px

    dt
      font-size: 10px
      margin: 0 0 8px
      padding-left: 45px

  .img-wrapper
    margin-left: 18px
    margin-right: 18px
    padding-top: 8px
    position: relative
    width: 231px

    img
      border-radius: 8px
      box-shadow: #fff 1px -1px
      width: 100%

    a
      background: #ff5a5a
      border: none
      border-radius: 6px
      color: #fff
      display: inline-block
      font-size: 16px
      font-weight: 700
      line-height: 43px
      text-align: center
      text-decoration: none !important
      width: 100%

    .bookmark
      padding-top: 47px
      position: absolute
      right: 0
      width: 166px

      &::before
        background: rgba(0, 0, 0, .4) url(/images/icon-bookmark.svg) no-repeat center
        border-radius: 0 4px 0 4px
        content: ""
        display: block
        height: 47px
        position: absolute
        right: 0
        top: 0
        width: 38px

      ul
        background: #fff
        border-radius: 6px 6px 0 0
        display: none
        list-style-type: none
        margin: 0
        padding: 0
        width: 100%

      li
        cursor: pointer
        font-size: 12px
        font-weight: 700
        line-height: 32px
        padding: 0px 26px

        &[data-type="process"]
          background: #ff5a5a

        &[data-type="discarded"]
          background: #454545
          color: #fff

        &[data-type="favorite"]
          background: #ffec42

        &[data-type="planned"]
          background: #0077ff
          color: #fff

        &:hover
          font-weight: 900

      &:hover
        ul
          display: block

  .translator-info
    padding-top: 134px
    width: 350px

    .translator
      text-align: center
      margin: 0 auto

      .avatar
        background: #fff url(/images/icon-book-translator.svg) no-repeat center center
        border: 1px solid #e8e8e8
        border-radius: 50%
        display: inline-block
        height: 36px
        margin-right: 13px
        vertical-align: top
        width: 36px

        &.has-image
          background-size: cover

      .name
        background: #ff5a5a
        border: 1px solid #fff
        display: inline-block
        line-height: 31px
        padding: 0 21px
        vertical-align: top

    .socials
      padding: 22px 0 0 45px

      a
        display: inline-block
        font-size: 12px
        line-height: 12px
        margin-bottom: 5px

        span
          display: inline-block
          font-size: 14px
          line-height: 23px
</style>
