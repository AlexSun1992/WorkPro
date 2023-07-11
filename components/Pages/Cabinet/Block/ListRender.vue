<template>
  <div>
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
        v-for="item in dataContent"
        :key="item.IDMED_EXECUTOR + Math.random()"
        :marker-id="item.IDMED_EXECUTOR"
        :coords="[item.NLAT, item.NLONG]"
        :icon="markerIcon"
        :options="markerOptions"
      >
      </ymap-marker>
    </yandex-map>
  </div>
</template>
<script>
import ListRenderBaloon from "./ListRenderBaloon.vue";

export default {
  name: "ListRender",
  components: { ListRenderBaloon },
  props: {
    itemId: {
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      markerType: "Polygon",
    };
  },
  computed: {
    balloonTemplate() {
      return `<p>!!</p>`;
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
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data.items;
        }
        return {};
      },
    },
  },
  methods: {
    async handleMapInit(e) {
      console.log("ymapsinit", e);
    },
    changeMarkers(e) {
      console.log("markers", e);
    },
  },
};
</script>
