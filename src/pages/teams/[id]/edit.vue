<template lang="pug">
.page-team-edit
  .edit-form
    .lock(ref="lock")
      div Здесь должен быть какой-нибудь спиннер
    .images
      div
        label.avatar(ref="avatar" :style="team.avatar ? `background-image: url(/upload/team/avatar/${team.avatar})` : ''")
          input(ref="avatarInput" @change="readAvatar" type="file")
          .plus
          | Добавить аватарку
      div
        label.background(ref="background" :style="team.background ? `background-image: url(/upload/team/background/${team.background}); background-size: cover` : ''")
          input(ref="backgroundInput" @change="readBackground" type="file")
          | нажмите сюда<br>для добавления обложки<br>команды

    .name
      label Название название команды
      div
        input(v-model="team.name" type="text")

    .socials
      label Добавить ссылки на сообщества
      MultiInput(v-model="socials" :item-wrapper="wrapSocial" limit=3)
        template(#item="item")
          span(@click.prevent="item.select(item.index)") {{ item.uri }}

    .description
      label Описание
      div
        textarea(v-model="team.description")

    .actions.clearfix
      button.save(@click="save") Сохранить
      a(:href="team.id ? `/teams/${team.id}` : '/'").cancel Отмена
</template>

<script setup>
  definePageMeta({
    middleware: ['auth-require']
  })

  const {data} = await useAsyncData(async () => {
    try {
    const route = useRoute()
    if (route.params.id === '0') return [{}, true]

    const event = useRequestEvent()
    const storage = event.context.storage
    const user = await event.context.context.user()

    const team = await storage.team.findOne({id: route.params.id})
    if (!team) return []

    const isWriteable = await storage.team.isWriteable(team, user)
    if (!isWriteable) return [storage.team.toPublic(team), false]

    const data = await Promise.all([
      isWriteable,
      storage.team.getSocials(team)
    ])

    return [team, ...data]
    } catch(e) {console.error(e)}
  })

  const team = ref(data.value?.[0])
  const isWriteable = ref(data.value?.[1])
  const socials = ref(data.value?.[2])

  if (!team.value) throw createError({statusCode: 404, data: {message: 'Команда не найдена'}})
  if (!isWriteable.value) throw createError({statusCode: 403, data: {message: 'Недоступно'}})

  const avatar = ref(null)
  const avatarInput = ref(null)
  const background = ref(null)
  const backgroundInput = ref(null)
  const lock = ref(null)

  function readAvatar() {
    const file = avatarInput.value.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      team.value.newAvatar = {
        dataUrl: reader.result,
        name: file.name,
        type: file.type,
      }
      avatar.value.style.backgroundImage = `url(${team.value.newAvatar.dataUrl})`
    }
  }

  function readBackground() {
    const file = backgroundInput.value.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      team.value.newBackground = {
        dataUrl: reader.result,
        name: file.name,
        type: file.type,
      }
      background.value.style.backgroundImage = `url(${team.value.newBackground.dataUrl})`
      background.value.style.backgroundSize = 'cover'
    }
  }

  function save() {
    lock.value.style.display = 'block'

    useApi('/team/save', {method: 'POST', body: {team: team.value, socials: socials.value}})
      .then(response => {
        if ('team' in response) navigateTo(`/teams/${response.team.id}`, {external: true})
      })
      .catch(console.error)
      .finally(() => lock.value.style.display = null)
  }

  function wrapSocial(uri) {
    return {uri}
  }
</script>

<style lang="sass">
.page-team-edit
  padding-left: 53px
  padding-top: 28px

  .edit-form
    background: #fff
    box-shadow: rgba(0, 0, 0, .25) 0 4px 4px
    margin: 0 auto
    padding-bottom: 36px
    position: relative
    width: 1009px

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

    .images
      display: flex
      padding-top: 10px

      & > div:first-child
        flex-shrink: 0
        padding: 29px 0 0 304px

      & > div:nth-child(2)
        flex-shrink: 0
        padding: 15px 0 0 28px

    .avatar
      background-position: center center
      background-size: cover
      border: 2px solid #e8e8e8
      border-radius: 50%
      cursor: pointer
      display: block
      font-size: 14px
      height: 236px
      padding-top: 144px
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
        margin: -46px 0 0 -27px
        position: absolute
        top: 50%
        width: 54px

        &::before
          border: 1px solid #545f71
          content: ""
          display: block
          height: 0
          left: 50%
          margin: -1px 0 0 -13px
          position: absolute
          top: 50%
          width: 26px

        &::after
          border: 1px solid #545f71
          content: ""
          display: block
          height: 26px
          left: 50%
          margin: -13px 0 0 -1px
          position: absolute
          top: 50%
          width: 0

    .background
      background: transparent url(/images/form-image.svg) no-repeat center 22px
      border: 1px solid #e8e8e8
      cursor: pointer
      display: block
      font-size: 12px
      height: 271px
      padding-top: 214px
      text-align: center
      width: 201px

      input
        display: none

    .name
      margin-top: 26px

      label
        display: block
        font-size: 14px
        padding: 0 62px

      div
        padding: 6px 37px 0 61px

      input
        height: 35px
        width: 100%

    .socials
      margin-top: 14px

      label
        font-size: 14px
        padding: 0 62px

      .multi-input
        border: 1px solid #e8e8e8
        border-radius: 6px
        line-height: 33px
        margin: 5px 37px 0 61px

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

    .description
      margin-top: 137px

      label
        display: block
        font-size: 14px
        padding: 0 61px

      div
        padding: 8px 17px 0 61px

      textarea
        border: 1px solid #454545
        border-radius: 6px
        height: 348px
        width: 100%

    .actions
      margin-top: 82px

      .save
        background: #ff5a5a
        border: none
        border-radius: 18px
        color: #fff
        cursor: pointer
        float: right
        font-size: 16px
        line-height: 37px
        margin-right: 44px
        padding: 0 25px

      .cancel
        border: 1px solid #e8e8e8
        border-radius: 18px
        color: #000
        float: right
        font-size: 16px
        line-height: 35px
        margin-right: 17px
        padding: 0 36px
</style>
