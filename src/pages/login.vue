<template lang="pug">
.page-login
  .login-form-wrapper
    .welcome
      h4 Добро пожаловать к нам!
      p Чувствуйте себя как дома

    .login-form
      h1 Авторизация
      label Почта
      input(v-model="login" @keyup.enter="submit" type="text")
      label Пароль
      input(v-model="password" @keyup.enter="submit" type="password")
      a.forgot(href="/forgot") забыли пароль?
      .clearfix
      .submit-wrapper
        button(@click="submit") Войти
      .register-wrapper
        a(href="/register") Нет аккаунта? Регистрируйтесь
</template>

<script setup>
  definePageMeta({
    middleware: ['auth-kick-out']
  })

  const login = ref('')
  const password = ref('')

  function submit() {
    useApi('/login', {method: 'POST', body: {login: login.value, password: password.value}})
      .then(response => {
        if (response?.context?.user) navigateTo(`/users/${response.context.user.id}`, {external: true}).catch(console.error)
      })
      .catch(console.error)
  }
</script>

<style lang="sass">
.page-login
  padding-top: 213px

  .login-form-wrapper
    display: flex
    height: 447px
    justify-content: space-between
    margin: 0 auto
    padding-left: 12px
    width: 936px

  .welcome
    background: #ff5a5a url(/images/login-form.png) no-repeat center 53px
    color: #fff
    padding-top: 307px
    text-align: center
    width: 348px

    h4
      margin-bottom: 0

    p
      font-size: 14px
      margin-top: 18px

  .login-form
    background: #fff
    padding: 50px 99px 0 101px
    width: 564px

    h1
      font-size: 16px
      font-weight: 700
      margin-bottom: 37px
      text-align: center

    label
      display: block
      font-size: 14px
      padding-left: 10px
      width: 100%

    input
      border: 1px solid #e8e8e8
      border-radius: 6px
      color: #333333
      display: block
      line-height: 34px
      margin: 4px 0 12px
      padding: 0 15px
      width: 100%

      &:focus
        border-color: #b6b6b6

    .forgot
      color: #000
      float: right
      font-size: 14px
      margin-right: 11px

    .submit-wrapper
      padding-top: 24px
      text-align: center

      button
        background: #ff5a5a
        border: none
        border-radius: 18px
        color: #fff
        cursor: pointer
        display: inline-block
        font-size: 16px
        line-height: 37px
        padding: 0 27px 0
        text-align: center

    .register-wrapper
      padding-top: 20px
      text-align: center

      a
        color: #000
        font-size: 14px
</style>
