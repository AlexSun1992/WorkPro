<template>
  <div id="map" class="test"></div>
</template>

<script>
import LoadScript from "vue-plugin-load-script";
import Vue from "vue";
Vue.use(LoadScript);
export default {
  name: "ControlCurrentOfficeMap",
  components: {
    LoadScript,
    Vue,
  },
  data() {
    return {
      myMap: null,
    };
  },
  async created() {
    await this.$loadScript(
      `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
    ).then(() => ymaps.ready(this.init));
  },
  methods: {
    async init() {
      this.myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 12,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.test {
  width: 300px;
  height: 200px;
  box-shadow: 0 0 1px 1px black;
}
</style>
