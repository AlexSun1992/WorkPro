<template>
  <client-only>
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
          v-for="card in activeCard.sameCoordsItems"
          :key="card.ID"
          :data="card"
          :hasChooseButton="hasChooseButton"
          :filter-icons="filterIcons"
          :item-id="itemId"
          @select="handleSelect"
        />
      </div>
      <yandex-map
        class="ymap"
        v-model="map"
        :settings="{
          location,
        }"
      >
        <yandex-map-marker
          v-for="marker in markers"
          :key="marker.ID"
          :settings="{ ...marker, onClick: handleMarkerClick(marker.ID) }"
          position="top left-center"
        >
          <img
            :height="getHeight(marker.active)"
            :src="markerIcon(marker)"
          />
        </yandex-map-marker>
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
      </yandex-map>
    </div>
  </client-only>
</template>

<script>
import { getCurrentInstance, shallowRef, watch, onBeforeUnmount } from "vue";
import {
  getBoundsFromCoords,
  getLocationFromBounds,
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from "vue-yandex-maps";
import isEqual from "lodash.isequal";
import { pixelsToWorld } from "@yandex/ymaps3-world-utils";
import BaloonMap from "./BaloonMap";

// TODO: get from css variables
const INFO_BLOCK_MARGIN = 12; // margin: 12px
const INFO_BLOCK_WIDTH = 0.6; // width: 60%

const MARKER_HEIGHT_DEFAULT = 32;
const MARKER_HEIGHT_ACTIVE = 50;
const MAP_TRANSITION_ZOOM = 14;

const MAP_TRANSITION_SETTINGS = {
  duration: 300,
  easing: "ease-in-out",
  zoom: MAP_TRANSITION_ZOOM,
};

export default {
  name: "ControlYMap",
  components: { YandexMapDefaultFeaturesLayer, YandexMapDefaultSchemeLayer, YandexMap, YandexMapMarker, BaloonMap },
  data: () => ({
    mapOptions: {
      yandexMapDisablePoiInteractivity: true,
    },
    width: 880,
    height: 500,
    selectMarkerId: null,
    // TODO: find component center
    center: [37.64, 55.76],
    location: { zoom: 10, center: [37.64, 55.76] },
    mapInstance: null,
    activeMarkerId: null,
    showInfoPanel: false,
    activeCard: null,
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

  setup() {
    const map = shallowRef(null);

    const instance = getCurrentInstance();

    onBeforeUnmount(() => {
      instance.proxy.$store.commit("data_card/setActivePointInMap", null);
    });

    /*
      We assume that info-block element is always present on the map, if there is any marker reactivity
      info-block element blocks part of the map
      the function is needed to calculate the horizontal offset from the center in LatLong format
       */
    const getInfoBlockOffset = () => {
      if (!map.value) return [0, 0];

      const { projection } = map.value;
      if (!window.matchMedia("(max-width: 998px)").matches) {
        const width = map.value?.container.clientWidth;

        // info-block is 60% width with a 12px margin, so we need the center of the remaning area
        const markerCenter = (width * (1 - INFO_BLOCK_WIDTH) + INFO_BLOCK_MARGIN) / 2;

        // calculating the horizontal offset from the center
        const markerPixelOffset = 0.5 * width - markerCenter;

        // for each zoom number, a pixel corresponds to a different number of degrees
        // WorldCoordinates - Normalized coordinates in the range [-1, 1] where (0, 0) is the center of the map
        // from https://classic.yarnpkg.com/en/package/@yandex/ymaps3-world-utils
        // we also need only the X coordinate - horizontal offset
        const offsetWorldCoords = pixelsToWorld({ x: markerPixelOffset, y: 0 }, MAP_TRANSITION_ZOOM);

        // X,Y (width, height) are calculated from the top-left corner which has World coordinates set to (-1, 1)
        return projection.fromWorldCoordinates({ x: offsetWorldCoords.x + 1, y: 0 });

        // eslint-disable-next-line
      } else {
        // same idea but with height
        const height = map.value?.container.clientHeight;

        // as mobile info-block height can vary we aim for 1/3 of the map height
        const markerCenter = height * 0.33 + INFO_BLOCK_MARGIN;

        // calculating the vertical offset from the center
        const markerPixelOffset = 0.5 * height - markerCenter;

        const offsetWorldCoords = pixelsToWorld({ x: 0, y: markerPixelOffset }, MAP_TRANSITION_ZOOM);

        // same idea but with Y
        // in projection coords Y is inverted
        return projection.fromWorldCoordinates({ x: 0, y: offsetWorldCoords.y - 1 });
      }
    };

    const getMarkerLocation = async () => {
      const allCoords = instance.proxy.getAllCoordinates;
      if (allCoords.length === 1) {
        return {
          center: allCoords[0],
          zoom: MAP_TRANSITION_ZOOM,
        };
      }

      return await getLocationFromBounds({
        bounds: getBoundsFromCoords(allCoords),
        map: map.value,
      });
    };

    const setMarkerLocation = async () => {
      const location = await getMarkerLocation();
      const newLocation = instance.proxy.normalizeLocation(location);
      // FIXME: remove when migrating to composition API, this is logic duplication
      instance.proxy.location = newLocation;
      map.value.setLocation(newLocation);
    };

    watch(
      () => map.value,
      (newMap, _) => {
        if (newMap) instance.proxy.onMapInit();
      }
    );

    return { map, getInfoBlockOffset, getMarkerLocation, setMarkerLocation };
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

    getAllCoordinates() {
      return this.markers.map((el) => el.coordinates);
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
              coords: [item.NLON, item.NLAT],
              items: [],
            };
          }
          acc[coordKey].items.push(item);
        }
        return acc;
      }, {});

      return Object.values(groupedByCoords).flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          coordinates: [...group.coords],
          sameCoordsItems: group.items,
          active: this.activeMarkerId === item.ID,
        }))
      );
    },

    initialMarkerId() {
      return this.$store.getters["data_card/getActivePointInMap"];
    },
  },

  watch: {
    async getAllCoordinates(newVal, oldVal) {
      if (!isEqual(oldVal, newVal)) {
        this.activeMarkerId = null;
        this.showInfoPanel = false;
        await this.setMarkerLocation();
        // FIXME: get rid of Math.floor after reporting the bug to @vue-yandex-maps team
      }
    },
  },

  methods: {
    async onMapInit() {
      if (this.initialMarkerId) {
        this.setActiveMarker(this.initialMarkerId);
      }
      const location = await this.getMarkerLocation();
      this.location = { ...location, zoom: location.zoom - 0.5 };
    },
    getHeight(active) {
      return active ? MARKER_HEIGHT_ACTIVE : MARKER_HEIGHT_DEFAULT;
    },

    normalizeLocation(location) {
      return { ...MAP_TRANSITION_SETTINGS, ...location, zoom: Math.floor(location.zoom) - 0.5 };
    },

    getActiveCard(id) {
      return this.markers.find((marker) => marker.ID === id);
    },

    setActiveMarker(markerId) {
      this.showInfoPanel = true;
      this.activeMarkerId = markerId;
      this.activeCard = this.getActiveCard(markerId);

      const marker = this.activeCard;

      const offset = this.getInfoBlockOffset();

      const markerPosition = [
        Number.parseFloat(marker.coordinates[0]) + offset[0],
        Number.parseFloat(marker.coordinates[1]) + offset[1],
      ];

      this.location = {
        ...MAP_TRANSITION_SETTINGS,
        center: markerPosition,
      };
    },

    handleMarkerClick(markerId) {
      return (clickEvent) => {
        this.setActiveMarker(markerId);
      };
    },

    handleInfoClose() {
      this.showInfoPanel = false;
      this.activeMarkerId = null;
    },

    handleSelect(id) {
      this.$emit("select", id);
    },

    getNumberedIcon(number) {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="15" fill="green"/>
            <text x="15" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${number}</text>
          </svg>`
      )}`;
    },

    markerIcon(marker) {
      return marker.sameCoordsItems.length > 1
        ? this.getNumberedIcon(marker.sameCoordsItems.length)
        : marker.SBALOONCOLOR;
    },
  },
};
</script>

<style scoped>
.info-block {
  position: absolute;
  /* todo: extract to css variable, use in getInfoBlockWidth */
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
.info-block div + div {
  margin-top: 1.5rem;
}

.info-block::-webkit-scrollbar-thumb {
  background: var(--lgreen);
  width: 2px;
  border: 3px solid var(--white);
  border-radius: 10px;
}

.info-block::-webkit-scrollbar {
  width: 6px;
}
.info-block::-webkit-scrollbar:vertical {
  border: 4px solid transparent;
  width: 10px;
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
    bottom: 32px;
    max-height: 60%;
    transform: none;
    top: auto;
    padding: 0;
    border: 16px solid #fff;
    height: fit-content;
    border-radius: 16px 16px 0 0;
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
