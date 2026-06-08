<template>
  <map-component
    :markers="markers"
    @marker-click="handleMarkerClick"
    :active-marker-id="activeMarkerId"
  >
    <div
      class="info-block"
      v-if="activeCard"
    >
      <button
        class="close"
        @click="handleInfoClose"
      ></button>
      <BaloonMap
        v-for="card in activeCard.sameCoordsItems"
        :key="card.ID"
        :data="card"
        :has-choose-button="hasChooseButton"
        :filter-icons="filterIcons"
        :item-id="itemId"
        @select="handleSelect"
      />
    </div>
  </map-component>
</template>

<script>
import { defineComponent, computed, ref, getCurrentInstance, watch, onMounted } from "vue";
import isEqual from "lodash.isequal";
import MapComponent from "@/components/Libs/Controls/ControlMap/MapComponent.vue";
import BaloonMap from "@/components/Libs/Controls/ControlMap/BaloonMap.vue";

export default defineComponent({
  name: "MapInfoBlock",
  components: { BaloonMap, MapComponent },
  props: {
    data: {
      type: Array,
      required: true,
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
    },
    filterIcons: {
      type: Object,
      default: () => ({}),
    },
    itemId: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const activeCard = ref();

    const getNumberedIcon = (number) =>
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="15" fill="green"/>
            <text x="15" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${number}</text>
          </svg>`
      )}`;

    const store = getCurrentInstance().proxy.$store;

    const getIcon = (markerItems) =>
      markerItems.length > 1 ? getNumberedIcon(markerItems.length) : markerItems[0].SBALOONCOLOR;

    const cards = computed(() => {
      const ids = new Set();
      const dataWithoutDuplicates = props.data.filter((item) => {
        if (ids.has(item.ID)) {
          return false;
        }
        ids.add(item.ID);
        return true;
      });

      // this should be a separate computed
      return dataWithoutDuplicates.reduce((acc, item) => {
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
    });

    onMounted(() => {
      const initialMarkerId = store.getters["data_card/getActivePointInMap"];
      if (initialMarkerId) {
        activeCard.value = markers.value.find((marker) => marker.ID === initialMarkerId);
      }
    });

    const activeMarkerId = computed(() => (activeCard.value ? activeCard.value.ID : null));

    const markers = computed(() =>
      Object.values(cards.value).flatMap((group) =>
        group.items.map((item) => ({
          ID: item.ID,
          icon: getIcon(group.items),
          coordinates: [...group.coords],
          sameCoordsItems: group.items,
          active: activeMarkerId.value === item.ID,
        }))
      )
    );

    watch(markers, (newMarkers, oldMarkers) => {
      if (!isEqual(newMarkers.length, oldMarkers.length)) {
        activeCard.value = null;
      }
    });

    const handleMarkerClick = (id) => {
      activeCard.value = markers.value.find((marker) => marker.ID === id);
    };

    const handleInfoClose = () => {
      activeCard.value = null;
    };

    const handleSelect = (id) => {
      emit("select", id);
    };

    return {
      markers,
      handleMarkerClick,
      cards,
      activeCard,
      handleInfoClose,
      handleSelect,
      activeMarkerId,
    };
  },
});
</script>

<style scoped></style>
