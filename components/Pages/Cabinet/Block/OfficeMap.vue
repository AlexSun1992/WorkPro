<template>
  <client-only>
    <yandex-map
      height="500px"
      :settings="{
        location: {
          center: getCoordinates,
          zoom: 10,
        },
      }"
    >
      <yandex-map-marker
        v-for="(item, index) in markers"
        :key="`${index}-${item[markerIdName]}`"
        :settings="{
          ...item,
          onClick: handleMarkerClick(item),
          zIndex: item.active ? 1 : 0,
        }"
      >
        <img
          height="38"
          :src="getIcon()"
        />
        <div
          v-if="item.active"
          class="popup"
        >
          <div class="balloon-container">
            <button
              class="close"
              @click="handleBalloonClose"
            />
            <div class="map-balloon">
              <div class="map-balloon-title">
                {{ item.SLPU_NAME }}
              </div>
              <div class="map-balloon-adress">
                {{ getAddress(item.SFULLLPU_ADDRESS) }}
              </div>
              <div class="map-balloon-description mt-3">
                {{ item.SACCESS }}
              </div>
              <div
                v-for="itm in item.CPHONE"
                :key="itm.SPHONE"
                class="mt-2"
              >
                <a :href="`tel:${itm.SPHONE}`">{{ itm.SPHONE }}</a>
                {{ itm.SPHONETYPE }}<br />
              </div>
            </div>
          </div>
        </div>
      </yandex-map-marker>
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer />
    </yandex-map>
  </client-only>
</template>

<script>
import Cookies from "js-cookie";

import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
  YandexMapDefaultSchemeLayer,
} from "vue-yandex-maps";

export default {
  name: "OfficeMap",
  components: { YandexMapMarker, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMap },

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
    return { activeMarkerId: null };
  },
  computed: {
    dataContent() {
      const block = this.$store.getters["blocks/getBlockById"](this.itemId);
      return block?.data?.items || [];
    },
    markers() {
      if (this.dataContent?.length) {
        return this.dataContent
          .filter((item) => item.ID !== 0)
          .map((item) => ({
            ...item,
            coordinates: [item[this.longitudeName], item[this.latitudeName]],
            active: item[this.markerIdName] === this.activeMarkerId,
          }));
      }
      return [];
    },
    getCoordinates() {
      const lat = Cookies.get("lat") || 55.76;
      const lon = Cookies.get("lon") || 37.64;
      return [lon, lat];
    },
  },
  methods: {
    getAddress(addr) {
      return `Адрес: ${addr}`;
    },
    getIcon() {
      return `https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg`;
    },
    handleMarkerClick(marker) {
      return (clickEvent) => {
        this.activeMarkerId = marker[this.markerIdName];
      };
    },
    handleBalloonClose() {
      this.activeMarkerId = null;
    },
  },
};
</script>

<style scoped>
.close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNDEwNCA1LjQ5MDE5QzYuMTU2NTYgNS4yMzYzNCA1Ljc0NSA1LjIzNjM0IDUuNDkxMTYgNS40OTAxOUM1LjIzNzMyIDUuNzQ0MDMgNS4yMzczMiA2LjE1NTU4IDUuNDkxMTYgNi40MDk0MkwxMS4wODE4IDEyTDUuNTkxNjIgMTcuNDkwMkM1LjMzNzc4IDE3Ljc0NCA1LjMzNzc4IDE4LjE1NTYgNS41OTE2MyAxOC40MDk0QzUuODQ1NDcgMTguNjYzMyA2LjI1NzAyIDE4LjY2MzMgNi41MTA4NiAxOC40MDk0TDEyLjAwMSAxMi45MTkzTDE3LjQ5MTIgMTguNDA5NEMxNy43NDUgMTguNjYzMyAxOC4xNTY2IDE4LjY2MzMgMTguNDEwNCAxOC40MDk0QzE4LjY2NDIgMTguMTU1NiAxOC42NjQyIDE3Ljc0NCAxOC40MTA0IDE3LjQ5MDJMMTIuOTIwMyAxMkwxOC41MTA5IDYuNDA5NDJDMTguNzY0NyA2LjE1NTU4IDE4Ljc2NDcgNS43NDQwMyAxOC41MTA5IDUuNDkwMTlDMTguMjU3IDUuMjM2MzQgMTcuODQ1NSA1LjIzNjM0IDE3LjU5MTYgNS40OTAxOUwxMi4wMDEgMTEuMDgwOEw2LjQxMDQgNS40OTAxOVoiIGZpbGw9IiMyOTI5MjkiLz4KPC9zdmc+Cg==)
    50% 50% no-repeat;
  border: 0;
  z-index: 1;
}

.balloon-container {
  width: 450px;
  height: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
  position: absolute;
  bottom: 48px;
  left: -38px;
}
</style>
