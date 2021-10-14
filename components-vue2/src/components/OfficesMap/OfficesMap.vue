<template>
  <div class="map-container mt-3">
    <h5>Найдите офис рядом с вами</h5>
    <input type="text" id="suggest" />
    <FilterComponent :filters="filters" @update="filterOffices" class="my-3" />
    <slot />
    <b-tabs ref="tabs" content-class="mt-3">
      <b-tab title="На карте" active
        ><div ref="map" id="map" class="map"></div
      ></b-tab>
      <b-tab title="На схеме метро"><p>Схема метро</p></b-tab>
      <b-tab title="В списке">
        <RegionsList />
        <OfficesList :data="getOffices" @update="page = $event" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import FilterComponent from "./FilterComponent.vue";
import RegionsList from "./RegionsList.vue";
import OfficesList from "./OfficesList.vue";
import { filters, filterData } from "../../../../utils/map/filters";
import { BTabs, BTab } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);
export default {
  name: "OfficesMap",
  components: {
    RegionsList,
    OfficesList,
    FilterComponent,
    BTabs,
    BTab,
  },
  data() {
    return {
      myMap: null,
      myClusterer: null,
      filters,
      filteredOffices: null,
      page: 0,
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
    init(_, filters) {
      let suggestView = new ymaps.SuggestView("suggest");
      if (this.myMap) {
        this.myMap.destroy();
        suggestView.destroy();
      }
      let showOnMap = this.showOnMap.bind(this);
      suggestView.events.add("select", function (e) {
        showOnMap(e.get("item").value);
      });
      this.myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 6,
      });
      let agencies = this.$store.getters["map/getAgencies"];
      if (filters) {
        agencies = filterData(agencies, filters);
      }
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
      this.myClusterer = new ymaps.Clusterer();
      this.myClusterer.add(myGeoObjects);
      this.myMap.geoObjects.add(this.myClusterer);
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
      this.myMap.setCenter(state.center, state.zoom);
      placemark.geometry.setCoordinates(state.center);
      placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });
      this.myMap.setCenter(state.center, state.zoom);
    },
    showResult(obj) {
      let mapContainer = document.getElementById("map");
      let bounds = obj.properties.get("boundedBy");
      // Рассчитываем видимую область для текущего положения пользователя.
      let mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [
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
      this.updateMap(mapState, shortAddress);
    },
    showOnMap(suggest) {
      let showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then(function (res, context) {
        let obj = res.geoObjects.get(0);
        if (obj) {
          showResult(obj);
        }
      });
    },
    filterOffices(filters) {
      if (this.$refs.tabs.currentTab == 0) {
        // Карта офисов
        this.init(_, filters);
      }
      if (this.$refs.tabs.currentTab == 1) {
        // Карта метро
      }
      if (this.$refs.tabs.currentTab == 2) {
        // Список офисов
        this.page = 0;
        if (filters) {
          this.filteredOffices = filterData(
            this.$store.getters["map/getRegionOffices"],
            filters
          );
        }
      }
    },
  },
  computed: {
    getOffices() {
      let data;
      if (this.filteredOffices) {
        data = this.filteredOffices;
      } else {
        data = this.$store.getters["map/getRegionOffices"];
      }
      return data;
    },
    region() {
      return this.$store.getters["map/getSelectedRegion"];
    },
  },
  watch: {
    region: function (val) {
      this.filteredOffices = null;
    },
  },
};
</script>

<style scoped>
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
</style>
