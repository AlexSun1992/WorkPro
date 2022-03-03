<template>
  <div
    @mousedown="setMouseCoords"
    @mouseup="removeListener"
    class="map-container mt-3"
  >
    <div class="container">
      <div class="office-block">
        <button type="button" class="office-filter"></button>
        <div class="row align-items-center mh-1">
          <div class="col-12 col-lg-5">
            <div class="position-relative">
              <input
                type="text"
                @input="clearStation"
                id="suggest"
                ref="search"
              />
              <button
                v-show="!isInputEmpty"
                @click="clear"
                class="suggest-clear"
              ></button>
            </div>
            <!-- <div v-if="suggest && !getOffices">
              По вашему запросу ничего не найдено. Попробуйте изменить критерии
              поиска
            </div> -->
          </div>
          <div class="col-12 col-lg-7">
            <FilterComponent :filters="filters" @update="filterOffices" />
          </div>
        </div>
      </div>
    </div>
    <!-- <Notification :notification="notification" /> -->
    <b-tabs
      v-model="currentTab"
      ref="tabs"
      content-class="mt-3 office-tab-content"
      nav-class="office-tabs text-center mt-3"
      pills
    >
      <b-tab
        title="На карте"
        title-item-class="office-on-map"
        content-class="maps-block"
        ><div ref="map" id="map" class="map"></div
      ></b-tab>
      <b-tab
        v-if="tabVisible"
        title="На схеме метро"
        title-item-class="office-on-undeground"
      >
        <div class="metrowrapper">
          <div>
            <Mosmetro ref="metro" @click="chooseStation" />
            <div v-show="cardVisible" ref="card" class="card">
              <metro-office-card
                @open="openOnMap"
                @close="circleClicked = false"
                :offices="stationOffices"
              />
            </div>
          </div>
          <ZoomComponent @zoom="zoom" />
        </div>
      </b-tab>
      <b-tab title="В списке" title-item-class="office-on-lists">
        <OfficesList v-if="regionId" :data="getOffices" @open="openOnMap" />
        <div v-else>
          По вашему запросу ничего не найдено. Попробуйте изменить критерии
          поиска
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { BFormInput } from "bootstrap-vue";
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
    BFormInput,
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
      currentTab: 0,
      suggestView: null,
      currentStation: null,
      useElement: null,
      isInputEmpty: true,
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
  methods: {
    clearStation(e) {
      if (e.target.value == "") {
        this.isInputEmpty = true;
        this.useElement.setAttribute("x", -1000);
        this.useElement.setAttribute("y", -1000);
      } else {
        this.isInputEmpty = false;
      }
    },
    clear() {
      this.$refs.search.value = "";
      this.isInputEmpty = true;
      this.useElement.setAttribute("x", -1000);
      this.useElement.setAttribute("y", -1000);
    },
    openOnMap(e) {
      this.currentTab = 0;
      this.updateMap(
        {
          center: [e.NLAT, e.NLONG],
          zoom: 15,
        },
        e.SADDRESS,
        20,
        false
      );
    },
    getPhones(phones) {
      let phonesArr = phones.split(";");
      phonesArr.pop();
      return phonesArr;
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
        this.$refs["card"].style.top = e.layerY + "px";
        this.$refs["card"].style.left = e.layerX + "px";
        debugger;
        console.log(e.target);
      }
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
          controls: [],
        };
      }

      this.myMap = new ymaps.Map("map", mapState, {
        yandexMapDisablePoiInteractivity: true,
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
    },
    getTemplate(agency) {
      let phonesArr = agency.SPHONE.split(";");
      let grafArr = agency.SGRAF.split("\n");
      let email;
      phonesArr.pop();
      grafArr.pop();
      let template = `
        <div class="card-body">
          <h4 class="card-title">${agency.SSHORTNAME}</h4>
          <div class="card-office-adress row">
            <div class="col-4 pe-0">
              <div class="position-relative">
                <img src="" />
                <button class="office-image-zoom" type="button"></button>
              </div>
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
            <a href="tel:${agency.SPHONE}">${agency.SPHONE}</a>
            <div>
              <a href="mailto:${agency.SEMAIL}" class="card-office-e-mail">${agency.SEMAIL}</a>
            </div>
          </div>
        </div>`;
      template = template.replace(
        /<div class="card-office-times">[^<]*?<\/div[^>]*>\n/g,
        () => {
          let temp = "";
          grafArr.forEach((graf) => {
            temp += `<div class="card-office-times">${graf}</div>`;
          });
          return temp;
        }
      );
      template = template.replace(
        /<a href="tel:[^"]*">(.*?)<\/a[^>]*>/g,
        () => {
          let temp = "";
          phonesArr.forEach((phone) => {
            temp += `<div class="card-office-phone"><a href="tel:${phone}">${phone}</a></div>`;
          });
          return temp;
        }
      );
      template = template.replace(
        /<a href="mailto:[^"].+? class="card-office-e-mail">(.*?)<\/a[^>]*?>/g,
        () => {
          return agency.SEMAIL
            ? `<div><a href="mailto:${agency.SEMAIL}" class="card-office-e-mail">${agency.SEMAIL}</a></div>`
            : "";
        }
      );
      template = template.replace(
        /<div class="col-4 pe-0">[\n\s]*?<div class="position-relative">[\n\s]*?<img src="" \/>[\n\s]*?<button class="office-image-zoom" type="button"><\/button>[\n\s]*?<\/div>[\n\s]*?<\/div[^>]*>/g,
        () => {
          let url =
            "https://www.reso.ru/export/sites_reso/" + `${agency.SPATH1}`;
          return agency.SPATH1
            ? `<div class="col-4 pe-0"><div class="position-relative"><img src=${url} /><button class="office-image-zoom" type="button"></button></div></div>`
            : "";
        }
      );

      template = template.replace(
        /<div class="card-office-opened">Открыт до<\/div[^>]*>\n/g,
        () => {
          return `<div class="card-office-opened">${this.showWorkingHours(
            agency
          )}</div>`;
        }
      );
      return template;
    },
    showWorkingHours(agency) {
      let dateNow = new Date();
      let day = dateNow.getDay();
      let dateEnd = new Date();
      day = day == 0 ? 7 : day;

      if (!agency.GRAF) return;
      const [endHour, endMinute] = agency.GRAF[day - 1]?.SEND.split(".");
      dateEnd.setHours(endHour);
      dateEnd.setMinutes(endMinute);
      let str;
      if (dateNow < dateEnd) {
        str = `Открыт до ${dateEnd.getHours()}:${
          dateEnd.getMinutes() == 0
            ? dateEnd.getMinutes() + "0"
            : dateEnd.getMinutes()
        }`;
      } else if (dateNow > dateEnd && agency.GRAF[day]) {
        str = `Откроется завтра в ${agency.GRAF[day].SBEGIN}`;
      } else if (dateNow > dateEnd && !agency.GRAF[day]) {
        this.isOpened = false;
        dateNow.setDate(
          dateNow.getDate() + ((1 + 7 - dateNow.getDay()) % 7 || 7)
        );
        str =
          "Закрыт до " +
          ("0" + dateNow.getDate()).slice(-2) +
          "." +
          ("0" + (dateNow.getMonth() + 1)).slice(-2) +
          "." +
          dateNow.getFullYear();
      }
      return str;
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
      this.suggestView = new ymaps.SuggestView("suggest");
      if (this.myMap) {
        this.myMap.destroy();
        this.suggestView.destroy();
      }
      let showOnMap = this.showOnMap.bind(this);
      let _this = this;
      func._this = this;
      function func(e) {
        if (e.get("item").value.includes("метро")) {
          _this.currentStation = e.get("item").value.split(" метро")[1].trim();
          let maps = document.querySelectorAll(".maps");
          for (let i = 0; i < maps[0].children.length; i++) {
            if (maps[0].children[i].innerHTML == _this.currentStation) {
              let currentCircle = maps[0].children[i - 1];
              let x = currentCircle.getAttribute("cx");
              let y = currentCircle.getAttribute("cy");
              _this.useElement = maps[0].children[maps[0].children.length - 1];
              _this.useElement.setAttribute("x", x);
              _this.useElement.setAttribute("y", y);
            }
          }
        }
        showOnMap(e.get("item").value);
      }
      this.suggestView.events.add("select", func);
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
    updateMap(state, caption, zoom = 12, visibility) {
      let placemark = new ymaps.Placemark(
        this.myMap.getCenter(),
        {
          iconCaption: caption,
          balloonContent: caption,
        },
        {
          preset: "islands#redDotIconWithCaption",
          visible: visibility,
        }
      );
      this.myMap.geoObjects.add(placemark);
      this.myMap.setCenter(state.center, zoom);
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
// circle:hover {
//   cursor: pointer;
//   r: 15;
// }
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
