<template lang="pug">
.page-book-edit
  .edit-form(ref="editForm")
    .lock(ref="lock")
      div Здесь должен быть какой-нибудь спиннер
    .images
      label.main
        input(type="file")
        | нажмите сюда<br>для добавления заглавной<br>картинки
      label.additional(ref="background" :style="book.background ? `background-image: url(/upload/book/background/${book.background}); background-size: contain` : ''")
        input(ref="backgroundInput" @change="readBackground" type="file")
        | нажмите сюда для<br>добавления картинки
    .name.input-field
      label Название тайтла
      div
        input(v-model="book.name" type="text" :class="'name' in errors ? 'error' : ''")
        .error-message {{ errors?.name }}
    .alt-name.input-field
      label Альтернативное название (писать другие названия через разделитель /, например "Наруто / Naruto")
      div
        input(v-model="book.alt_name" type="text" :class="'alt_name' in errors ? 'error' : ''")
        .error-message {{ errors?.alt_name }}
    .inputs-group
      .author.input-field
        label Автор
        div
          Autocomplete(v-model="book.author_id" :class="'author_id' in errors ? 'error' : ''" :name="book.author_name" :source="authorSearch")
          .error-message {{ errors?.author_id }}
      .age-rate.input-field
        label Возрастное ограничение
        div
          select(v-model="book.age_rate" :class="'age_rate' in errors ? 'error' : ''")
            option(value="0") Нет
            option(value="16") 16+
            option(value="18") 18+
          .error-message {{ errors?.age_rate }}
      .year.input-field
        label Год выпуска
        div
          input(v-model="book.year" type="text" :class="'year' in errors ? 'error' : ''")
          .error-message {{ errors?.year }}
      .source-language.input-field
        label Язык оригинала
        div
          input(v-model="book.source_lang" type="text" :class="'source_lang' in errors ? 'error' : ''")
          .error-message {{ errors?.source_lang }}
      .source-status.input-field
        label Статус оригинала
        div
          select(v-model="book.source_status" :class="'source_status' in errors ? 'error' : ''")
            option(:value="null") Выбрать...
            option(value="discarded") {{ bookSourceStatusName('discarded') }}
            option(value="done") {{ bookSourceStatusName('done') }}
            option(value="frozen") {{ bookSourceStatusName('frozen') }}
            option(value="progress") {{ bookSourceStatusName('progress') }}
          .error-message {{ errors?.source_status }}
      .status.input-field
        label Статус книги
        div
          select(v-model="book.status" :class="'status' in errors ? 'error' : ''")
            option(:value="null") Выбрать...
            option(value="discarded") {{ bookStatusName('discarded') }}
            option(value="done") {{ bookStatusName('done') }}
            option(value="frozen") {{ bookStatusName('frozen') }}
            option(value="progress") {{ bookStatusName('progress') }}
          .error-message {{ errors?.status }}
    .category.input-field
      label Категория
      div
        select(v-model="book.type" :class="'type' in errors ? 'error' : ''")
          option(:value="null") Выбрать...
          option(value="original") {{ bookTypeName('original') }}
          option(value="translation") {{ bookTypeName('translation') }}
          option(value="orig_fanfic") {{ bookTypeName('orig_fanfic') }}
          option(value="trans_fanfic") {{ bookTypeName('trans_fanfic') }}
        .error-message {{ errors?.type }}
    .genres.multi-input-field
      label Жанры
      MultiInput(v-model="book.genres" :autocomplete-source="autocompleteGenres" :autocomplete-source-data="book.genres" :limit="8" :search-empty="true")
        template(#item="genre")
          span(@click.prevent="genre.select(genre.index)") {{ genre.name }}
    .tags.multi-input-field
      label Тэги
      MultiInput(v-model="book.tags" :autocomplete-source="autocompleteTags" :autocomplete-source-data="book.tags" :limit="8" :search-empty="true")
        template(#item="tag")
          span(@click.prevent="tag.select(tag.index)") {{ tag.name }}
    .fandoms.multi-input-field
      label Фандомы
      MultiInput(v-model="book.fandoms" :autocomplete-source="autocompleteFandoms" :autocomplete-source-data="book.fandoms" :limit="8" :search-empty="true")
        template(#item="fandom")
          span(@click.prevent="fandom.select(fandom.index)") {{ fandom.name }}
    .translator.input-field
      label Переводчик
      div
        .error-message(v-if="book.id") Обратите внимание, после передачи книги другому переводчику у вас не будет возможности её редактировать
        Autocomplete(v-model="book.translator_id" :class="'translator_id' in errors ? 'error' : ''" :name="book.translator_name" :source="translatorSearch")
        .error-message {{ errors?.translator_id }}
    .socials.multi-input-field
      label Добавить ссылки на сообщества
      MultiInput(v-model="socials" :item-wrapper="wrapSocial" :limit="3")
        template(#item="item")
            span(@click.prevent="item.select(item.index)") {{ item.uri }}
    .description
      label Описание
      div
        textarea(v-model="book.description" :class="'description' in errors ? 'error' : ''")
        .error-message {{ errors?.description }}
    .actions.clearfix
      .error-message(v-for="error in commonErrors") {{ error.message }}
      button.save(@click.prevent="save") Сохранить
      a.cancel(:href="book.id ? `/books/${book.id}` : '/'") Назад
</template>

<script setup>
  definePageMeta({
    middleware: ['auth-require']
  })

  const commonErrors = ref([])
  const errors = ref({})

  const {data} = await useAsyncData(async () => {
    try {
      const event = useRequestEvent()
      const route = useRoute()
      const storage = event.context.storage
      const user = await event.context.context.user()

      const book = await storage.book.findOne({id: route.params.id}, {with: ['author', 'translator']})
      if (!book) return []

      const isWriteable = await storage.book.isWriteable(book, user)
      if (!isWriteable) return [storage.book.toPublic(book), false]

      return Promise.all([
        book,
        isWriteable,
        storage.book.getSocials(book),
        storage.book.attachGenres([book]),
        storage.book.attachTags([book]),
        storage.book.attachFandoms([book]),
      ])
    } catch(e) {console.error(e)}
  })

  const book = ref(data.value?.[0])
  const isWriteable = ref(data.value?.[1])
  const socials = ref(data.value?.[2])

  if (!book.value) throw createError({statusCode: 404, data: {message: 'Книга не найдена'}})
  if (!isWriteable.value) throw createError({statusCode: 403, data: {message: 'Недоступно'}})

  const background = ref(null)
  const backgroundInput = ref(null)
  const editForm = ref(null)
  const lock = ref(null)

  async function authorSearch(text) {
    if (!text.length) return []

    try {
      const {authors} = await useApi(`/autocomplete/authors?text=${text}`)

      if (authors) {
        return authors.map(author => {
          return {
            id: author.id,
            name: author.name,
            value: author.id,
          }
        })
      }
    } catch(e) {console.error(e)}
  }

  async function translatorSearch(text) {
    if (!text.length) return []

    try {
      const response = await useApi(`/autocomplete/translators?text=${text}`)

      if (response?.translators)
      return response.translators.map(translator => {
        return {
          id: translator.id,
          name: translator.name,
          value: translator.id,
        }
      })
    } catch(e) {console.error(e)}
  }

  function readBackground() {
    const file = backgroundInput.value.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      book.value.newBackground = {
        dataUrl: reader.result,
        name: file.name,
        type: file.type,
      }
      background.value.style.backgroundImage = `url(${book.value.newBackground.dataUrl})`
      background.value.style.backgroundSize = 'contain'
    }
  }

  function save() {
    lock.value.style.display = 'block'
    commonErrors.value = []
    errors.value = {}

    useApi('/book/save', {method: 'POST', body: {book: book.value, socials: socials.value}, 'suppress-errors': true})
      .then(response => {
        if ('book' in response) alert('Ok')

        if ('$errors' in response) {
          for (const error of response.$errors) {
            if ('field' in error) errors.value[error.field] = error.message
            else commonErrors.value.push(error)
          }
        }
      })
      .catch(console.error)
      .finally(() => lock.value.style.display = null)
  }

  function wrapSocial(uri) {
    return {uri}
  }
</script>

<style lang="sass">
.page-book-edit
  padding-top: 32px

  .edit-form
    background: #fff
    margin: 0 auto
    padding: 57px 48px 28px
    position: relative
    width: 1024px

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
      justify-content: center

      label
        background: transparent url(/images/form-image-book.svg) no-repeat center 62px
        border: 1px solid #e8e8e8
        cursor: pointer
        font-size: 12px
        padding-bottom: 7px
        padding-top: 213px
        text-align: center
        width: 201px

        &.main
          margin-right: 19px

        input
          display: none

    .error-message
      color: #ff5a5a
      font-size: 12px
      margin-top: 4px

    .inputs-group
      display: flex
      flex-wrap: wrap

    .input-field
      margin-top: 12px

      label
        display: block
        font-size: 14px

      & > div
        margin-top: 8px

      input, .autocomplete
        height: 36px
        width: 100%

      select
        width: 100%

      .autocomplete.error
        input
          border-color: #ff5a5a

    .multi-input-field
      margin-top: 10px
      position: relative

      label
        font-size: 14px

      .autocomplete
        border: none
        flex-grow: 1
        padding: 0
        position: static

        input
          border: none
          height: 100%
          padding: 0
          width: 100%

    .name
      margin-top: 36px

    .author, .source-language
      width: 513px

    .age-rate, .source-status
      margin-left: 34px
      width: 175px

    .year, .status
      margin-left: 31px
      width: 175px

    .category
      margin-top: 14px

    .description
      margin-top: 8px

      label
        font-size: 14px

      div
        margin-top: 8px

      textarea
        border: 1px solid #454545
        border-radius: 6px
        height: 348px
        padding: 1em
        resize: none
        width: 100%

        &.error
          border-color: #ff5a5a

    .actions
      margin-top: 25px

      .save
        background: #ff5a5a
        border: none
        border-radius: 18px
        color: #fff
        cursor: pointer
        float: right
        font-size: 16px
        line-height: 37px
        padding: 0 25px

      .cancel
        border: 1px solid #e8e8e8
        border-radius: 18px
        display: inline-block
        float: right
        line-height: 35px
        margin-right: 17px
        padding: 0 37px
</style>
