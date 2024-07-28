<template lang="pug">
.page-tabs-light(ref="pageTabs")
  slot
</template>

<script setup>
  import {onMounted, ref} from 'vue'

  const pageTabs = ref(null)

  onMounted(() => {
    const blocks = pageTabs.value.querySelectorAll('.tabs-block')
    const tabs = pageTabs.value.querySelectorAll('.tabs li')

    for (const nextTab of tabs) {
      nextTab.addEventListener('click', event => {
        const selectedTab = event.target
        if (selectedTab.classList.contains('active')) return

        for (const tab of tabs) tab.classList.remove('active')
        for (const block of blocks) block.classList.remove('active')

        selectedTab.classList.add('active')

        const block = selectedTab.dataset.block
        pageTabs.value.querySelector(`.tabs-block.${block}`).classList.add('active')
      })
    }
  })
</script>

<style lang="sass">
.page-tabs-light
  .tabs
    list-style-type: none
    margin: 0
    padding: 0
    white-space: nowrap

    & > li
      border-bottom: 3px solid #f2f2f2
      cursor: pointer
      display: inline-block
      font-size: 14px
      line-height: 34px
      margin: 0 0 0 20px
      padding: 0 16px

      &:first-child
        margin-left: 0

      &:hover
        border-color: #ff5a5a

      &.active
        border-color: #ff5a5a

  .tabs-block
    background: #fff
    display: none
    margin-top: 6px

    &.active
      display: block
</style>
