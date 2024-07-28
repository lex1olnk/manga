<template lang="pug">
NuxtLayout
  NuxtPage
</template>

<script setup>
  const context = useState('context')
  const event = useRequestEvent()

  useAsyncData(async () => {
    context.value = await event.context.context.getExportData()
  })
</script>
