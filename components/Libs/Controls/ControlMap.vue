<template>
  <div id="map" class="test"></div>
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
        center: [55.76, 37.64],
        zoom: 12,
      });

      this.myPlacemark = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: [55.76, 37.64], // координаты точки
        },
      });

      this.myMap.geoObjects.add(this.myPlacemark);
    },
  },
};
</script>

<style lang="less" scoped>
.test {
  width: 300px;
  height: 300px;
  box-shadow: 0 0 1px 1px black;
}
</style>
