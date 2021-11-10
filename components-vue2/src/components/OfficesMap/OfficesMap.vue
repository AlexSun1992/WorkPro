<template>
  <div class="map-container mt-3">
    <h5>Найдите офис рядом с вами</h5>
    <input type="text" id="suggest" />
    <div v-if="suggest && !getOffices">
      По вашему запросу ничего не найдено. Попробуйте изменить критерии поиска
    </div>
    <FilterComponent :filters="filters" @update="filterOffices" class="my-3" />
    <Notification :notification="notification" />
    <b-tabs ref="tabs" content-class="mt-3">
      <b-tab title="На карте" active
        ><div ref="map" id="map" class="map"></div
      ></b-tab>
      <b-tab ref="metro" title="На схеме метро">
        <Mosmetro @click="chooseStation" />
        <div v-show="cardVisible" ref="card" class="card">
          <metro-office-card
            @close="circleClicked = false"
            :offices="stationOffices"
          />
        </div>
      </b-tab>
      <b-tab title="В списке">
        <OfficesList
          v-if="regionId"
          :data="getOffices"
          @update="page = $event"
        />
        <div v-else>
          По вашему запросу ничего не найдено. Попробуйте изменить критерии
          поиска
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Mosmetro from "./mosmetro.svg";
import FilterComponent from "./FilterComponent.vue";
import Notification from "./Notification.vue";
import OfficesList from "./OfficesList.vue";
import MetroOfficeCard from "./MetroOfficeCard.vue";
import { filters, filterData } from "../../../../utils/map/filters";
import { BTabs, BTab } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);
export default {
  name: "OfficesMap",
  components: {
    OfficesList,
    FilterComponent,
    Notification,
    BTabs,
    BTab,
    Mosmetro,
    MetroOfficeCard,
  },
  props: ["notification"],
  data() {
    return {
      myMap: null,
      myClusterer: null,
      filters,
      filteredOffices: null,
      page: 0,
      mapState: null,
      regionId: null,
      centerCoords: null,
      currentFilters: null,
      address: null,
      suggest: null,
      circleColor: null,
      stationOffices: [],
      circleClicked: false,
    };
  },
  async created() {
    try {
      await this.$store.dispatch("map/fetchAgencies");
      await this.$loadScript(
        `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
      ).then(() => {
        if (this.$store.getters["map/getAgencies"]) {
          ymaps.ready(this.init);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    chooseStation(e) {
      if (this.circle) {
        this.circle.attributes.fill.value = "#fff";
      }
      if (e.target.tagName == "circle") {
        this.stationOffices = [];
        this.circleClicked = true;
        let stationName = e.target.nextSibling.innerHTML;
        let offices = this.$store.getters["map/getRegionOffices"];
        offices.forEach((office) => {
          let candidate = office.IDUNDERGROUND.find((item) => {
            if (item.SNAME.includes(", ")) {
              return item.SNAME.split(", ").includes(stationName);
            } else {
              return item.SNAME === stationName;
            }
          });
          if (candidate) {
            this.stationOffices.push(office);
          }
        });
        this.circle = e.target;
        this.circle.attributes.fill.value = "gold";
        this.$refs["card"].style.top = e.offsetY + "px";
        this.$refs["card"].style.left = e.offsetX + "px";
      }
    },
    async init(_, filters) {
      this.initSuggestView();
      let agencies = this.$store.getters["map/getAgencies"];
      if (filters) {
        agencies = filterData(agencies, filters);
      }
      await this.setPositionAttributes();
      if (!this.currentFilters) {
        await this.$store.dispatch("map/fetchRegion", {
          id: this.regionId,
          coords: this.centerCoords,
        });
      }

      this.myClusterer = new ymaps.Clusterer();
      this.myClusterer.add(this.getGeoObjects(agencies));

      let mapState;

      if (this.mapState) {
        mapState = this.mapState;
        this.mapState.zoom = 12;
      } else {
        mapState = {
          center: this.centerCoords ? this.centerCoords : [55.76, 37.64],
          zoom: 12,
        };
      }

      this.myMap = new ymaps.Map("map", mapState);
      this.myMap.geoObjects.add(this.myClusterer);
    },
    getGeoObjects(agencies) {
      let myGeoObjects = [];
      for (let i = 0; i < agencies.length; i++) {
        myGeoObjects[i] = new ymaps.GeoObject({
          geometry: {
            type: "Point",
            coordinates: [agencies[i].NLAT, agencies[i].NLONG],
          },
          properties: {
            balloonContentBody: `
          <strong><span>${agencies[i].SSHORTNAME}</span></strong><br><br>
          <span>${agencies[i].SADDRESS}</span><br>
          <strong>Тел.:</strong><span>${agencies[i].SPHONE}</span><br>
          <strong>Email.:</strong><span>${agencies[i].SPHONE}</span><br>
          <strong>Режим работы:</strong><br><span>${agencies[i].SGRAF}</span>
        `,
            hintContent: `${agencies[i].SSHORTNAME}`,
          },
        });
      }
      return myGeoObjects;
    },
    initSuggestView() {
      let suggestView = new ymaps.SuggestView("suggest");
      if (this.myMap) {
        this.myMap.destroy();
        suggestView.destroy();
      }
      let showOnMap = this.showOnMap.bind(this);

      suggestView.events.add("select", function (e) {
        showOnMap(e.get("item").value);
      });
    },

    async setPositionAttributes() {
      let geolocation = await ymaps.geolocation.get();
      if (geolocation) {
        let query = this.suggest
          ? this.suggest
          : geolocation.geoObjects.get(0).properties.get("text");
        this.centerCoords = geolocation.geoObjects.position;
        try {
          this.address = await this.$axios.post("/api/suggestions/address", {
            query,
            count: 1,
          });
          if (this.address.data.suggestions.length) {
            this.regionId =
              this.address.data.suggestions[0].data.city_kladr_id.substr(0, 2);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    updateMap(state, caption) {
      let placemark = new ymaps.Placemark(
        this.myMap.getCenter(),
        {
          iconCaption: caption,
          balloonContent: caption,
        },
        {
          preset: "islands#redDotIconWithCaption",
        }
      );
      this.myMap.geoObjects.add(placemark);
      this.myMap.setCenter(state.center, 12);
      placemark.geometry.setCoordinates(state.center);
      placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });
    },
    showResult(obj) {
      let mapContainer = document.getElementById("map");
      let bounds = obj.properties.get("boundedBy");
      // Рассчитываем видимую область для текущего положения пользователя.
      this.mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [
        mapContainer.clientWidth,
        mapContainer.clientHeight,
      ]);
      // Сохраняем полный адрес для сообщения под картой.
      // let address = [obj.getCountry(), obj.getAddressLine()].join(", ");
      // Сохраняем укороченный адрес для подписи метки.
      let shortAddress = [
        obj.getThoroughfare(),
        obj.getPremiseNumber(),
        obj.getPremise(),
      ].join(" ");
      this.updateMap(this.mapState, shortAddress);
    },
    async showOnMap(suggest) {
      this.suggest = suggest;
      try {
        this.address = await this.$axios.post("/api/suggestions/address", {
          query: suggest,
          count: 1,
        });

        if (this.address.data.suggestions.length) {
          this.regionId =
            this.address.data.suggestions[0].data.city_kladr_id.substr(0, 2);

          await this.$store.dispatch("map/fetchRegion", {
            id: this.regionId,
            coords: this.centerCoords,
          });
        } else {
          this.regionId = null;
        }
      } catch (e) {
        console.log(e);
      }

      if (this.currentFilters) {
        this.filteredOffices = filterData(
          this.$store.getters["map/getRegionOffices"],
          this.currentFilters
        );
      }

      let showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then(function (res, context) {
        let obj = res.geoObjects.get(0);
        if (obj) {
          showResult(obj);
        }
      });
    },
    async filterOffices(filters) {
      await this.$store.dispatch("map/fetchRegion", {
        id: this.regionId,
        coords: this.centerCoords,
      });
      this.currentFilters = filters;
      this.filteredOffices = filterData(
        this.$store.getters["map/getRegionOffices"],
        this.currentFilters
      );
      let _;
      this.init(_, filters);
      if (this.$refs.tabs.currentTab == 0) {
        // Карта офисов
      }
      if (this.$refs.tabs.currentTab == 1) {
        // Карта метро
      }
      if (this.$refs.tabs.currentTab == 2) {
        // Список офисов
        this.page = 0;
      }
    },
  },
  computed: {
    cardVisible() {
      debugger;
      return this.circleClicked && this.stationOffices.length;
    },
    getOffices() {
      let data;
      if (this.filteredOffices) {
        data = this.filteredOffices;
      } else {
        data = this.$store.getters["map/getRegionOffices"];
      }

      if (!this.regionId) {
        data = null;
      }

      return data;
    },
    tabVisible() {
      // return this.regionId == 77 || this.regionId == 78;
    },
  },
};
</script>

<style scoped lang="scss">
body {
  margin: 0;
  padding: 0;
}
.map {
  width: 800px;
  height: 600px;
}
select,
.form-control,
input {
  min-width: 500px !important;
}
.filters {
  display: flex;
}
.tab-pane {
  position: relative;
}
.card {
  position: absolute;
  min-width: 400px;
  min-width: min-content;
  padding: 15px;
  & > div {
    display: flex;
  }
}

circle:hover {
  cursor: pointer;
  r: 15;
}
path:hover {
  stroke-width: 12;
}
</style>
