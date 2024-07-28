<template lang="pug">
header.page-header
  a.logo(href="/")
    img(src="/images/logo.png")

  nav(style="width: 540px")
    a.catalog(href="/books") Каталог
    a.teams(href="/teams") Команды
    a.faq(href="/faq") FAQ
    a.search(@click="vfm.open('search-modal')") Поиск

  .menu-bar
    img.add(v-if="$context?.value?.user" ref="addMenuTrigger" @click.prevent="toggleAddMenu" src="/images/head-add.svg")
    img.notice(v-if="$context?.value?.user" src="/images/head-notice.svg")
    img(ref="userMenuTrigger" @click.prevent="toggleUserMenu" src="/images/head-profile.svg")

  .add-menu(ref="addMenu")
    div
      a(href="/authors/0/edit") Добавить автора
    div
      a(href="/teams/0/edit") Добавить команду

  .user-menu(ref="userMenu")
    div
      a(href="/debug") Отладка
    div
      a(v-if="$context?.value?.user" :href="`/users/${$context.value.user.id}`") Профиль
    div
      a(v-if="$context?.value?.user") Настройки
    div
      a(v-if="$context?.value?.user?.role === 'admin'" href="/admin") Админ-панель
    div
      a(v-if="$context?.value?.user") Доходы
    div
      a Закладки
    div
      a(v-if="!$context?.value?.user" href="/login") Войти
    div
      a(v-if="$context?.value?.user" @click.prevent="logout") Выйти

  Search(modal-id="search-modal")
</template>

<script setup>
  import {useVfm} from 'vue-final-modal'

  const addMenu = ref(null)
  const addMenuTrigger = ref(null)
  const userMenu = ref(null)
  const userMenuTrigger = ref(null)
  const vfm = useVfm()

  function hideAddMenu(event) {
    if (addMenu.value.contains(event.target)) return
    if (addMenuTrigger.value.contains(event.target)) return

    addMenu.value.style.display = null
    document.removeEventListener('click', hideAddMenu)
  }

  function hideUserMenu(event) {
    if (userMenu.value.contains(event.target)) return
    if (userMenuTrigger.value.contains(event.target)) return

    userMenu.value.style.display = null
    document.removeEventListener('click', hideUserMenu)
  }

  function logout() {
    useApi('/logout', {method: 'POST'})
      .then(() => navigateTo('/', {external: true}))
      .catch(console.error)
  }

  function toggleAddMenu() {
    if (!addMenu.value.style.display) {
      addMenu.value.style.display = 'block'
      document.addEventListener('click', hideAddMenu)
    }
  }

  function toggleUserMenu() {
    if (!userMenu.value.style.display) {
      userMenu.value.style.display = 'block'
      document.addEventListener('click', hideUserMenu)
    }
  }
</script>

<style lang="sass">
.page-header
  background: #fff
  border-radius: 6px
  display: flex
  flex-wrap: nowrap
  height: 56px
  justify-content: space-between
  position: relative
  z-index: 100

  .logo
    padding: 10px 27px 0

    img
      width: 145px

  nav
    line-height: 54px

    a
      color: #000
      font-size: 16px
      font-weight: 500
      text-decoration: none

      &::before
        background-color: transparent
        background-position: center center
        background-repeat: no-repeat
        content: ""
        display: inline-block
        height: 22px
        vertical-align: middle
        width: 22px

      &.catalog
        &::before
          background-image: url(/images/head-catalog.svg)
          margin-right: 9px

      &.teams
        margin-left: 43px

        &::before
          background-image: url(/images/head-teams.svg)
          margin-right: 8px

      &.faq
        margin-left: 49px

        &::before
          background-image: url(/images/head-faq.svg)
          margin-right: 9px

    .search
      cursor: pointer
      margin-left: 42px

      &::after
        background: transparent url(/images/head-search.svg) no-repeat center center
        content: ""
        display: inline-block
        height: 20px
        margin-left: 2px
        vertical-align: middle
        width: 20px

      &::before
        display: none

  .menu-bar
    padding: 12px 21px 0 0

    img
      cursor: pointer

    .add
      margin-right: 22px

    .notice
      margin-right: 26px

    .profile
      position: relative
      top: 2px

  .user-menu, .add-menu
    background: #fff
    border: 1px solid #e8e8e8
    border-radius: 8px
    display: none
    padding: 4px 19px
    position: absolute
    right: 0
    top: 56px
    width: 169px
    z-index: 100

    a
      color: #000
      cursor: pointer
      font-size: 14px
      line-height: 31px
</style>
