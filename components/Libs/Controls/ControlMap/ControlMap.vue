<template>
  <client-only>
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: coordinates,
          zoom: 9,
        },
      }"
      height="500px"
      is-ready-to-init
    >
      <yandex-map-marker
        v-for="marker in markers"
        :key="marker.ID"
        :settings="{
          ...marker,
          onClick: handleMarkerClick(marker),
          zIndex: marker.active ? 1 : 0,
        }"
        position="top-center left-center"
      >
        <img
          :height="markerHeight"
          :src="getIcon(marker.active)"
        />
        <div
          v-if="marker.active"
          class="popup"
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

import { shallowRef, computed, ref, watch, defineComponent, onMounted, getCurrentInstance } from "vue";
import { pixelsToWorld, worldToPixels } from "@yandex/ymaps3-world-utils";
import BaloonMap from "./BaloonMap.vue";

const MARKER_HEIGHT = 38;
const POPUP_PADDING = 16;
const POPUP_LEFT = 38;

export default defineComponent({
  name: "ControlMap",
  components: {
    YandexMapMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    BaloonMap,
    YandexMap,
  },
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

  emits: ["update"],

  setup(props, { emit }) {
    const instance = getCurrentInstance();

    const route = instance.proxy.$route;
    const store = instance.proxy.$store;

    const dataContent = ref(null);
    const activeMarkerId = ref(null);
    const selectedCardId = ref(null);
    const coordinates = ref([37.64, 55.76]);
    const markerHeight = ref(MARKER_HEIGHT);

    onMounted(async () => {
      await store.dispatch("blocks/fetchBlock", {
        id: props.data.menudic,
        query: store.getters["data_card/getSelectedValues"],
        ...route.params,
      });
      dataContent.value = store.getters["blocks/getUnfilteredBlockById"](props.data.menudic);
    });

    const map = shallowRef(null);

    const isMapLoaded = computed(() => VueYandexMaps.isLoaded.value);

    watch(isMapLoaded, async (isLoaded) => {
      if (isLoaded) {
        await getCoordinates();
      }
    });

    const selectedCity = computed(() => {
      const allForms = store.getters["data_card/getForm"];
      const field = allForms?.find((item) => item.dic === "IDTOWN");
      return field?.value?.value?.SNAME || "";
    });

    watch(selectedCity, (newCity, _) => {
      if (newCity) {
        getCoordinates();
      }
    });

    const markers = computed(
      () =>
        dataContent.value?.data?.items
          ?.filter((item) => item.ID !== 0)
          .map((item) => ({
            ...item,
            coordinates: [item.NLON, item.NLAT],
            active: item.ID === activeMarkerId.value,
          })) || []
    );

    const centerOnPopup = (markerLocation) => {
      const { zoom, projection } = map.value;

      const markerWorldCoords = projection.toWorldCoordinates(markerLocation);
      const markerPixelCoords = worldToPixels({ x: markerWorldCoords.x, y: markerWorldCoords.y }, zoom);

      const popup = document.querySelector(".balloon-container");
      const popupRect = popup.getBoundingClientRect();

      const popupPixelCoords = {
        x: markerPixelCoords.x + popupRect.width / 2 - POPUP_LEFT - POPUP_PADDING / 2,
        y: markerPixelCoords.y - popupRect.height / 2 - MARKER_HEIGHT,
      };
      const popupWorldCoords = pixelsToWorld(popupPixelCoords, zoom);
      const popupLngLatCoords = projection.fromWorldCoordinates({ x: popupWorldCoords.x, y: popupWorldCoords.y });

      map.value.setLocation({ center: popupLngLatCoords, zoom, duration: 300, easing: "ease-in-out" });
    };

    const handleMarkerClick = (marker) => (clickEvent) => {
      activeMarkerId.value = marker.ID;
      const location = marker.coordinates;
      // TODO: Remove when this component is not used anymore
      setTimeout(() => {
        centerOnPopup(location);
      }, 100);
    };

    const handleBalloonClose = () => {
      activeMarkerId.value = null;
    };

    const getIcon = (active) =>
      `https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent${active ? "_active" : ""}.svg`;

    const getCoordinates = async () => {
      const basicCoords = [37.64, 55.76];
      if (selectedCity.value) {
        try {
          const geoObject = await ymaps3.search({ text: selectedCity.value });
          const coords = geoObject?.[0]?.geometry?.coordinates;
          coordinates.value = coords?.length ? coords : basicCoords;
        } catch (e) {
          console.error("error on get coordinates", e);
        }
      }
    };

    const handleSelect = (selectedId) => {
      selectedCardId.value = selectedId;
      const marker = markers.value.find((item) => item.ID === selectedId);
      const valuePrepare = Object.keys(marker)
        .filter((key) => Number.isInteger(marker[key]))
        .reduce((acc, key) => {
          acc[key] = marker[key];
          return acc;
        }, {});
      store.commit("data_card/setFilters", valuePrepare);
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: {
          value: { ...marker },
          text: marker.ID,
        },
      });
    };

    return {
      map,
      centerOnPopup,
      handleSelect,
      getIcon,
      getCoordinates,
      handleBalloonClose,
      handleMarkerClick,
      selectedCity,
      markers,
      coordinates,
      selectedCardId,
      markerHeight,
      dataContent,
      activeMarkerId,
    };
  },
});
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
  width: 340px;
  height: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
  position: absolute;
  bottom: 48px;
  left: -38px;
}

@media (max-width: 425px) {
  .balloon-container {
    width: 300px;
  }
}
</style>
