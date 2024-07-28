<template lang="pug">
.page-teams
  h1 Команды
  .page-content
    section
      .search-toolbox
        .filter
          input(type="text" placeholder="Поиск по названию команды")
          button Искать
        .sort
          label Сортировка
          span Название

      PageTeamsTeam(
        v-for="team in teams"
        :team="team"
        :class="team.background ? 'has-cover' : ''"
        :style="team.background ? `background-image: url(/upload/team/background/${team.background})` : ''"
      )
    aside
      h1.section-header
        span Топы по работам
      .clearfix

      .top-teams
        a.clearfix(href="#")
          img(src="/images/book1.png")
          span Команда DeadInside
        a.clearfix(href="#")
          img(src="/images/book1.png")
          span Команда DeadInside
        a.clearfix(href="#")
          img(src="/images/book1.png")
          span Команда DeadInside
</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const storage = event.context.storage

      const teams = await storage.team.find({})
      const queries = teams.map(team => storage.book.find({translator_id: team.created_by}, {limit: 3}))
      const books = await Promise.all(queries)

      for (const index in teams) teams[index].books = books[index]

      return [
        teams.map(team => storage.team.toPublic(team))
      ]

    } catch(e) {console.error(e)}
  })

  const teams = ref(data.value?.[0])
</script>

<style lang="sass">
.page-teams
  margin: 0 auto
  padding-top: 22px
  width: 1280px

  & > h1
    background: #fff
    border-radius: 8px
    font-size: 16px
    font-weight: 500
    line-height: 42px
    margin: 0
    padding: 0 17px

  .page-content
    display: flex
    justify-content: space-between
    margin-top: 8px

    & > section
      width: 956px

    & > aside
      width: 308px

    .search-toolbox
      background: #fff
      border-radius: 8px
      display: flex
      height: 57px
      justify-content: space-between
      margin-bottom: 10px

      .filter
        line-height: 57px
        padding-left: 16px

        input[type="text"]
          height: 36px
          vertical-align: middle
          width: 532px
          padding: 0 15px

        button
          background: transparent
          border: none
          height: 36px
          margin-left: 10px
          vertical-align: middle

      .sort
        line-height: 57px

        label
          font-size: 14px
          margin-right: 19px
          vertical-align: middle

        span
          border: 1px solid #e8e8e8
          border-radius: 8px
          display: inline-block
          font-size: 14px
          line-height: 34px
          margin-right: 13px
          padding: 0 46px
          vertical-align: middle

  .top-teams
    background: #fff
    margin-top: 7px
    padding: 9px 13px 18px

    a
      color: #000
      display: inline-block
      font-size: 12px
      line-height: 32px
      margin-bottom: 12px

      img
        border-radius: 50%
        height: 32px
        vertical-align: middle
        width: 32px

      span
        margin-left: 14px
        vertical-align: middle
</style>
