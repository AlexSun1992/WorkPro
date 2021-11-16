<template>
  <div id="map" class="max-size"></div>
</template>

<script>
export default {
  name: "ControlMap",
  data() {
    return {
      myPlacemark: null,
      myMap: null,
      url: "https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU",
    };
  },

  props: {
    Lattitude: {
      type: Number,
      required: false,
      default: () => null,
    },
    Longetude: {
      type: Number,
      required: false,
      default: () => null,
    },
  },

  async created() {
    if (process.client) {
      await this.$loadScript(
        `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
      ).then(() => ymaps.ready(this.init));
    }
  },

  methods: {
    init() {
      this.myMap = new ymaps.Map("map", {
        center: [this.Lattitude, this.Longetude],
        zoom: 12,
        controls: [],
      });

      this.myPlacemark = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: [this.Lattitude, this.Longetude], // координаты точки
        },
      });

      this.myMap.geoObjects.add(this.myPlacemark);
    },
  },
};
</script>

<style lang="less" scoped>
.max-size {
  width: 100%;
  height: 100px;
  box-shadow: 0 0 1px 1px black;
}
</style>
