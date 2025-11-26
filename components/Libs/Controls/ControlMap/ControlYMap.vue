<template>
  <div>
    <div
      class="info-block"
      v-if="showInfoPanel"
    >
      <button
        class="close"
        @click="handleInfoClose"
      ></button>
      <BaloonMap
        :data="activeCard"
        :hasChooseButton="hasChooseButton"
        :filter-icons="filterIcons"
        :item-id="itemId"
        @select="handleSelect"
      />
    </div>

    <yandex-map
      ref="ymap"
      :key="key"
      class="ymap"
      :zoom="coords.zoom"
      :coords="coords.center"
      :controls="[]"
      :use-object-manager="false"
      :options="mapOptions"
      @map-was-initialized="mapInit"
    >
      <ymap-marker
        v-for="item in markers"
        :ref="item.ID"
        :key="item.ID"
        :marker-id="item.ID"
        :coords="item.COORDS"
        @click="handleClick"
        :icon="markerIcon({ item })"
        :options="markerOptions"
        :properties="{ markerId: item.ID }"
      >
      </ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import { isEqual } from "lodash";
import BaloonMap from "./BaloonMap";

export default {
  name: "ControlYMap",
  components: { BaloonMap },
  data: () => ({
    mapOptions: {
      yandexMapDisablePoiInteractivity: true,
    },
    width: 880,
    height: 500,
    key: 0,
    selectMarkerId: null,
    // TODO: find component center
    center: [55.76, 37.64],
    coords: { zoom: 10, center: [55.76, 37.64] },
    mapInstance: null,
    initialMarkerId: null,
    activeMarker: null,
    showInfoPanel: false,
    activeCardId: null,
  }),
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    itemId: {
      type: Number,
      default: undefined,
    },
    mainFilteredItems: {
      type: Array || undefined,
      default: undefined,
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
    },
    filterIcons: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    // TODO: вынести
    isDataExist() {
      return this.data && Object.keys(this.data).length > 0;
    },

    // TODO: вынести

    dataContent() {
      return this.isDataExist ? this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic) : {};
    },

    // TODO: вынести
    dataContentFiltered() {
      if (this.itemId) {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        return block?.data?.items || [];
      }
      return [];
    },

    getAllCoordinate() {
      return this.markers.map((el) => el.COORDS);
    },

    markerOptions() {
      return {
        hideIconOnBalloonOpen: false,
        balloonOffset: [0, -20],
      };
    },

    markers() {
      let data;
      if (this.mainFilteredItems) {
        data = this.mainFilteredItems;
      } else if (this.dataContentFiltered.length) {
        data = this.dataContentFiltered;
      } else {
        data = this.dataContent.data?.items || [];
      }
      const groupedByCoords = data.reduce((acc, item) => {
        if (item.ID !== 0 && "NLAT" in item && "NLON" in item) {
          const coordKey = `${item.NLAT},${item.NLON}`;
          if (!acc[coordKey]) {
            acc[coordKey] = {
              coords: [item.NLAT, item.NLON],
              items: [],
            };
          }
          acc[coordKey].items.push(item);
        }
        return acc;
      }, {});

      return Object.values(groupedByCoords).flatMap((group) => {
        return group.items.map((item) => ({
          ...item,
          COORDS: group.coords,
          sameCoordsItems: group.items,
        }));
      });
    },

    activeCard() {
      return this.markers.find((marker) => marker.ID === this.activeCardId);
    },
  },

  watch: {
    getAllCoordinate(oldVal, newVal) {
      if (!isEqual(oldVal, newVal)) {
        this.coords = this.getCoords();
        this.showInfoPanel = false;
        this.key += 1;
      }
    },

    coords() {
      this.showInfoPanel = false;
      this.key += 1;
    },

    markers(newVal, oldVal) {
      if (newVal.length !== oldVal) {
        this.initialMarkerId = null;
      }
    },
  },

  created() {
    this.initialMarkerId = this.$store.getters["data_card/getActivePointInMap"]?.ID;
  },

  beforeDestroy() {
    // TODO: reWork heart button after yandex-map update
    this.$store.commit("data_card/setActivePointInMap", null);
  },

  methods: {
    setActiveMarker(marker, active) {
      const iconOptions = this.markerIcon({ active });
      marker.options.set("iconImageSize", iconOptions.imageSize);
      marker.options.set("iconImageOffset", iconOptions.imageOffset);
      marker.options.set("balloonOffset", iconOptions.balloonOffset);
    },

    mapInit(mapInstance) {
      this.mapInstance = mapInstance;
      if (this.initialMarkerId) {
        this.showInfoPanel = true;
        this.activeCardId = this.initialMarkerId;
      } else if (this.key === 0) {
        this.coords = this.getCoords();
      }
    },

    getCoords() {
      if (this.getAllCoordinate.length) {
        const bounds = ymaps.util.bounds.fromPoints(this.getAllCoordinate);
        const centerAndZoom = ymaps.util.bounds.getCenterAndZoom(bounds, [this.width, this.height]);
        return centerAndZoom.zoom > 15 ? { ...centerAndZoom, zoom: 15 } : centerAndZoom;
      }
      return { center: this.center, zoom: 10 };
    },

    markerIcon({ number = 1, icon = undefined, active, item }) {
      if (item) {
        number = item.sameCoordsItems.length;
        icon = item.SBALOONCOLOR;
        active = this.isInitialMarker(item.ID);
      }

      return {
        layout: "default#imageWithContent",
        imageSize: active ? [38, 50] : [24, 32],
        imageOffset: active ? [-19, -50] : [-12, -32],
        balloonOffset: active ? [-19, -50] : [-12, -48],
        imageHref:
          number === 1
            ? icon
            : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="15" fill="green"/>
            <text x="15" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${number}</text>
          </svg>`
              )}`,
      };
    },

    handleClick(event) {
      if (this.activeMarker) {
        this.setActiveMarker(this.activeMarker, false);
      }
      const marker = event.get("target");
      this.activeCardId = marker.properties.get("markerId");
      this.showInfoPanel = true;
      this.activeMarker = marker;
      this.setActiveMarker(marker, true);
    },

    handleInfoClose() {
      this.showInfoPanel = false;
      if (this.activeMarker) {
        this.setActiveMarker(this.activeMarker, false);
        this.activeMarker = null;
      }
      if (this.initialMarkerId) {
        this.initialMarkerId = null;
      }
    },

    handleSelect(id) {
      this.$emit("select", id);
    },

    isInitialMarker(id) {
      return this.initialMarkerId === id;
    },
  },
};
</script>

