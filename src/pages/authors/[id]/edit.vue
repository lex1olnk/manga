<template lang="pug">
.page-author-edit
  .edit-form
    .lock(ref="lock")
      div Здесь должен быть какой-нибудь спиннер
    label.avatar(ref="avatar" :style="author.avatar ? `background-image: url(/upload/author/avatar/${author.avatar})` : ''")
      input(ref="avatarInput" @change="readAvatar" type="file")
      .plus
      | Добавить аватарку
    label.name Никнэйм автора
    .name
      input(v-model="author.name" type="text")
    label.birth-date Дата рождения
    .birth-date
      DateInput(v-model="author.birth_date" type="text")
    label.socials Добавить ссылки на сообщества
    MultiInput.socials(v-model="socials" :item-wrapper="wrapSocial" limit=3)
      template(#item="item")
        span(@click.prevent="item.select(item.index)") {{ item.uri }}
    .controls.clearfix
      button.save(@click.prevent="save") Сохранить
      a.cancel(:href="author.id ? `/authors/${author.id}` : '/'") Отмена
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

      const author = await storage.author.findOne({id: route.params.id})
      if (!author) return []

      const isWriteable = await storage.author.isWriteable(author, user)
      if (!isWriteable) return [storage.author.toPublic(author), false]

      return await Promise.all([
        storage.author.toPublic(author),
        isWriteable,
        storage.author.getSocials(author)
      ])
    } catch(e) {console.error(e)}
  })

  const author = ref(data.value[0])
  const isWriteable = ref(data.value[1] || false)
  const socials = ref(data.value[2] || [])

  if (!author.value) throw createError({statusCode: 404, data: {message: 'Автор не найден'}})
  if (!isWriteable.value) throw createError({statusCode: 403, data: {message: 'Недоступно'}})

  const avatar = ref(null)
  const avatarInput = ref(null)
  const lock = ref(null)

  function readAvatar() {
    const file = avatarInput.value.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      author.value.newAvatar = {
        dataUrl: reader.result,
        name: file.name,
        type: file.type,
      }
      avatar.value.style.backgroundImage = `url(${author.value.newAvatar.dataUrl})`
    }
  }

  function save() {
    lock.value.style.display = 'block'

    useApi(`/author/save`, {method: 'POST', body: {author: author.value, socials: socials.value}})
      .then(response => {
        if ('author' in response) navigateTo(`/authors/${response.author.id}`, {external: true})
      })
      .catch(console.log)
      .finally(() => lock.value.style.display = null)
  }

  function wrapSocial(uri) {
    return {uri}
  }
</script>

<style lang="sass">
.page-author-edit
  padding-left: 54px
  padding-top: 133px

  .edit-form
    background: #fff
    box-shadow: rgba(0, 0, 0, .25) 0px 4px 4px
    margin: 0 auto
    padding: 37px 0 25px
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
      font-size: 13px
      height: 236px
      margin: 0 auto
      padding-top: 146px
      position: relative
      text-align: center
      width: 236px

      input[type="file"]
        display: none

      .plus
        border: 1px solid #545f71
        border-radius: 50%
        height: 54px
        left: 50%
        margin-left: -27px
        position: absolute
        top: 71px
        width: 54px

        &::before
          background: #545f71
          content: ""
          height: 2px
          left: 50%
          margin: -1px 0 0 -13px
          position: absolute
          top: 50%
          width: 26px

        &::after
          background: #545f71
          content: ""
          height: 26px
          left: 50%
          margin: -13px 0 0 -1px
          position: absolute
          top: 50%
          width: 2px

    label.name
      display: block
      font-size: 14px
      margin-top: 52px
      padding: 0 34px

    div.name
      margin-top: 6px
      padding: 0 33px

      input
        height: 35px
        padding: 0 2em
        width: 100%

    label.birth-date
      display: block
      font-size: 14px
      margin-top: 20px
      padding: 0 35px

    div.birth-date
      margin-top: 6px
      padding-left: 33px

      input
        height: 35px
        padding: 0 2em
        width: 203px

    label.socials
      display: block
      font-size: 14px
      margin-top: 20px
      padding-left: 37px

    div.socials
      border: 1px solid #e8e8e8
      border-radius: 6px
      line-height: 33px
      margin: 6px 33px 0 33px

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

    .controls
      margin-top: 31px
      padding: 0 33px

      *
        border-radius: 18px
        cursor: pointer
        float: right
        font-size: 15px
        line-height: 35px

      .save
        background: #ff5a5a
        border: 1px solid transparent
        border-radius: 18px
        color: #fff
        padding: 0 27px

      .cancel
        background: transparent
        border: 1px solid #e8e8e8
        color: #000
        margin-right: 16px
        padding: 0 39px
</style>
