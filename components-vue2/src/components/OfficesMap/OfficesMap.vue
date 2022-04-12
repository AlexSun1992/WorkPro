<template>
  <div
    @mousedown="setMouseCoords"
    @mouseup="removeListener"
    class="map-container mt-3"
  >
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
          </div>
          <div class="col-12 col-lg-7">
            <FilterComponent :filters="filters" @update="filterOffices" />
          </div>
        </div>
      </div>
    </div>

    <div v-show="getOffices && getOffices.length == 0">
      <div class="row search-result-row">
        <div class="col-md-12 col-12 search-results">
          <div class="search-no-result">
            <div class="search-no-result-img"></div>
            <div class="search-no-result-txt">
              По вашему запросу ничего не найдено
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-tabs
      v-show="getOffices && getOffices.length > 0"
      v-model="currentTab"
      ref="tabs"
      content-class="office-tab-content"
      nav-class="office-tabs text-center mt-3"
      pills
    >
      <b-tab
        title="На карте"
        title-item-class="office-on-map"
        content-class="maps-block"
        @click="fitToViewport"
      >
        <div ref="map" id="map" class="map"></div>
      </b-tab>
      <b-tab
        @click="setStatus"
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
                @close="closeCard"
                :offices="stationOffices"
              />
            </div>
          </div>
          <ZoomComponent @zoom="zoom" />
        </div>
      </b-tab>
      <b-tab title="В списке" title-item-class="office-on-lists">
        <OfficesList
          :station="currentStation"
          :mobile="width < 900"
          :data="offices"
          @open="openOnMap"
          @showMore="isShownMore = $event"
        />

        <!-- <Paginator
          v-if="getOffices && width > 900 && !currentStation"
          class="container"
          @update="page = $event"
          :items-count="getOffices.length"
          :pages-count="pagesCount"
        /> -->

        <b-pagination
          v-show="getOffices && width > 900 && !currentStation"
          v-model="page"
          :total-rows="getOffices && getOffices.length"
          :per-page="15"
          aria-controls="my-table"
          first-number
          last-number
          class="container mt-3"
          next-class="next"
          prev-class="prev"
          next-text="Вперед"
          prev-text="Назад"
        ></b-pagination>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Paginator from "./Paginator.vue";
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
import { BPagination } from "bootstrap-vue";
import Cookies from "js-cookie";
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
    Paginator,
    BPagination,
  },
  props: ["notification", "mobile"],
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
      componentKey: 0,
      placemark: null,
      city: "",
      width: window.innerWidth,
      pagesCount: 15,
      isShownMore: false,

      perPage: 3,
      currentPage: 1,
      height: window.innerHeight,
    };
  },
  async created() {
    try {
      window.addEventListener("resize", this.onResize);
      if (Cookies.get("lat")) {
        await this.$store.dispatch("map/fetchRegion", {
          id: Cookies.get("kladr_id")?.substr(0, 2),
          coords: [Cookies.get("lat"), Cookies.get("lon")],
        });
      } else {
        await this.$store.dispatch("map/fetchRegion", {
          id: this.$store.getters["map/getDefaultRegion"],
          coords: this.$store.getters["map/getDefaultCoords"],
        });
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
  mounted() {
    window.document.addEventListener("on_city_change", () => {
      console.log("city changed");
    });
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    fitToViewport() {
      this.$nextTick(() => {
        this.myMap.container.fitToViewport();
      });
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    closeCard() {
      this.circleClicked = false;
      this.setStatus();
    },
    isOpened(office) {
      let dateNow = new Date();
      let day = dateNow.getDay();
      let dateEnd = new Date();
      day = day == 0 ? 7 : day;
      if (office.GRAF && office.GRAF[day - 1]) {
        const [endHour, endMinute] = office.GRAF[day - 1]?.SEND.split(".");
        dateEnd.setHours(endHour);
        dateEnd.setMinutes(endMinute);
        let isOpened = true;
        if (dateNow > dateEnd) {
          isOpened = false;
        }
        return isOpened;
      }
    },
    setStatus() {
      let g = document.getElementsByTagName("g");
      if (g && g[0]) {
        let offices = this.$store.getters["map/getRegionOffices"];
        for (let i = 0; i < g[0].children.length; i++) {
          if (g[0].children[i].tagName === "use") {
            let name = g[0].children[i].dataset.station;
            offices.forEach((office) => {
              let candidate = office.IDUNDERGROUND.find((item) => {
                return item.SNAME === name;
              });
              if (candidate) {
                if (!this.isOpened(office) && office.GRAF) {
                  g[0].children[i].setAttribute("href", "#balloon-close");
                } else {
                  g[0].children[i].setAttribute("href", "#balloon-open");
                }
              }
            });
          }
        }
      }
    },

    clearStation(e) {
      if (e.target.value == "") {
        this.isInputEmpty = true;
        this.useElement?.setAttribute("x", -1000);
        this.useElement?.setAttribute("y", -1000);
        this.myMap.geoObjects.remove(this.placemark);
        this.currentStation = "";
      } else {
        this.isInputEmpty = false;
      }
      this.setStatus();
    },
    clear() {
      this.myMap.geoObjects.remove(this.placemark);
      this.$refs.search.value = "";
      this.isInputEmpty = true;
      this.useElement?.setAttribute("x", -1000);
      this.useElement?.setAttribute("y", -1000);
      this.setStatus();
      this.currentStation = "";
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
      console.log(e);
      this.curPosX = e.clientX;
      this.curPosY = e.clientY;
      console.log("X=", e.clientX, "Y=", e.clientY);
      if (this.oldPosX) {
        this.curPosX = e.clientX - parseInt(this.oldPosX);
        this.curPosY = e.clientY - parseInt(this.oldPosY);
      }
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
      if (e.target.tagName == "use") {
        console.log("aaa");
        this.setStatus();
        e.target.setAttribute("href", "#balloon-select");
        this.stationOffices = [];
        this.circleClicked = true;
        let stationName = e.target.dataset.station;
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
        this.stationOffices.sort((a, b) => {
          return a.NORDER - b.NORDER;
        });
        console.log("layerY=", e.layerY, "layerX=", e.layerX);
        this.$refs["card"].style.top = e.layerY + "px";
        this.$refs["card"].style.left = e.layerX + "px";
        console.log("this.width=", this.width);
        if (e.clientX + 400 > this.width) {
          console.log();
          this.$refs["card"].style.left = e.layerX - 375 + "px";
          /*          this.$refs["card"].style.left = this.width - 375 + "px";*/
        }
        if (parseInt(this.$refs["card"].style.top) + 640 > this.height) {
          this.$refs["card"].style.top = this.height - 640 + "px";
        }
      }
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
      if (!this.currentFilters) {
        await this.$store.dispatch("map/fetchRegion", {
          id: this.regionId,
          coords: this.centerCoords,
        });
      }

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
      this.myMap.geoObjects.events.add("balloonopen", (e) => {
        const target = e.get("target");
        target.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
        );
      });

      this.myMap.geoObjects.events.add("balloonclose", (e) => {
        const target = e.get("target");
        target?.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
        );
      });
      this.setPlaceholder();
    },
    getTemplate(agency) {
      let phonesArr = agency.SPHONE?.split(";");
      let grafArr = agency.SGRAF?.split("\n");
      phonesArr?.pop();
      grafArr?.pop();
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
            <span class="undeground-color"></span>
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
          phonesArr?.forEach((phone) => {
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
        /<div class="card-office-undeground">[\n\s]*?<span class="undeground-color"><\/span>[\n\s]*?<span>Ленинский проспект<\/span>[\n\s]*?<span class="card-office-distance"> 1.5 км <\/span>[\n\s]*?<\/div>/,
        () => {
          let temp = "";
          if (agency.IDUNDERGROUND.length > 0) {
            temp += `<div class="card-office-undeground">`;
            agency.IDUNDERGROUND.forEach((item) => {
              temp += `<div>
                    <span class=${
                      "undeground-color_" + item.IDUNDERLINE
                    }></span>
                    <span>${item.SNAME}</span>
                    <span class="card-office-distance"> 1.5 км </span>
                    </div>
                  `;
            });
            temp += "</div>";
          } else {
            temp = "";
          }

          return temp;
        }
      );

      template = template.replace(
        /<div class="col-8">[\n\s]*?<div>[\n\s]*?(.*?)[\n\s]*?<\/div>[\n\s]*?<div class="card-office-opened">[\n\s]*?Открыт до[\n\s]*?<\/div>[\n\s]*?<\/div>/,
        () => {
          return agency.SPATH1
            ? `<div class="col-8">
                  <div>${agency.SADDRESS}</div>
                  <div class="card-office-opened">${this.showWorkingHours(
                    agency
                  )}</div>
                </div>`
            : `<div class="col-12">
                <div>${agency.SADDRESS}</div>
                <div class="card-office-opened">${this.showWorkingHours(
                  agency
                )}</div>
            </div>`;
        }
      );
      return template;
    },
    showWorkingHours(agency) {
      let dateNow = new Date();
      let day = dateNow.getDay();
      let dateEnd = new Date();
      day = day == 0 ? 7 : day;

      if (!agency.GRAF) return "";

      if (agency.GRAF[day - 1]) {
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
      }
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
              balloonPane: "outerBalloon",
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
      let _this = this;
      func._this = this;
      function func(e) {
        if (e.get("item").value.includes("метро")) {
          _this.currentStation = e.get("item").value.split(" метро")[1].trim();
          let maps = document.querySelectorAll(".maps");
          for (let i = 0; i < maps[0].children.length; i++) {
            if (
              maps[0].children[i].tagName === "use" &&
              maps[0].children[i].dataset.station === _this.currentStation
            ) {
              maps[0].children[i].setAttribute("href", "#balloon-select");
            }
          }
        }
        showOnMap(e.get("item").value);
      }
      this.suggestView.events.add("select", func);
    },

    async setPositionAttributes() {
      let lat = +Cookies.get("lat");
      if (!lat) {
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
                this.address.data.suggestions[0].data.city_kladr_id.substr(
                  0,
                  2
                );
              this.city = this.address.data.suggestions[0].data.city;
            }
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        this.city = Cookies.get("location_user");
        this.regionId = Cookies.get("kladr_id")?.substr(0, 2);
      }
    },
    updateMap(state, caption, zoom = 12, visibility) {
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
      this.myMap.setCenter(state.center, zoom);
      this.placemark.geometry.setCoordinates(state.center);
      this.placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
        balloonPane: "outerBalloon",
        balloonShadowPane: "outerBalloon",
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
        this.city = this.address.data.suggestions[0].data.city;
        if (this.address.data.suggestions.length) {
          this.regionId =
            this.address.data.suggestions[0].data.city_kladr_id.substr(0, 2);
          await this.$store.dispatch("map/fetchRegion", {
            id: this.regionId,
            coords: coords ? coords : this.centerCoords,
          });
        } else {
          this.regionId = null;
        }
        this.myClusterer?.removeAll();
        this.myClusterer.add(this.getGeoObjects(this.getOfficesByCity));
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
    cityData() {
      return this.$store.getters["map/getCity"];
    },
    getOfficesByCity() {
      return this.$store.getters["map/getRegionOffices"]?.filter((office) => {
        return office.SADDRESS.includes(`${this.city}`);
      });
    },
    cardVisible() {
      return this.circleClicked && this.stationOffices.length;
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
      this.componentKey += 1;
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
          if (this.page) {
            this.page -= 1;
          }
          let start = this.page * this.pagesCount;
          let end = start + this.pagesCount;
          this.page = null;
          if (this.currentStation) {
            let filteredByStation = [];
            this.getOffices.forEach((item) => {
              item.IDUNDERGROUND.forEach((station) => {
                if (station.SNAME.includes(this.currentStation)) {
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
      return this.regionId == 77 || this.regionId == 78;
    },
  },

  watch: {
    cityData() {
      this.showOnMap(
        this.$store.getters["map/getCity"]?.city,
        this.$store.getters["map/getCity"]?.coords
      );
    },
  },
};
</script>

<style scoped lang="scss">
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
</style>