<style scoped>
.info-block {
  position: absolute;
  width: 60%;
  max-height: calc(100% - 24px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  right: 12px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  overflow-y: auto;
}

.ymap {
  height: 100%;
  width: 100%;
  min-height: 450px;
}

.info-block::v-deep .map-balloon-title {
  padding-right: 30px;
}

.close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNDEwNCA1LjQ5MDE5QzYuMTU2NTYgNS4yMzYzNCA1Ljc0NSA1LjIzNjM0IDUuNDkxMTYgNS40OTAxOUM1LjIzNzMyIDUuNzQ0MDMgNS4yMzczMiA2LjE1NTU4IDUuNDkxMTYgNi40MDk0MkwxMS4wODE4IDEyTDUuNTkxNjIgMTcuNDkwMkM1LjMzNzc4IDE3Ljc0NCA1LjMzNzc4IDE4LjE1NTYgNS41OTE2MyAxOC40MDk0QzUuODQ1NDcgMTguNjYzMyA2LjI1NzAyIDE4LjY2MzMgNi41MTA4NiAxOC40MDk0TDEyLjAwMSAxMi45MTkzTDE3LjQ5MTIgMTguNDA5NEMxNy43NDUgMTguNjYzMyAxOC4xNTY2IDE4LjY2MzMgMTguNDEwNCAxOC40MDk0QzE4LjY2NDIgMTguMTU1NiAxOC42NjQyIDE3Ljc0NCAxOC40MTA0IDE3LjQ5MDJMMTIuOTIwMyAxMkwxOC41MTA5IDYuNDA5NDJDMTguNzY0NyA2LjE1NTU4IDE4Ljc2NDcgNS43NDQwMyAxOC41MTA5IDUuNDkwMTlDMTguMjU3IDUuMjM2MzQgMTcuODQ1NSA1LjIzNjM0IDE3LjU5MTYgNS40OTAxOUwxMi4wMDEgMTEuMDgwOEw2LjQxMDQgNS40OTAxOVoiIGZpbGw9IiMyOTI5MjkiLz4KPC9zdmc+Cg==)
    50% 50% no-repeat;
  border: 0;
  z-index: 1;
}

.info-block::v-deep .agent-blocks:after {
  display: none;
}

.info-block::v-deep .btn-secondary.my-4.btn-balloon {
  margin-bottom: 0 !important;
}

@media (max-width: 992px) {
  .info-block {
    width: calc(100% - 32px);
    right: auto;
    left: 16px;
    bottom: 16px;
    max-height: 60%;
    transform: none;
    top: auto;
    padding: 0;
    border: 16px solid #fff;
    height: fit-content;
  }

  .info-block::v-deep .agent-blocks {
    padding: 0;
  }

  .close {
    top: 0;
    right: 0px;
  }
}
</style>
