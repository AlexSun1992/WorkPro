<template>
  <yandex-map
    style="height: 500px; width: 100%"
    :zoom="10"
    :coords="coordinates"
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
    dataContent: null,
    coordinates: [],
  }),
  props: {
    data: {
      type: Object,
      required: true,
    },

    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    markerIcon() {
      return {
        layout: "default#imageWithContent",
        imageSize: [43, 43],
        imageOffset: [-22, 0],
        contentOffset: [-22, -43],
        imageHref: "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
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
    selectedCity() {
      const allForms = this.$store.getters["data_card/getForm"];
      const field = allForms?.find((item) => item.dic === "IDTOWN");
      return field?.value?.value?.SNAME || "";
    },
    markerSelected() {
      return { id: this.isIdActiveMarker };
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
  async created() {
    await this.$store.dispatch("blocks/fetchBlock", {
      id: this.data.menudic,
      query: this.$store.getters["data_card/getSelectedValues"],
      ...this.$route.params,
    });
    this.dataContent = this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic);
  },
  methods: {
    async handleMapInit(e) {
      console.log("ymapsinit", e);
      this.getCoordinates();
    },
    async getCoordinates() {
      const basicCoords = [55.76, 37.64];
      if (this.selectedCity) {
        try {
          const geoObject = await ymaps.geocode(this.selectedCity);
          const coordinates =
            // eslint-disable-next-line no-underscore-dangle
            geoObject.geoObjects?.get(0)?.geometry?._coordinates;
          this.coordinates = coordinates?.length ? coordinates : basicCoords;
        } catch (e) {
          console.log("error on get coordinates", e);
        }
      }
      if (!this.coordinates.length) {
        this.coordinates = basicCoords;
      }
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
      if (!markerId) return;
      document.getElementById("btn")?.addEventListener("click", this.handler);
      document.getElementById("btn").markerId = markerId;
      if (this.selectMarkerId === markerId) {
        document.querySelector("#btn").classList.remove("btn-secondary");
        document.querySelector("#btn").classList.add("btn-primary");
        document.querySelector("#btn").textContent = "Выбрано";
      }
    },
    baloonClose(e) {
      const marker = e.get("target");
      marker.options.set("iconImageHref", "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg");
      document.getElementById("btn").removeEventListener("click", this.handler);
    },
    handler(e) {
      document.querySelector("#btn").classList.remove("btn-secondary");
      document.querySelector("#btn").classList.add("btn-primary");
      document.querySelector("#btn").textContent = "Выбрано";
      this.selectMarkerId = e.target.markerId;
      const marker = this.markers.find((item) => item.ID === this.selectMarkerId);
      const valuePrepare = Object.keys(marker)
        .filter((key) => Number.isInteger(marker[key]))
        .reduce((acc, key) => {
          acc[key] = marker[key];
          return acc;
        }, {});
      this.$store.commit("data_card/setFilters", valuePrepare);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: { ...marker },
          text: marker.ID,
        },
      });
    },
  },
};
</script>
