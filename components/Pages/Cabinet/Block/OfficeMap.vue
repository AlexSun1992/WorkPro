<template>
  <div>
    <yandex-map
      style="height: 500px; width: 100%"
      :zoom="10"
      :coords="getCoordinates"
      :controls="[]"
      :use-object-manager="false"
      :options="mapOptions"
    >
      <ymap-marker
        v-for="item in dataContent"
        :key="item[markerIdName]"
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
import Cookies from "js-cookie";

export default {
  name: "OfficeMap",

  props: {
    itemId: {
      type: String,
      default: "",
    },
    longitudeName: {
      type: String,
      default: "NLONG",
    },
    latitudeName: {
      type: String,
      default: "NLAT",
    },
    markerIdName: {
      type: String,
      default: "ID",
    },
  },
  data() {
    return {
      mapOptions: { yandexMapDisablePoiInteractivity: true },
      markerOptions: { hideIconOnBalloonOpen: false },
      coordinates: [55.76, 37.64],
      map: null,
    };
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
    dataContent() {
      const block = this.$store.getters["blocks/getBlockById"](this.itemId);
      return block?.data?.items || [];
    },
    getCoordinates() {
      const lat = Cookies.get("lat") || 55.76;
      const lon = Cookies.get("lon") || 37.64;

      return [lat, lon];
    },
  },
};
</script>
