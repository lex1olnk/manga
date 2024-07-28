<template lang="pug">
.page-faq
  h1 Как пользоваться сайтом
  .page-content-wrapper
    aside
      ul
        li(v-for="question in questions" :key="question.id") {{ question.question }}
    section
      article(v-for="question in questions" :key="question.id")
        h1 {{ question.question }}
        p {{ question.answer }}
</template>

<script setup>
  const questions = [
    {
      id: 1,
      question: 'Как создать перевод на сайте readzone.ru',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 2,
      question: 'Свойства перевода',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 3,
      question: 'Тэги / жанры / фэндомы',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ]
</script>

<style lang="sass">
.page-faq
  padding: 37px 250px 0 106px

  h1
    background: #fff
    font-size: 18px
    line-height: 40px
    margin: 0
    padding: 0 26px

  .page-content-wrapper
    display: flex
    justify-content: space-between
    margin-top: 25px

  aside
    width: 317px

    ul
      background: #fff
      border-radius: 8px
      list-style-type: none
      margin: 0
      padding: 19px 27px 20px 27px

    li
      cursor: pointer
      font-size: 11px
      margin-bottom: 9px

      &:hover
        text-decoration: underline

  section
    width: 743px

    article
      background: #fff
      border-radius: 8px
      margin-bottom: 8px
      padding: 13px 10px 16px 26px

      h1
        font-size: 16px
        font-weight: 700
        line-height: 22px
        margin: 0
        padding: 0

      p
        font-size: 12px
        margin: 14px 0 0
</style>
