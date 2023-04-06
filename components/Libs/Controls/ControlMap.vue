<template>
  <yandex-map
    style="height: 500px; width: 100%"
    :zoom="10"
    :coords="[55.76, 37.64]"
    :controls="['fullscreenControl']"
    :use-object-manager="true"
    @map-was-initialized="handleMapInit"
    @markers-was-change="changeMarkers"
    :options="mapOptions"
  >
    <ymap-marker
      v-for="item in markers"
      :key="item.ID"
      :marker-id="item.ID"
      :coords="item.COORDS"
      :balloon-template="balloonTemplate"
      @balloonopen="baloonOpen($event)"
      @balloonclose="baloonClose($event)"
      :icon="markerIcon"
      :options="markerOptions"
    />
  </yandex-map>
</template>

<script>
export default {
  name: "ControlMap",
  data: () => ({
    markerType: "Polygon",
    isActiveMarkerId: null,
    coords: null,
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
    balloonTemplate() {
      return `
        <h1 class="red">Hi, everyone!</h1>
        <p>I am here: ${this.coords}</p>
      `;
    },
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
    markerContent() {
      if (this.isActiveMarkerId) {
        return this.markers.find((item) => item.ID === this.isActiveMarkerId);
      }
      return {};
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
      console.log(this.markers);
      const marker = e.get("target");
      console.log(marker.properties.get("markerId"));
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
      );
      // this.isActiveMarkerId = marker.properties.get("markerId");
    },
    baloonClose(e) {
      const marker = e.get("target");
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
      );
    },
  },
};
</script>

<style></style>
