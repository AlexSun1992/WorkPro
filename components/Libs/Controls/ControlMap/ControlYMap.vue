<template>
  <yandex-map
    :key="key"
    class="ymap"
    :zoom="coords.zoom"
    :coords="coords.center"
    :controls="[]"
    :use-object-manager="false"
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
      :icon="markerIcon(item.SBALOONCOLOR)"
      :options="markerOptions"
    >
      <baloon-map :data="item" slot="balloon"></baloon-map>
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
    coordinates: [55.76, 37.64],
    coords: { zoom: 10, center: [55.76, 37.64] },
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
  },
  async created() {
    if (this.isDataExist) {
      await this.$store.dispatch("blocks/fetchBlock", {
        id: this.data.menudic,
        query: this.$store.getters["data_card/getSelectedValues"],
        ...this.$route.params,
      });
      this.coords = this.getCoords();
    }
  },
  computed: {
    isDataExist() {
      return this.data && Object.keys(this.data).length > 0;
    },
    dataContent() {
      return this.isDataExist
        ? this.$store.getters["blocks/getUnfilteredBlockById"](
            this.data.menudic
          )
        : {};
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
      };
    },
    markers() {
      const data = this.dataContentFiltered.length
        ? this.dataContentFiltered
        : this.dataContent?.data?.items || [];

      return data.reduce((acc, item) => {
        if (item.ID !== 0 && "NLAT" in item && "NLON" in item) {
          return [
            ...acc,
            {
              ...item,
              COORDS: [item.NLAT, item.NLON],
            },
          ];
        }
        return acc;
      }, []);
    },
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
    getCoords() {
      if (this.getAllCoordinate.length) {
        const bounds = ymaps.util.bounds.fromPoints(this.getAllCoordinate);
        const centerAndZoom = ymaps.util.bounds.getCenterAndZoom(bounds, [
          this.width,
          this.height,
        ]);
        return centerAndZoom.zoom > 15
          ? { ...centerAndZoom, zoom: 15 }
          : centerAndZoom;
      }
      return { center: this.coordinates, zoom: 10 };
    },
    compareArrays(oldArray, newArray) {
      return JSON.stringify(oldArray) === JSON.stringify(newArray);
    },
    changeMarkers() {
      console.log("markers");
    },
    markerIcon(color) {
      const iconName =
        color === "green" || !color ? "ya_agent.svg" : `ya_agent-${color}.svg`;

      return {
        layout: "default#imageWithContent",
        imageSize: [43, 43],
        imageOffset: [-22, 0],
        contentOffset: [-22, -43],
        imageHref: `https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/${iconName}`,
      };
    },
    baloonOpen(event) {
      const button = document.querySelector("#btn");
      const marker = event.get("target");
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
      );
      const markerId = marker.properties.get("markerId");
      if (this.textButtons.length === 2) {
        const [beforeTextButton, afterTextButton] = this.textButtons;

        button.textContent = beforeTextButton;
        button.addEventListener("click", this.handler);
        button.markerId = markerId;

        if (this.selectMarkerId === markerId) {
          this.addButton(afterTextButton);
        }
      }
    },
    addButton(buttonText) {
      const button = document.querySelector("#btn");
      button.classList.remove("btn-secondary");
      button.classList.add("btn-primary");
      button.textContent = buttonText;
    },
    baloonClose(event) {
      const marker = event.get("target");
      marker.options.set(
        "iconImageHref",
        "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
      );
      if (this.textButtons.length > 0) {
        document
          .querySelector("#btn")
          ?.removeEventListener("click", this.handler);
      }
    },
    handler(event) {
      this.addButton("Выбрано");
      this.selectMarkerId = event.target.markerId;
      const marker = this.markers.find(
        (item) => item.ID === this.selectMarkerId
      );
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
