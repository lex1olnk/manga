<template lang="pug">
div(v-for="teammate in team.teammates" :key="teammate.id") {{ teammate.name }}
</template>

<script setup>
  const props = defineProps(['team'])
</script>
