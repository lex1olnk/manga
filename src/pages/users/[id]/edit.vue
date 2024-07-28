<template lang="pug">
.page-user-edit
  .edit-form
    .lock(ref="lock")
      div Здесь должен быть какой-нибудь спиннер

    label.avatar(ref="avatar" :style="user.avatar ? `background-image: url(/upload/user/avatar/${user.avatar})` : ''")
      input(ref="avatarInput" @change="readAvatar" type="file")
      .plus
      | Добавить аватарку

    .name
      label Никнэйм пользователя
      div
        input(v-model="user.name" type="text")

    .password
      label Пароль
      div
        input(v-model="user.newPassword" type="password")

    .password-repeat
      label Повторите пароль
      div
        input(v-model="user.newPasswordRepeat" type="password")

    .email
      label Почта
      div
        input(v-model="user.email" type="text")

    .socials
      label Добавить ссылки на сообщества
      MultiInput(v-model="socials" :item-wrapper="wrapSocial" limit=3)
        template(#item="item")
          span(@click.prevent="item.select(item.index)") {{ item.uri }}

    label.subscription
      input(v-model="user.email_subscription" type="checkbox")
      | Получать рассылку на почту

    .actions.clearfix
      button.save(@click="save") Сохранить
      a.cancel(:href="`/users/${user.id}`") Отмена
</template>

<script setup>
  definePageMeta({
    middleware: ['auth-require']
  })

  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage
      const currentUser = await event.context.context.user()

      const user = await storage.user.findOne({id: route.params.id})
      if (!user) return []

      const isWriteable = await storage.user.isWriteable(user, currentUser)
      if (!isWriteable) return [storage.user.toPublic(user), false]

      const data = await Promise.all([
        storage.user.getSocials(user)
      ])

      return [user, isWriteable, ...data]
    } catch(e) {console.error(e)}
  })

  const user = ref(data.value[0])
  const isWriteable = ref(data.value[1])
  const socials = ref(data.value[2])

  if (!user) throw createError({statusCode: 404, data: {message: 'Пользователь не найден'}})
  if (!isWriteable) throw createError({statusCode: 403, data: {message: 'Недоступно'}})

  const avatar = ref(null)
  const avatarInput = ref(null)
  const lock = ref(null)

  function readAvatar() {
    const file = avatarInput.value.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      user.value.newAvatar = {
        dataUrl: reader.result,
        name: file.name,
        type: file.type,
      }
      avatar.value.style.backgroundImage = `url(${user.value.newAvatar.dataUrl})`
    }
  }

  function save() {
    lock.value.style.display = 'block'

    useApi(`/user/save`, {method: 'POST', body: {user: user.value, socials: socials.value}})
      .then(response => {
        if ('user' in response) navigateTo(`/users/${response.user.id}`, {external: true})
      })
      .catch(console.error)
      .finally(() => lock.value.style.display = null)
  }

  function wrapSocial(uri) {
    return {uri}
  }
</script>

<style lang="sass">
.page-user-edit
  padding-left: 54px
  padding-top: 55px

  .edit-form
    background: #fff
    box-shadow: rgba(0, 0, 0, .25) 0 4px 4px
    margin: 0 auto
    padding-bottom: 22px
    padding-top: 39px
    position: relative
    width: 800px

    .lock
      background: rgba(0, 0, 0, .25)
      bottom: 0
      display: none
      left: 0
      position: absolute
      right: 0
      top: 0

      div
        color: #fff
        left: 0
        position: absolute
        right: 0
        text-align: center
        top: 50%

    .avatar
      background-position: center center
      background-size: cover
      border: 2px solid #e8e8e8
      border-radius: 50%
      cursor: pointer
      display: block
      font-size: 14px
      height: 236px
      margin: 0 auto
      padding-top: 145px
      position: relative
      text-align: center
      width: 236px

      input
        display: none

      .plus
        border: 1px solid #545f71
        border-radius: 50%
        height: 54px
        left: 50%
        margin-left: -27px
        position: absolute
        top: 70px
        width: 54px

        &::before
          border: 1px solid #545f71
          content: ""
          display: block
          height: 0
          left: 50%
          margin: -1px 0 0 -14px
          position: absolute
          top: 50%
          width: 26px

        &::after
          border: 1px solid #545f71
          content: ""
          display: block
          height: 26px
          left: 50%
          margin: -14px 0 0 -1px
          position: absolute
          top: 50%
          width: 0

    .name
      padding: 51px 33px 0

      label
        display: block
        font-size: 14px

      div
        margin-top: 6px

      input
        height: 35px
        width: 100%

    .password
      padding: 16px 33px 0

      label
        display: block
        font-size: 14px

      div
        margin-top: 6px

      input
        height: 35px
        width: 100%

    .password-repeat
      padding: 16px 33px 0

      label
        display: block
        font-size: 14px

      div
        margin-top: 6px

      input
        height: 35px
        width: 100%

    .email
      padding: 16px 33px 0

      label
        display: block
        font-size: 14px

      div
        margin-top: 6px

      input
        height: 35px
        width: 100%

    .socials
      padding: 16px 33px 0

      label
        display: block
        font-size: 14px

      & > div
        border: 1px solid #e8e8e8
        border-radius: 6px
        line-height: 33px
        margin-top: 6px

        span
          border: 1px solid #e8e8e8
          border-radius: 8px
          display: inline-block
          font-size: 14px
          line-height: 22px
          margin-left: 11px
          padding: 0 8px 0 28px
          vertical-align: middle

        input
          border: none
          line-height: 24px
          margin-left: 11px

    .subscription
      display: block
      font-size: 14px
      line-height: 19px
      padding: 16px 33px 0

      input
        border: 1px solid #e8e8e8
        border-radius: 50%
        margin: 0 21px 0 0
        vertical-align: middle

    .actions
      margin-top: 62px

      .save
        background: #ff5a5a
        border: none
        border-radius: 18px
        color: #fff
        cursor: pointer
        float: right
        font-size: 16px
        line-height: 37px
        margin-right: 33px
        padding: 0 25px

      .cancel
        border: 1px solid #e8e8e8
        border-radius: 18px
        color: #000
        display: inline-block
        float: right
        line-height: 35px
        margin-right: 18px
        padding: 0 36px
</style>
