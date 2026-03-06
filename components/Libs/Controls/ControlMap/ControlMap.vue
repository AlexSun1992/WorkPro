<template>
  <client-only>
    <yandex-map
      :settings="{
        location: {
          center: coordinates,
          zoom: 9,
        },
      }"
      height="500px"
      isReadyToInit
    >
      <yandex-map-marker
        v-for="marker in markers"
        :key="marker.ID"
        :settings="{ ...marker, onClick: handleMarkerClick(marker) }"
        position="top left-center"
      >
        <img
          height="38"
          :src="getIcon(marker.active)"
        />
        <div
          class="popup"
          v-if="marker.active"
        >
          <div class="balloon-container">
            <button
              class="close"
              @click="handleBalloonClose"
            />
            <BaloonMap
              v-if="marker.active"
              :data="marker"
              :selected-id="selectedCardId"
              @select="handleSelect"
            />
          </div>
        </div>
      </yandex-map-marker>

      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
    </yandex-map>
  </client-only>
</template>

<script>
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  YandexMapDefaultSchemeLayer,
  VueYandexMaps,
} from "vue-yandex-maps";

import BaloonMap from "./BaloonMap.vue";

export default {
  name: "ControlMap",
  components: {
    YandexMapMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    BaloonMap,
    YandexMap,
  },
  data: () => ({
    markerType: "Polygon",
    activeMarkerId: null,
    selectedCardId: null,
    dataContent: null,
    coordinates: [37.64, 55.76],
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
    selectedCity() {
      const allForms = this.$store.getters["data_card/getForm"];
      const field = allForms?.find((item) => item.dic === "IDTOWN");
      return field?.value?.value?.SNAME || "";
    },
    markers() {
      if (this.dataContent?.data.items) {
        return this.dataContent?.data.items
          .filter((item) => item.ID !== 0)
          .map((item) => ({
            ...item,
            coordinates: [item.NLON, item.NLAT],
            active: item.ID === this.activeMarkerId,
          }));
      }
      return [];
    },
    isMapLoaded() {
      return VueYandexMaps.isLoaded.value;
    },
  },

  watch: {
    async isMapLoaded(isLoaded) {
      if (isLoaded) {
        await this.getCoordinates();
      }
    },
    selectedCity(newCity, _) {
      if (newCity) {
        this.getCoordinates();
      }
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
    handleMarkerClick(marker) {
      return (clickEvent) => {
        this.activeMarkerId = marker.ID;
      };
    },
    handleBalloonClose() {
      this.activeMarkerId = null;
    },
    getIcon(active) {
      return `https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent${active ? "_active" : ""}.svg`;
    },
    async getCoordinates() {
      const basicCoords = [37.64, 55.76];
      if (this.selectedCity) {
        try {
          const geoObject = await ymaps3.search({ text: this.selectedCity });
          const coordinates = geoObject?.[0]?.geometry?.coordinates;
          this.coordinates = coordinates?.length ? coordinates : basicCoords;
        } catch (e) {
          console.error("error on get coordinates", e);
        }
      }
      if (!this.coordinates.length) {
        this.coordinates = basicCoords;
      }
    },
    handleSelect(selectedId) {
      this.selectedCardId = selectedId;
      const marker = this.markers.find((item) => item.ID === selectedId);
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
