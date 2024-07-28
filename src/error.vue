<template lang="pug">
NuxtLayout
  h1 {{ data?.message || 'Не найдено' }}
</template>

<script setup>
  const props = defineProps(['error'])
  let data = {}
  try {
    data = props.error.data ? JSON.parse(props.error.data) : null
  } catch(e) {console.error(e)}
</script>
