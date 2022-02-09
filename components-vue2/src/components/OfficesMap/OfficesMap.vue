<template>
  <div
    @mousedown="setMouseCoords"
    @mouseup="removeListener"
    class="map-container mt-3"
  >
    <div class="container">
      <h5>Найдите офис рядом с вами</h5>
      <div class="office-block">
        <div class="row align-items-center mh-1">
          <div class="col-5">
            <input type="text" id="suggest" />
            <div v-if="suggest && !getOffices">
              По вашему запросу ничего не найдено. Попробуйте изменить критерии
              поиска
            </div>
          </div>
          <div class="col-7">
            <FilterComponent :filters="filters" @update="filterOffices" />
          </div>
        </div>
      </div>
    </div>
    <Notification :notification="notification" />
    <b-tabs
      ref="tabs"
      content-class="mt-3 office-tab-content"
      nav-class="office-tabs text-center mt-3"
      pills
    >
      <b-tab
        title="На карте"
        active
        title-item-class="office-on-map"
        content-class="maps-block"
        ><div ref="map" id="map" class="map"></div
      ></b-tab>
      <b-tab
        v-if="tabVisible"
        @click="getOfficesCount"
        title="На схеме метро"
        title-item-class="office-on-undeground"
      >
        <div class="metrowrapper">
          <div>
            <Mosmetro ref="metro" @click="chooseStation" />
            <div v-show="cardVisible" ref="card" class="card">
              <metro-office-card
                @close="circleClicked = false"
                :offices="stationOffices"
              />
            </div>
          </div>
          <ZoomComponent @zoom="zoom" />
        </div>
      </b-tab>
      <b-tab title="В списке" title-item-class="office-on-lists">
        <OfficesList v-if="regionId" :data="getOffices" />
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
import ZoomComponent from "./ZoomComponent.vue";
import OfficesList from "./OfficesList.vue";
import MetroOfficeCard from "./MetroOfficeCard.vue";
import { filters, filterData } from "../../../../utils/map/filters";
import { BTabs, BTab, BButtonGroup, BButton } from "bootstrap-vue";
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
    BButtonGroup,
    BButton,
    ZoomComponent,
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
      oldPosX: null,
      oldPosY: null,
      curPosX: null,
      curPosY: null,
    };
  },
  async created() {
    try {
      await this.$store.dispatch("map/fetchRegion", {
        id: this.$store.getters["map/getDefaultRegion"],
        coords: this.$store.getters["map/getDefaultCoords"],
      });
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
  mounted() {
    this.getOfficesCount();
  },
  methods: {
    getOfficesCount() {
      let g = document.getElementsByTagName("g");
      if (g && g[0]) {
        let str = g[0].innerHTML;
        str = str.replace(
          /(<circle[^>]*>(.*?)<\/circle[^>]*><text[^>]*>(.*?)<\/text[^>]*>)/g,
          (match) => {
            let officesByStation = [];
            let originalString = match;
            let textNode = match.match(/<text[^>]*>(.*?)<\/text[^>]*>/);
            let stationName = match.match(/(?<=text[^>]*>)(.*?)(?=<\/text>)/g);
            if (textNode) {
              if (!textNode[0].includes('fill="#fff"')) {
                textNode = textNode[0].replace(
                  /(fill=['"])(.+?)['"]/g,
                  "fill='black'"
                );
              }
            }
            match = match.replace(/<text[^>]*>(.*?)<\/text[^>]*>/, textNode);
            let offices = this.$store.getters["map/getRegionOffices"];
            offices.forEach((office) => {
              let candidate = office.IDUNDERGROUND.find((item) => {
                if (item.SNAME.includes(", ")) {
                  return item.SNAME.split(", ").includes(stationName[0]);
                } else {
                  return item.SNAME === stationName[0];
                }
              });
              if (candidate) {
                officesByStation.push(office);
              }
            });
            if (officesByStation.length) {
              match = match.replace(
                /(?<=text[^>]*>)(.*?)(?=<\/text>)/g,
                `${officesByStation.length}`
              );
              let cx = match.match(/(cx=['"])(.+?)['"]/g);
              let cy = match.match(/(cy=['"])(.+?)['"]/g);
              let numberPattern = /-?\d+(\.\d+)?/g;
              let cxValue = (cx[1] ? cx[1] : cx[0]).match(numberPattern);
              let cyValue = (cy[1] ? cy[1] : cy[0]).match(numberPattern);
              match = match.replace(
                /((?<!c)x=['"])(.+?)['"]/g,
                `x=${parseFloat(cxValue[0]) - 4}`
              );
              match = match.replace(
                /((?<!c)y=['"])(.+?)['"]/g,
                `y=${parseFloat(cyValue[0]) + 5}`
              );
              match = `${match.replace(/(r=['"])(.+?)['"]/g, 'r="15"')}`;
            }
            return originalString + match;
          }
        );
        g[0].innerHTML = str;
      }
    },
    setMouseCoords(e) {
      // e.preventDefault();
      this.curPosX = e.clientX;
      this.curPosY = e.clientY;
      if (this.oldPosX) {
        this.curPosX = e.clientX - parseInt(this.oldPosX);
        this.curPosY = e.clientY - parseInt(this.oldPosY);
      }
      // document.addEventListener("mousemove", this.onMouseMove);
    },
    removeListener(e) {
      document.removeEventListener("mousemove", this.onMouseMove);
    },
    onMouseMove(e) {
      let svg = document.querySelector("svg");
      svg.style.left = e.clientX - this.curPosX + "px";
      svg.style.top = e.clientY - this.curPosY + "px";
      this.oldPosX = svg.style.left;
      this.oldPosY = svg.style.top;
    },
    zoom(param) {
      let scale;
      let transform = this.$refs.metro.getAttribute("transform");
      if (param == "+") {
        scale = "scale(2)";
        if (transform) {
          transform = transform.split("");
          transform[6] = +transform[6] + 1;
          scale = transform.join("");
        }
      } else if (param == "-") {
        if (!transform || transform == "scale(1)") return;
        transform = transform.split("");
        transform[6] = +transform[6] - 1;
        scale = transform.join("");
      } else {
        scale = "scale(1)";
      }
      this.$refs.metro.setAttribute("transform", scale);
    },
    chooseStation(e) {
      let stationName;
      this.stationOffices = [];
      if (e.target.tagName == "circle") {
        stationName = e.target.previousSibling.innerHTML;
      } else if (e.target.tagName == "text") {
        if (e.target.closest("text").innerHTML.length == 1) {
          stationName =
            e.target.closest("text").previousSibling.previousSibling.innerHTML;
        }
      }
      this.circleClicked = true;
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
      this.$refs["card"].style.top = e.offsetY + "px";
      this.$refs["card"].style.left = e.offsetX + "px";
    },
    async init(_, filters) {
      this.initSuggestView();
      let agencies = this.$store.getters["map/getRegionOffices"];
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
          center: this.centerCoords
            ? this.centerCoords
            : this.$store.getters["map/getDefaultCoords"],
          zoom: 12,
        };
      }

      this.myMap = new ymaps.Map("map", mapState);
      this.myMap.geoObjects.add(this.myClusterer);
    },
    getTemplate(agency) {
      return `
      <div class="offices">
        <div class="card-body">
          <h4 class="card-title">${agency.SSHORTNAME}</h4>
          <div class="card-office-adress row">
            <div class="col-4">
              <img  src="">
            </div>
            <div class="col-8">
              <div>${agency.SADDRESS}</div>
              <div class="card-office-opened">Открыт до</div>
            </div>
          </div>
          <div class="card-office-undeground">
            <span  class="undeground-color"></span>
            <span>Ленинский проспект</span>
            <span class="card-office-distance"> 1.5 км </span>
          </div>
          <div class="card-office-time">
            <button type="button">Режим работы:</button>
            <div class="card-office-times">${agency.SGRAF}</div>
          </div>
          <div class="card-office-contacts">
            <div class="card-office-phone">
              <a href="tel:${agency.SPHONE}">${agency.SPHONE}</a>
            </div>
            <div>
              <a  href="mailto:${agency.SPHONE}" class="card-office-e-mail">${agency.SPHONE}</a>
            </div>
          </div>
        </div>
      </div>

        `;
    },
    combineAgencies(agencies, i, count) {
      let arr = [];
      agencies.slice(i, i + count).forEach((item) => {
        arr.push(this.getTemplate(item));
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
        myGeoObjects[i] = new ymaps.GeoObject({
          geometry: {
            type: "Point",
            coordinates: [agencies[i].NLAT, agencies[i].NLONG],
          },
          properties: {
            balloonContentBody: this.combineAgencies(
              agencies,
              i,
              uniqueItemsCount[agencies[i].NLAT]
            ),
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
        this.myClusterer?.removeAll();

        this.myClusterer.add(
          this.getGeoObjects(this.$store.getters["map/getRegionOffices"])
        );
        this.myMap.geoObjects.add(this.myClusterer);
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
    },
  },
  computed: {
    cardVisible() {
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
      return this.regionId == 77 || this.regionId == 78;
    },
  },
};
</script>

<style scoped lang="scss">
body {
  margin: 0;
  padding: 0;
}
/*.map {
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
}*/
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

.metrowrapper {
  display: flex;
  align-items: center;
  & > div {
    position: relative;
    > svg {
      position: absolute;
    }
  }
}

.test:after {
  content: "dsfdsf";
}
</style>
