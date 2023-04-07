<template>
  <yandex-map
    style="height: 500px; width: 100%"
    :zoom="10"
    :coords="[55.76, 37.64]"
    :controls="[]"
    :use-object-manager="false"
    @map-was-initialized="handleMapInit"
    @markers-was-change="changeMarkers"
    :options="mapOptions"
  >
    <ymap-marker
      v-for="item in markers"
      :key="item.ID"
      :marker-id="item.ID"
      :coords="item.COORDS"
      @balloonopen="baloonOpen($event)"
      @balloonclose="baloonClose($event)"
      :icon="markerIcon"
      :options="markerOptions"
    >
      <baloon-map
        :data="item"
        :selected="markerSelected"
        slot="balloon"
      ></baloon-map>
    </ymap-marker>
  </yandex-map>
</template>

<script>
import BaloonMap from "./BaloonMap.vue";

export default {
  name: "ControlMap",
  components: { BaloonMap },
  data: () => ({
    markerType: "Polygon",
    selectMarkerId: null,
  }),
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },

    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  computed: {
    markerIcon() {
      return {
        layout: "default#imageWithContent",
        imageSize: [43, 43],
        imageOffset: [-22, 0],
        contentOffset: [-22, -43],
        imageHref:
          "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
      };
    },
    mapOptions() {
      return {
        yandexMapDisablePoiInteractivity: true,
      };
    },
    markerOptions() {
      return {
        hideIconOnBalloonOpen: false,
      };
    },
    markerFilters() {
      return this.$store.getters["data_card/getFilters"];
    },
    markerSelected() {
      return { id: this.isIdActiveMarker };
    },
    dataContent() {
      return this.$store.getters["blocks/getUnfilteredBlockById"](
        this.data.menudic
      );
    },
    markers() {
      if (this.dataContent?.data.items) {
        return this.dataContent?.data.items
          .filter((item) => item.ID !== 0)
          .map((item) => ({
            ...item,
            COORDS: [item.NLAT, item.NLON],
          }));
      }
      return [];
    },
  },
  watch: {
    async markerFilters() {
      await this.$store.dispatch("blocks/fetchBlock", {
        id: this.data.menudic,
        query: this.$store.getters["data_card/getFilters"],
        ...this.$route.params,
      });
    },
  },
  methods: {
    handleMapInit(e) {
      console.log(e.geoObjects.getMap());
    },
    changeMarkers(e) {
      console.log("markers", e);
    },
    baloonOpen(e) {
      const marker = e.get("target");
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
      );
      const markerId = marker.properties.get("markerId");
      document.getElementById("btn").addEventListener("click", this.handler);
      document.getElementById("btn").markerId = markerId;
      if (this.selectMarkerId === markerId) {
        document.querySelector("#btn").textContent = "Выбрано";
      }
    },
    baloonClose(e) {
      const marker = e.get("target");
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
      );
      document.getElementById("btn").removeEventListener("click", this.handler);
    },
    handler(e) {
      document.querySelector("#btn").textContent = "Выбрано";
      this.selectMarkerId = e.target.markerId;
    },
  },
};
</script>

<style></style>
