<template lang="pug">
h2 Пользователь
div(v-if="$context.value.user")
  div id: {{ $context.value.user.id }}
  div email: {{ $context.value.user.email }}
  div name: {{ $context.value.user.name }}
div(v-else) Не авторизован

template(v-if="$context.value.user")
  h2 Мои авторы
  div(v-if="myAuthors.length")
    div(v-for="myAuthor in myAuthors" :key="myAuthor.id")
      a(:href="`/authors/${myAuthor.id}`") {{ myAuthor.name }}
  div(v-else) Нет

template(v-if="$context.value.user")
  h2 Мои книги
  div(v-if="myBooks.length")
    div(v-for="myBook in myBooks" :key="myBook.id")
      a(:href="`/books/${myBook.id}`") {{ myBook.name }}
  div(v-else) Нет

template(v-if="$context.value.user")
  h2 Мои команды
  div(v-if="myTeams.length")
    div(v-for="myTeam in myTeams" :key="myTeam.id")
      a(:href="`/teams/${myTeam.id}`") {{ myTeam.name }}
  div(v-else) Нет
</template>

<script setup>
  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const storage = event.context.storage
      const user = await event.context.context.user()

      return await Promise.all([
        user ? storage.author.find({created_by: user.id}) : [],
        user ? storage.book.find({translator_id: user.id}) : [],
        user ? storage.team.find({created_by: user.id}) : []
      ])
    } catch(e) {console.error(e)}

    return []
  })

  const [myAuthors = [], myBooks = [], myTeams = []] = data.value
</script>
