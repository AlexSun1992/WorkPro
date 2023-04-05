<template>
  <yandex-map
    style="height: 500px; width: 100%"
    :coords="coords"
    :controls="['fullscreenControl']"
    :use-object-manager="false"
    @map-was-initialized="handleMapInit"
    @markers-was-change="changeMarkers"
    :options="mapOptions"
  >
    <ymap-marker
      :marker-id="1"
      :coords="coords"
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
    coords: [55.737938, 37.244098],
    markerType: "Polygon",
  }),
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
        imageOffset: [0, 0],
        contentOffset: [0, 0],
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
