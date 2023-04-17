<template>
  <div>
    <div>
      <b>{{ data.SLPU }}</b>
    </div>
    <div>{{ data.SADDRESS }}</div>
    <b-button id="btn">Выбрать</b-button>
  </div>
</template>

<script>
export default {
  name: "BaloonMap",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style scoped></style>
