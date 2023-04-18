<template>
  <div>
    <div class="map-balloon-title">
      {{ data.SLPU }}
    </div>
    <div class="map-balloon-adress">{{ data.SADDRESS }}</div>
    <button id="btn" type="button" class="btn-secondary mt-3">Выбрать</button>
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

<style scoped>
.map-balloon-title {
  font-feature-settings: "pnum" on, "lnum" on;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  color: #292929;
  margin-bottom: 1.5rem;
}
.map-balloon-adress {
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1;
  color: #292929;
}
</style>
<style>
ymaps[class*="-balloon_layout_normal "] {
  background: #fff;
  border: 1px solid #dfe3e5;
  box-sizing: border-box;
  border-radius: 30px;
  overflow: hidden;
  width: 360px;
  box-sizing: border-box !important;
  padding: 10px;
}

.ymaps-2-1-79-balloon__close-button {
  display: block;
  width: 20px;
  height: 30px;
  cursor: pointer;
  background: transparent;
  opacity: 1;
}

ymaps[class*="balloon__close-button"]:after,
ymaps[class*="balloon__close-button"]:before {
  position: absolute;
  width: 15px;
  height: 2px;
  content: "";
  top: 5px;
  left: 0;
  background: #292929;
  transform: rotate(45deg);
}
ymaps[class*="balloon__close-button"]:after {
  transform: rotate(-45deg);
}
ymaps[class*="balloon__close-button"] {
  position: absolute;
  width: 17px;
  height: 15px;
  right: 5px;
  display: block;
  border: 0;
  background: 0 0;
  top: 0px;
  padding: 0;
  cursor: pointer;
  opacity: 1;
}
</style>
