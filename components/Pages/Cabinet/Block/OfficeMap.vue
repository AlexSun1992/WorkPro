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
        :key="Math.random()"
        :marker-id="item[markerIdName]"
        :coords="[item[latitudeName], item[longitudeName]]"
        :icon="markerIcon"
        :options="markerOptions"
      >
        <slot slot="balloon" :content="item" :list="dataContent" />
      </ymap-marker>
    </yandex-map>
  </div>
</template>
<script>
export default {
  name: "OfficeMap",

  props: {
    itemId: {
      required: false,
      default: () => null,
    },

    longitudeName: {
      required: false,
      default: () => "NLONG",
    },
    latitudeName: {
      required: false,
      default: () => "NLAT",
    },
    markerIdName: {
      required: false,
      default: () => "ID",
    },
  },
  data() {
    return {};
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
