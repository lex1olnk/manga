<template lang="pug">
.page-tabs(ref="pageTabs")
  slot
</template>

<script setup>
  import {onMounted, ref} from 'vue'

  const pageTabs = ref(null)

  onMounted(() => {
    const blocks = pageTabs.value.querySelectorAll(':scope > .tabs-block')
    const tabs = pageTabs.value.querySelectorAll(':scope > .tabs li')

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
.page-tabs
  & > .tabs
    list-style-type: none
    margin: 0
    padding: 0
    white-space: nowrap

    & > li
      background: #fff
      cursor: pointer
      display: inline-block
      font-size: 14px
      line-height: 34px
      margin: 0
      padding: 0 16px

      &:hover
        background: #ff5a5a
        color: #fff

      &.active
        background: #ff5a5a
        color: #fff

  & > .tabs-block
    background: #fff
    display: none
    margin-top: 6px

    &.active
      display: block
</style>
