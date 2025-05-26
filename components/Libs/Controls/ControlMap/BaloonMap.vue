<template>
  <div class="map-balloon">
    <div class="map-balloon-title">
      {{ data.SLPU }}
    </div>
    <div class="map-balloon-adress">{{ data.SADDRESS }}</div>
    <button
      id="btn"
      type="button"
      class="btn-secondary mt-4"
    >
      Выбрать
    </button>
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
