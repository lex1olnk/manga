<template lang="pug">
Modal(@before-open="beforeOpen")
  section.modal.page-book--buy-modal
    .lock(v-if="locked")
      p Здесь должен быть какой-нибудь прелодер

    h1 Покупка тайтлов

    template(v-if="pay")
      p Здесь, видимо, будет форма оплаты
      .chapters-list
        label {{ payTypeName(pay.type) }}
        input(type="text" :value="listToString(pay.details.chapters)" readonly)
      .actions
        button(@click="payCancel") Отмена
        button(@click="paySuccess") Оплатить

    template(v-else)
      template(v-if="Object.keys(numbers).length")
        .type
          label Выбрать покупку
          select(v-model="type")
            option(value="chapters") {{ payTypeName('chapters') }}
        .chapters-list(v-if="type === 'chapters'")
          label Главы
          input(type="text" :value="listToString(Object.keys(numbers))" readonly)
        .total-cost
          label Стоимость покупки
          input(type="text" :value="totalCost" readonly)
      div(v-else) Нужно выбрать главы
      .actions
          button(@click="$emit('close')") Закрыть
          button(v-if="Object.keys(numbers).length" @click="buy") Принять
</template>

<script setup>
  const emit = defineEmits(['close', 'pay'])
  const locked = ref(false)
  const pay = ref(null)
  const props = defineProps(['book', 'chapters', 'numbers', 'type'])
  const type = ref(null)

  const totalCost = computed(() => {
    let cost = 0

    for (const chapter of props.chapters) {
      if (chapter.number in props.numbers) cost += parseInt(chapter.price)
    }

    return cost
  })

  function beforeOpen() {
    type.value = props.type
    pay.value = null
  }

  function buy() {
    locked.value = true

    useApi('/buy/chapters', {
      method: 'POST',
      body: {book_id: props.book.id, chapters: Object.keys(props.numbers)}
    })
      .then(response => {
        if ('pay' in response) pay.value = response.pay
      })
      .catch(console.error)
      .finally(() => locked.value = false)
  }

  function payCancel() {
    emit('close')
  }

  function paySuccess() {
    locked.value = true

    useApi('/pay/success', {method: 'POST', body: {pay: pay.value}})
      .then(response => {
        if ('pay' in response) emit('pay', response.pay)
      })
      .catch(console.error)
      .finally(() => locked.value = false)
  }
</script>

<style lang="sass">
.page-book--buy-modal
  position: relative
  width: 424px

  .lock
    background: rgba(0, 0, 0, .3)
    bottom: 0
    left: 0
    position: absolute
    right: 0
    top: 0

    p
      color: #fff

  .type
    margin-top: 22px

    select
      margin-top: 8px
      width: 100%

  .chapters-list
    margin-top: 9px

    input
      margin-top: 7px
      width: 100%

  .total-cost
    margin-top: 22px

    input
      margin-top: 8px
      width: 100%

  .actions
    margin-top: 20px
    text-align: center

    button
      background: #ff5a5a
      border: none
      border-radius: 15px
      color: #fff
      cursor: pointer
      line-height: 35px
      padding: 0 24px

      &:first-child
        margin-right: 14px
</style>
