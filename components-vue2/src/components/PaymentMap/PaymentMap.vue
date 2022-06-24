<template>
  <div class="map-container mt-3">
    <div class="container">
      <div class="office-block">
        <button
          type="button"
          :class="{ selected: currentFilters && currentFilters.length }"
          class="office-filter"
        ></button>
        <div class="row align-items-center mh-1">
          <div class="col-12 col-lg-5">
            <div class="position-relative">
              <input type="text" id="suggest" ref="search" />
              <button v-show="!isInputEmpty" class="suggest-clear"></button>
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
    openOnMap(e) {
      this.myMap.geoObjects.remove(this.placemark);
      this.updateMap(
        {
          center: [e.NLAT, e.NLONG],
          zoom: 15,
        },
        e.SADDRESS,
        20,
        true
      );
    },

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
      await this.setPositionAttributes();

      this.myClusterer = new ymaps.Clusterer({
        preset: "islands#darkGreenClusterIcons",
      });

      this.myClusterer.add(this.getGeoObjects(agencies));

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
      this.myMap.geoObjects.add(this.myClusterer);
      let body = document.getElementsByTagName("body")[0];
      this.myMap.geoObjects.events.add("balloonopen", (e) => {
        body.classList.add("open-balloon");
        const target = e.get("target");
        target.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
        );
      });

      this.myMap.geoObjects.events.add("balloonclose", (e) => {
        body.classList.remove("open-balloon");
        const target = e.get("target");
        target?.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
        );
      });
      this.setPlaceholder();
    },

    combineAgencies(agencies, i, count) {
      let arr = [];
      let slicedAgencies = agencies.slice(i, i + count);
      slicedAgencies.sort((a, b) => {
        if (!a.NORDER) a.NORDER = 0;
        if (!b.NORDER) b.NORDER = 0;
        return a.NORDER - b.NORDER;
      });
      slicedAgencies.forEach((item) => {
        arr.push(getTemplate(item));
      });
      return arr;
    },
    getGeoObjects(agencies) {
      let myGeoObjects = [];

      let uniqueItemsCount = agencies.reduce((acc, item) => {
        acc[item["NLAT"]] = (acc[item["NLAT"]] || 0) + 1;
        return acc;
      }, {});

      for (let i = 0; i < agencies.length; i++) {
        myGeoObjects[i] = new ymaps.GeoObject(
          {
            geometry: {
              type: "Point",
              coordinates: [agencies[i].NLAT, agencies[i].NLONG],
            },
            properties: {
              balloonContentBody: this.combineAgencies(
                agencies,
                i,
                uniqueItemsCount[agencies[i].NLAT]
              ).join(""),

              hintContent: `${agencies[i].SSHORTNAME}`,
              balloonShadowPane: "outerBalloon",
            },
          },
          {
            hideIconOnBalloonOpen: false,
            iconLayout: "default#image",
            iconImageHref:
              "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
            iconImageSize: [56, 56],
            iconImageOffset: [0, 0],
          }
        );
      }

      return myGeoObjects;
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

    async setPositionAttributes() {
      let lat = +Cookies.get("lat");
      if (!this.suggest && lat) {
        this.city = Cookies.get("location_user");
        this.regionId = Cookies.get("kladr_id")?.substr(0, 2);
      }
    },
    updateMap(state, caption, zoom = 12, visibility = true) {
      this.placemark = new ymaps.Placemark(
        this.myMap.getCenter(),
        {
          iconCaption: caption,
          balloonContent: caption,
          balloonPane: "outerBalloon",
          balloonShadowPane: "outerBalloon",
        },
        {
          preset: "islands#redDotIconWithCaption",
          visible: visibility,
          openBalloonOnClick: false,
        }
      );
      this.myMap.geoObjects.add(this.placemark);

      if (!this.cityHasOffices) {
        zoom = 7;
      }

      this.myMap.setCenter(
        this.centerCoords && !this.isMetroSuggest && !state.center
          ? this.centerCoords
          : state.center,
        this.qc_geo > 2 && !this.isMetroSuggest ? zoom : 15
      );
      this.placemark.geometry.setCoordinates(
        this.centerCoords && !this.isMetroSuggest && !state.center
          ? this.centerCoords
          : state.center
      );
      this.placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });
    },
    showResult(obj) {
      let mapContainer = document.getElementById("map");
      let bounds = obj.properties.get("boundedBy");
      this.mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [
        mapContainer.clientWidth,
        mapContainer.clientHeight,
      ]);
      let shortAddress = [
        obj.getThoroughfare(),
        obj.getPremiseNumber(),
        obj.getPremise(),
      ].join(" ");
      this.updateMap(this.mapState, shortAddress);
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

        let offices = this.getOfficesByCity;

        if (this.currentFilters) {
          offices = filterData(this.getOfficesByCity, this.currentFilters);
        }

        this.myClusterer.add(this.getGeoObjects(offices));
        this.myMap.geoObjects.add(this.myClusterer);
      } catch (e) {
        console.log(e);
      }
      if (this.currentFilters) {
        this.filteredOffices = filterData(
          this.getOfficesByCity,
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
        this.getOfficesByCity,
        this.currentFilters
      );
      let _;
      this.init(_, filters);
    },
    setPlaceholder() {
      if (this.regionId == 77 || this.regionId == 78) {
        this.$refs.search.placeholder = "Введите адрес или метро";
      } else {
        this.$refs.search.placeholder = "Введите адрес";
      }
    },
  },
  computed: {
    getLoading() {
      return this.$store.getters["map/getLoading"];
    },
    cityData() {
      return this.$store.getters["map/getCity"];
    },
    getOfficesByCity() {
      const filteredOffices = this.$store.getters[
        "map/getRegionOffices"
      ]?.filter((office) => {
        return office.SADDRESS.includes(`${this.city}`);
      });

      if (filteredOffices?.length) {
        return filteredOffices;
      }
      return this.$store.getters["map/getRegionOffices"];
    },

    getOffices() {
      let data;
      if (this.filteredOffices) {
        data = this.filteredOffices;
      } else {
        data = this.getOfficesByCity;
      }

      if (!this.regionId) {
        data = null;
      }
      data = data?.sort((a, b) => {
        return a.NDISTANSE - b.NDISTANSE;
      });
      return data;
    },
    offices() {
      if (this.width < 900) {
        let officesArr = [];
        let countedOffices = this.getOffices?.reduce((acc, office) => {
          if (office.IDUNDERGROUND.length > 0) {
            office.IDUNDERGROUND.forEach((metroObj) => {
              let stationsArr = [];
              if (metroObj.SNAME.includes(",")) {
                stationsArr = metroObj.SNAME.split(", ");
                stationsArr.forEach((station) => {
                  if (acc[station]) {
                    acc[station].push(office);
                  } else {
                    acc[station] = [office];
                  }
                });
              } else {
                if (acc[metroObj.SNAME]) {
                  acc[metroObj.SNAME].push(office);
                } else {
                  acc[metroObj.SNAME] = [office];
                }
              }
            });
          } else {
            officesArr.push({
              station: "",
              info: [office],
            });
          }
          return acc;
        }, {});

        for (let key in countedOffices) {
          officesArr.push({
            station: key,
            info: countedOffices[key],
          });
        }

        officesArr = officesArr?.sort((a, b) => {
          return a.info[0].NDISTANSE - b.info[0].NDISTANSE;
        });

        if (this.currentStation) {
          officesArr = officesArr.filter((item) => {
            return item.station == this.currentStation;
          });
        }
        if (!this.isShownMore) {
          return officesArr.slice(0, 6);
        } else {
          return officesArr;
        }
      } else {
        if (this.getOffices) {
          let start = (this.page - 1) * this.pagesCount;
          let end = start + this.pagesCount;
          if (this.currentStation) {
            let filteredByStation = [];
            this.getOffices.forEach((item) => {
              item.IDUNDERGROUND.forEach((s) => {
                let station = s.SNAME.toLowerCase().replace("ё", "е");
                let currentStation = this.currentStation
                  .toLowerCase()
                  .replace("ё", "е");
                if (
                  station === currentStation &&
                  station.length === currentStation.length
                ) {
                  filteredByStation.push(item);
                }
              });
            });
            return filteredByStation;
          }
          return this.getOffices.slice(start, end);
        }
      }
    },

    tabVisible() {
      return this.regionId == 77;
    },
  },

  watch: {
    async cityData() {
      this.myMap.geoObjects.remove(this.placemark);
      await this.$store.dispatch("map/fetchRegion", {
        id: this.$store.getters["map/getCity"]?.city,
        coords: this.$store.getters["map/getCity"]?.coords,
      });
      this.showOnMap(
        this.$store.getters["map/getCity"]?.city,
        this.$store.getters["map/getCity"]?.coords
      );
    },
    getOfficesByCity(offices) {
      const filteredOffices = offices.filter((office) => {
        return office.SADDRESS.includes(`${this.city}`);
      });
      if (filteredOffices.length == 0) {
        this.cityHasOffices = false;
      } else {
        this.cityHasOffices = true;
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
