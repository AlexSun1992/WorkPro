<template>
  <div class="map-container mt-3">
    <div class="container">
      <div class="office-block">
        <div class="row align-items-center mh-1">
          <div class="col-12 col-lg-5">
            <div class="position-relative">
              <input type="text" id="suggest" ref="search" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="office-tab-content">
      <div ref="map" id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import { filters, filterData } from "../../../../utils/map/filters";
// import { BTabs, BTab } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import { isOpened, getTemplate } from "../../../../utils/map/helpers";
import getCurrentCity from "./currentCity";
Vue.use(LoadScript);
export default {
  name: "OfficesMap",

  data() {
    return {
      myMap: null,
      myClusterer: null,
      filters,
      filteredOffices: null,
      page: 1,
      mapState: null,
      regionId: null,
      centerCoords: null,
      currentFilters: null,
      address: null,
      suggest: null,
      suggestView: null,
      currentStation: null,
      isInputEmpty: true,
      placemark: null,
      city: "",
      width: window.innerWidth,
      isShownMore: false,
      height: window.innerHeight,
      qc_geo: null,
      isMetroSuggest: false,
      cityHasOffices: false,
    };
  },
  async created() {
    try {
      if (Cookies.get("lat") && Cookies.get("lat") !== "null") {
        await this.$store.dispatch("map/fetchRegion", {
          id: Cookies.get("kladr_id")?.substr(0, 2),
          coords: [Cookies.get("lat"), Cookies.get("lon")],
        });
      } else {
        await getCurrentCity().then(
          async ({
            lat = "55.75396",
            lon = "37.620393",
            kladr = "7700000000000",
          }) => {
            this.lat = lat;
            this.lon = lon;
            Cookies.set("lat", lat);
            Cookies.set("lon", lon);
            Cookies.set("kladr_id", kladr);
            await this.$store
              .dispatch("map/fetchRegion", {
                id: kladr.substr(0, 2),
                coords: [lat, lon],
              })
              .catch((e) => console.log(e));
          }
        );
      }
      await this.$loadScript(
        `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
      ).then(() => {
        if (this.$store.getters["map/getRegionOffices"]) {
          ymaps.ready(this.init);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async init(_, filters) {
      let lat = Cookies.get("lat");
      let lon = Cookies.get("lon");
      if (lat && lon) {
        this.centerCoords = [lat, lon];
      }

      this.initSuggestView();
      let agencies = this.$store.getters["map/getRegionOffices"];
      if (filters) {
        agencies = filterData(this.getOfficesByCity, filters);
      }
      // await this.setPositionAttributes();

      this.myClusterer = new ymaps.Clusterer({
        preset: "islands#darkGreenClusterIcons",
      });

      // this.myClusterer.add(this.getGeoObjects(agencies));

      let mapState;

      if (this.mapState) {
        mapState = this.mapState;
        this.mapState.zoom = 12;
      } else {
        mapState = {
          center: this.centerCoords
            ? this.centerCoords
            : this.$store.getters["map/getDefaultCoords"],
          zoom: 12,
          controls: [],
        };
      }

      this.myMap = new ymaps.Map("map", mapState, {
        yandexMapDisablePoiInteractivity: true,
        hideIconOnBalloonOpen: false,
      });
      this.myMap.behaviors.disable("scrollZoom");
      this.myMap.behaviors.enable(["dblClickZoom", "multiTouch"]);
      this.myMap.controls.add("zoomControl", {
        size: "small",
        float: "none",
        position: {
          bottom: "70px",
          right: "100px",
        },
      });
      // this.myMap.geoObjects.add(this.myClusterer);
      // let body = document.getElementsByTagName("body")[0];
      // this.myMap.geoObjects.events.add("balloonopen", (e) => {
      //   body.classList.add("open-balloon");
      //   const target = e.get("target");
      //   target.options.set(
      //     "iconImageHref",
      //     "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
      //   );
      // });

      // this.myMap.geoObjects.events.add("balloonclose", (e) => {
      //   body.classList.remove("open-balloon");
      //   const target = e.get("target");
      //   target?.options.set(
      //     "iconImageHref",
      //     "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
      //   );
      // });
      // this.setPlaceholder();
    },

    initSuggestView() {
      this.suggestView = new ymaps.SuggestView("suggest");
      if (this.myMap) {
        this.myMap.destroy();
        this.suggestView.destroy();
      }
      let showOnMap = this.showOnMap.bind(this);
      // this.closeCard();
      let _this = this;
      func._this = this;
      function func(e) {
        _this.isMetroSuggest = false;
        if (e.get("item").value.includes("метро")) {
          _this.isMetroSuggest = true;
          _this.currentStation = e.get("item").value.split(" метро")[1].trim();
          let maps = document.querySelectorAll(".g-svg-metromap");
          let elmaps = document.getElementsByClassName("g-svg-metromap");
          for (let i = 0; i < maps[0]?.children.length; i++) {
            if (
              maps[0].children[i].tagName === "use" &&
              maps[0].children[i].dataset.station === _this.currentStation
            ) {
              maps[0].children[i].setAttribute("href", "#balloon-select");

              _this.positionSelectBalloon();
            }
          }
        }
        let addressArr;
        if (e.get("item").value.includes("линия")) {
          addressArr = e.get("item").value.split(", ");
          addressArr.splice(2, 1);
          addressArr = addressArr.join();
        }
        showOnMap(addressArr ? addressArr : e.get("item").value);
      }
      this.suggestView.events.add("select", func);
    },

    async showOnMap(suggest, coords) {
      this.suggest = suggest;
      try {
        this.address = await this.$axios.post("/api/suggestions/address", {
          query: suggest,
          count: 1,
        });
        this.qc_geo = this.address.data.suggestions[0].data.qc_geo;
        this.city = this.address.data.suggestions[0].data.city;
        this.centerCoords = [
          this.address.data.suggestions[0].data.geo_lat,
          this.address.data.suggestions[0].data.geo_lon,
        ];
        if (this.address.data.suggestions.length) {
          this.regionId =
            this.address.data.suggestions[0].data.city_kladr_id?.substr(0, 2) ||
            this.address.data.suggestions[0].data.kladr_id?.substr(0, 2);
          await this.$store.dispatch("map/fetchRegion", {
            id: this.regionId,
            coords: coords ? coords : this.centerCoords,
          });
        } else {
          this.regionId = null;
        }
        this.myClusterer?.removeAll();

        // let offices = this.getOfficesByCity;

        // if (this.currentFilters) {
        //   offices = filterData(this.getOfficesByCity, this.currentFilters);
        // }

        this.myClusterer.add(this.getGeoObjects(offices));
        this.myMap.geoObjects.add(this.myClusterer);
      } catch (e) {
        console.log(e);
      }
      // if (this.currentFilters) {
      //   this.filteredOffices = filterData(
      //     this.getOfficesByCity,
      //     this.currentFilters
      //   );
      // }
      let showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then(function (res, context) {
        let obj = res.geoObjects.get(0);
        if (obj) {
          showResult(obj);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
