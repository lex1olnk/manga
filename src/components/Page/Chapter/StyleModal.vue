<template lang="pug">
Modal(:click-to-close="true" content-class="page-top-wrapper vfm-style-modal-content")
  section.modal.page-chapter--style-modal
    h1 Стилизация страницы
    .color-schemes
      label Цветовая схема
      div
        div(v-for="scheme in 5" @click="selectColorScheme(scheme)" :key="scheme" :class="model.colorScheme === scheme ? 'selected' : ''")

    .font-size.range-field
      label Размер шрифта: current
      RangeSlider(v-model="model.fontSize" :max="20" :min="10")

    .line-height.range-field
      label Высота строк: current
      RangeSlider(v-model="model.lineHeight" :max="300" :min="100")

    .container-width.range-field
      label Ширина контейнера: current
      RangeSlider(v-model="model.containerWidth" :max="100" :min="25")

    .paragraph-margin.range-field
      label Отступ между абзацами: current
      RangeSlider(v-model="model.paragraphMargin" :max="50" :min="0")

    .downloads
      label Скачать:
      div(v-for="link in 4" :key="link")
        a .txt файл
</template>

<script setup>
  const model = defineModel({required: true})

  function selectColorScheme(scheme) {
    model.value.colorScheme = scheme
  }
</script>

<style lang="sass">
.vfm
  .vfm-style-modal-content
    justify-content: right
    padding-top: 64px

    .page-chapter--style-modal
      border-radius: 0
      padding: 17px 24px 50px
      width: 479px

      h1
        font-size: 23px

      label
        font-size: 19px

      .range-field
        padding-right: 32px

        .range-slider
          margin-top: 6px

      .color-schemes
        margin-top: 12px

        & > div
          display: flex
          justify-content: space-between
          margin-top: 12px

          div
            background: #e8e8e8
            cursor: pointer
            height: 60px
            width: 60px

            &.selected
              background: #454545

      .font-size
        margin-top: 19px

      .line-height
        margin-top: 20px

      .container-width
        margin-top: 20px

      .paragraph-margin
        margin-top: 18px

      .downloads
        margin-top: 12px

        div
          margin-top: 6px

        a
          font-size: 19px
</style>
