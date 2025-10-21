<template>
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
    @balloonclose="closeInitializedBalloon"
  >
    <ymap-marker
      v-for="item in markers"
      :ref="item.ID"
      :key="item.ID"
      :marker-id="item.ID"
      :coords="item.COORDS"
      @balloonopen="balloonOpen($event)"
      @balloonclose="balloonClose($event)"
      @click="closeInitializedBalloon"
      :icon="
        markerIcon({
          number: item.sameCoordsItems.length,
          icon: item.SBALOONCOLOR,
          active: isInitialMarker(item.ID),
        })
      "
      :options="markerOptions"
      :properties="{ markerId: item.ID }"
    >
      <baloon-map
        :data="item.sameCoordsItems"
        ref="balloonContent"
        slot="balloon"
        :hasChooseButton="hasChooseButton"
        :filter-icons="filterIcons"
      ></baloon-map>
    </ymap-marker>
  </yandex-map>
</template>

<script>
import BaloonMap from "./BaloonMap.vue";

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
    initialMarker: null,
    activeMarker: null,
  }),
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    itemId: {
      type: String,
      default: "",
    },
    actionId: {
      type: String,
      default: "",
    },
    // undefined  -> no mainFilteredItems provided
    // []         -> mainFilteredItems exists, no items found for filters
    mainFilteredItems: {
      type: Array || undefined,
      default: undefined,
    },
    relationKey: {
      type: String,
      default: null,
    },
    hasChooseButton: {
      type: Boolean,
      default: false,
    },
    icons: {
      type: String,
      default: "",
    },
    filterIcons: {
      type: Object,
      default: () => ({}),
    },
  },
  async created() {
    if (this.isDataExist) {
      await this.$store.dispatch("blocks/fetchBlock", {
        id: this.data.menudic,
        query: this.$store.getters["data_card/getSelectedValues"],
        ...this.$route.params,
      });
      this.coords = this.getCoords();
      console.log(this.filterIcons);
    }
  },
  mounted() {
    document.body.addEventListener("click", this.clickHandler);
  },
  computed: {
    activePointInMap() {
      return this.$store.getters["data_card/getActivePointInMap"];
    },

    isDataExist() {
      return this.data && Object.keys(this.data).length > 0;
    },

    dataContent() {
      return this.isDataExist ? this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic) : {};
    },

    dataContentFiltered() {
      if (this.itemId) {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        return block?.data?.items || [];
      }
      return [];
    },

    textButtons() {
      return this.markers?.[0]?.SBUTTONTEXT || [];
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

    markersFlat() {
      return this.markers.flat();
    },

    isFavorite() {
      return this.markersFlat.some((marker) => marker.hasOwnProperty("LFAV"));
    },

    parsedActionId() {
      return Number.parseInt(this.actionId);
    },

    mapIcons() {
      try {
        return JSON.parse(this.icons);
      } catch (err) {
        console.error(err);
      }
      return [];
    },
  },

  beforeDestroy() {
    // TODO: reWork heart button after yandex-map update
    document.body.removeEventListener("click", this.clickHandler);

    if (!Object.keys(this.activePointInMap).length) return;
    if (this.mapInstance) {
      this.mapInstance.balloon.close();
      this.mapInstance.balloon.destroy();
      this.mapInstance = null;
    }
    this.$store.commit("data_card/setActivePointInMap", {});
  },
  watch: {
    getAllCoordinate(oldVal, newVal) {
      const isIdenticalArrays = this.compareArrays(oldVal, newVal);
      if (!isIdenticalArrays) {
        this.coords = this.getCoords();
        this.key += 1;
      }
    },

    coords() {
      this.key += 1;
    },
  },

  methods: {
    clickHandler(event) {
      const heartButton = event.target.closest(".btn-heart");
      const urlButton = event.target.closest("[data-button-type='map-url-button']");
      const chooseButton = event.target.closest("[data-button-type='map-choose-button']");

      if (heartButton) {
        const markerId = parseInt(heartButton.dataset?.id, 10);
        if (!markerId) return;
        const marker = this.markersFlat.find((el) => el.ID === markerId);
        if (!Object.keys(marker).length || !("LFAV" in marker)) return;
        let favorite = false;
        if (!marker.LFAV) {
          heartButton.classList.add("active");
          favorite = true;
        } else {
          heartButton.classList.remove("active");
        }
        const icon = this.getNewIcon({ marker, favorite });
        this.activeMarker.options.set("iconImageHref", this.markerIcon({ icon }).imageHref);

        this.favoriteButtonSendData(markerId);
      }

      if (urlButton) {
        const { url } = urlButton.dataset;
        window.open(url);
      }

      if (chooseButton) {
        const parsedId = Number.parseInt(chooseButton.dataset?.id, 10);
        this.$emit("update", parsedId);
      }
    },

    setActiveMarker(marker, active) {
      const iconOptions = this.markerIcon({ active });
      marker.options.set("iconImageSize", iconOptions.imageSize);
      marker.options.set("iconImageOffset", iconOptions.imageOffset);
      marker.options.set("balloonOffset", iconOptions.balloonOffset);
    },

    mapInit(mapInstance) {
      this.mapInstance = mapInstance;
      if (Object.keys(this.activePointInMap).length) {
        this.openInitializedBalloon();
      } else if (this.key === 0) {
        this.coords = this.getCoords();
      }
    },

    openInitializedBalloon() {
      this.$nextTick(() => {
        if (this.mapInstance.balloon.isOpen()) {
          this.mapInstance.balloon.close();
        }
        const markerId = this.activePointInMap.ID;

        const balloonContent = this.$refs.balloonContent?.find((comp) => comp.data?.[0]?.ID === markerId);

        this.selectMarkerId = markerId;
        const coords = [this.activePointInMap.NLAT, this.activePointInMap.NLON];

        this.initialMarker = markerId;

        const html = balloonContent.$el.innerHTML;

        this.mapInstance.balloon.open(coords, html);
      });
    },
    closeInitializedBalloon() {
      if (this.initialMarker) {
        this.initialMarker = null;
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
    compareArrays(oldArray, newArray) {
      return JSON.stringify(oldArray) === JSON.stringify(newArray);
    },

    markerIcon({ number = 1, icon = undefined, active }) {
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

    isInitialMarker(id) {
      return this.initialMarker === id;
    },

    addButton() {
      const buttons = document.querySelectorAll(".btn-balloon");
      if (!buttons.length) return;

      buttons.forEach((el) => {
        el.textContent = beforeTextButton;
        el.addEventListener("click", this.handler);
        el.markerId = markerId;
        if (el.id == this.selectMarkerId) {
          if (this.selectMarkerId === markerId) {
            this.addButton(afterTextButton);
            el.classList.remove("btn-secondary");
            el.classList.add("btn-primary");
            el.textContent = "Выбрано";
          } else {
            el.classList.remove("btn-primary");
            el.classList.add("btn-secondary");
            el.textContent = "Выбрать";
          }
        }
      });
    },

    balloonOpen(event) {
      const marker = event.get("target");
      this.activeMarker = marker;
      this.setActiveMarker(marker, true);

      const buttons = document.querySelectorAll(".btn-balloon");
      buttons.forEach((button) => {
        if (this.textButtons.length === 2 && !this.isFavorite) {
          button.addEventListener("click", this.handler);
          this.addButton();
        }
      });
    },

    balloonClose(event) {
      if (!this.initialMarker) {
        this.initialMarker = null;
      }
      const marker = event.get("target");
      this.setActiveMarker(marker, false);
    },

    getNewIcon({ marker, favorite }) {
      if (favorite) {
        return this.mapIcons["Любимые клиники"];
      } else if (marker.LREC) {
        return this.mapIcons["Рекомендованные"];
      } else {
        return "/img/maps-icon-empty.svg";
      }
    },

    async favoriteButtonSendData(markerId) {
      const action = this.$store.getters["menu/getActionById"](this.parsedActionId);

      this.$store.commit("blocks/toggleFavoriteButtons", { blockId: this.itemId, idCard: markerId });
      const card = this.markersFlat.find((el) => el.ID === markerId);

      await this.$store.dispatch("blocks/executeAction", {
        relId: card.REL,
        relActionId: action.REL,
        rowId: card.ID,
        body: [
          { name: this.relationKey, value: card[this.relationKey] },
          { name: "ID", value: card.ID },
        ],
        actionId: this.parsedActionId,
      });
    },

    handler(event) {
      this.selectMarkerId = event.target.markerId;
      this.addButton();
      const marker = this.markersFlat.find((item) => item.ID === this.selectMarkerId);
      const valuePrepare = Object.keys(marker).reduce((acc, key) => {
        if (Number.isInteger(marker[key])) {
          acc[key] = marker[key];
        }
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

<style scoped>
.ymap {
  height: 500px;
  width: 100%;
}
</style>
