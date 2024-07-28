<template lang="pug">
footer.page-footer
  .copyright
    a(href="/")
      img(src="/images/logo.png")
    p &copy; 2024 Readzone. Все права защищены.

  nav
    a(href="/about") О нас
    br
    a(href="/license") Лицензия
    br
    a(href="/feedback") Обратная связь
    br
    a(href="/copyright") Для правообладателей
    br
    a(href="/agreement") Пользовательское соглашение

  .contacts
    a.tg(href="/tg")
      img(src="/images/footer-tg.svg")
    p Поддержка: 
      a(href="mailto:readzone@gmail.com") readzone@gmail.com
</template>

<style lang="sass">
.page-footer
  background: #fff
  display: flex
  height: 144px
  margin-top: 100px
  padding: 15px 0 15px

  .copyright
    border-right: 2px solid #f3f3f3
    font-size: 14px
    padding: 14px 10px 10px 172px
    width: 533px

    a
      display: inline-block
      padding: 3px 0 0 31px

    p
      margin-top: 11px

  nav
    border-right: 2px solid #f3f3f3
    line-height: 19px
    padding: 7px 0 0 59px
    width: 400px

    a
      color: #000
      font-size: 11px

  .contacts
    padding: 17px 0 0 114px

    .tg
      display: inline-block
      margin-left: 106px

    p
      margin-top: 13px

      a
        color: #000
</style>
