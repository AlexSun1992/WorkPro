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

    <b-tabs
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
        v-if="tabVisible"
        title="На схеме метро"
        title-item-class="office-on-undeground"
        @click="fitToViewportMetro"
      >
        <div class="metrowrapper">
          <div
            @touchstart="setTouchCoords"
            @touchend="removeListenerTouch"
            @mousedown="setMouseCoords"
            @mouseup="removeListener"
          >
            <Mosmetro ref="metro" @click="chooseStation" />
          </div>
          <div v-show="cardVisible" ref="card" class="card">
            <metro-office-card
              @open="openOnMap"
              @close="closeCard"
              :offices="stationOffices"
            />
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

        <b-pagination
          v-if="getOffices && getOffices.length > 15"
          v-show="getOffices && width > 900 && !currentStation"
          v-model="page"
          :total-rows="getOffices.length"
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
import Mosmetro from "./mosmetro.svg";
import FilterComponent from "./FilterComponent.vue";
import ZoomComponent from "./ZoomComponent.vue";
import OfficesList from "./OfficesList.vue";
import MetroOfficeCard from "./MetroOfficeCard.vue";
import { filters, filterData } from "../../../../utils/map/filters";
import { BTabs, BTab } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import { BPagination } from "bootstrap-vue";
import Cookies from "js-cookie";
import {
  isOpened,
  getTemplate,
  checkClusterStatus,
} from "../../../../utils/map/helpers";
Vue.use(LoadScript);
export default {
  name: "OfficesMap",
  components: {
    OfficesList,
    FilterComponent,
    BTabs,
    BTab,
    Mosmetro,
    MetroOfficeCard,
    ZoomComponent,
    BPagination,
    checkClusterStatus,
  },
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
      stationOffices: [],
      circleClicked: false,
      oldPosX: null,
      oldPosY: null,
      curPosX: null,
      curPosY: null,
      cardPosY: null,
      cardPosX: null,
      translateX: 0,
      translateY: 0,
      touchX: 0,
      touchY: 0,
      touchstartX: 0,
      touchstartY: 0,
      centerX: null,
      centerY: null,
      mapsFit: false,
      svgScale: 1,
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
      height: window.innerHeight,
      qc_geo: null,
      isMetroSuggest: false,
      cityHasOffices: false,
    };
  },
  async created() {
    try {
      window.addEventListener("resize", this.onResize);

      if (Cookies.get("lat") && Cookies.get("lat") !== 'null') {
        await this.$store.dispatch("map/fetchRegion", {
          id: Cookies.get("kladr_id")?.substr(0, 2),
          coords: [Cookies.get("lat"), Cookies.get("lon")],
        });
      } else {
        console.log('Координаты офиса lat, lon не получены от dadata. Адрес отсутствует в справочнике, либо координаты офиса некорректны')
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
  /*mounted(){
      if (this.width < 900) {
        this.$nextTick(function () {console.log('aaaa');
          let sla = document.querySelector(".g-svg-metromap");
          sla.setAttribute("transform", "matrix(0.5,0,0,0.5,100,0");
          console.log(sla)
        this.svgScale= 0.5;
        })
      }
  },*/
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    fitToViewport() {
      this.$nextTick(() => {
        this.myMap.container.fitToViewport();
      });
    },
    positionSelectBalloon() {
      this.translateX=0;
      this.translateY=0;
      let gsvg = document.querySelector('use[href="#balloon-select"]');
      if (
        document.querySelector('use[href="#balloon-select"]') &&
        this.centerX != null
      ) {
        if (this.$refs.["metro"].clientHeight - 1295 * this.svgScale < 0) {
            let XX = this.$refs.["metro"].clientHeight;
            let XXX = 1295 * this.svgScale;
            let XXXX =  Math.abs(XX  - XXX)/2;
            let XXXXX= gsvg.getAttribute("y")*this.svgScale;
            if (XXXXX < XXXX - this.centerY - (137 * this.svgScale/2)) {
                this.centerY = Math.abs(XXXXX - XXXX + 137 * this.svgScale);
            }
            if(XXXXX >  this.$refs.["metro"].clientHeight-this.centerY) {
                this.centerY = (XX - XXXXX)*2;
            }

          document
            .querySelector(".g-svg-metromap")
            .setAttribute(
              "transform",
              "matrix(" +
                this.svgScale +
                ",0,0," +
                this.svgScale +
                "," +
                this.centerX +
                "," +
                this.centerY +
                ")"
            );
        }

        if (
          document.querySelector(".g-svg-metromap").getAttribute("transform") !=
          null
        ) {
        }
      }
      if(gsvg != null)
      {this.chooseStation({          target: gsvg}        );
      let sla = document.querySelector('use[href="#balloon-select"]').getBoundingClientRect().top - document.querySelector('.svg-metromap').getBoundingClientRect().top+21;
      let slaa = document.querySelector('use[href="#balloon-select"]').getBoundingClientRect().left - document.querySelector('.svg-metromap').getBoundingClientRect().left+21;
      this.$refs["card"].style.top = sla + "px";
      this.$refs["card"].style.left = slaa + "px";
      if (slaa + 400 > this.width) {
          this.$refs["card"].style.left =slaa - 375 + "px";
        }
        if (sla > 500) {
          this.$refs["card"].style.transform = "translateY(-100%)";
        }
        if (sla < 500) {
          this.$refs["card"].style.transform = "translateY(0)";
        }
      }
    },
    fitToViewportMetro() {
      this.$nextTick(() => {
        if (this.width < 992 && this.mapsFit != true) {
          this.svgScale = 0.5;
        } else if (this.width > 1200 && this.mapsFit != true) {
          this.svgScale = 1;
        }

      if (this.mapsFit != true) {
      /*  let g_cX = (document.querySelector('.svg-metromap').getBoundingClientRect().width - document.querySelector('.g-svg-metromap').getBoundingClientRect().width)/2 -document.querySelector('.g-svg-metromap').getBoundingClientRect().x ;
      let g_cY = (document.querySelector('.svg-metromap').getBoundingClientRect().height - document.querySelector('.g-svg-metromap').getBoundingClientRect().height)/2 +document.querySelector('.g-svg-metromap').getBoundingClientRect().y;*/
        this.centerX =
          (this.$refs.metro.clientWidth - 1286 * this.svgScale) / 2 +
          121 * this.svgScale
           + this.translateX;
        this.centerY =
          (this.$refs.metro.clientHeight - 1295 * this.svgScale) / 2 +
          137 * this.svgScale +
          this.translateY;
      document
          .querySelector(".g-svg-metromap")
          .setAttribute(
            "transform",
            "matrix(" +
              this.svgScale +
              ",0,0," +
              this.svgScale +
              "," +
              this.centerX +
              "," +
              this.centerY +
              ")"
          );
      }
      else {
          document
          .querySelector(".g-svg-metromap")
          .setAttribute(
            "transform",
            "matrix(" +
              this.svgScale +
              ",0,0," +
              this.svgScale +
              "," +
              (this.centerX + this.translateX)+
              "," +
              (this.centerY + this.translateY)+
              ")"
          );
     }

        if (this.mapsFit != true) {
          this.positionSelectBalloon();
        }
        if (this.$refs.metro.clientWidth > 0) {
          this.mapsFit = true;
        }
      });
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    closeCard() {
      this.circleClicked = false;
      this.setStatus();
      if (document.querySelector(".metrowrapper.modal_opened")) {
        document
          .querySelector(".metrowrapper")
          .classList.remove("modal_opened");
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
                name = name.toLowerCase().replace("ё", "е");
                item.SNAME = item.SNAME.toLowerCase().replace("ё", "е");
                return item.SNAME === name;
              });
              if (candidate) {
                if (!isOpened(office) && office.GRAF) {
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
        this.closeCard();
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
      this.closeCard();
      this.myMap.geoObjects.remove(this.placemark);
      this.$refs.search.value = "";
      this.isInputEmpty = true;
      this.useElement?.setAttribute("x", -1000);
      this.useElement?.setAttribute("y", -1000);
      this.setStatus();
      this.currentStation = "";
    },
    openOnMap(e) {
      this.myMap.geoObjects.remove(this.placemark);
      this.currentTab = 0;
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

    setMouseCoords(e) {
/*      if(this.curPosX === null){
      this.curPosX = e.clientX;
      this.curPosY = e.clientY;
      }
      if (this.oldPosX) {
        this.curPosX = e.clientX - parseInt(this.oldPosX);
        this.curPosY = e.clientY - parseInt(this.oldPosY);
      }*/
      this.cardposX = parseInt(this.$refs["card"]?.style.marginLeft);
      this.cardposY = parseInt(this.$refs["card"]?.style.marginTop);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseout", this.onMouseOute);
      window.addEventListener("mouseup", this.removeListener);

    },
 setTouchCoords(e) {
      this.touchX = e.changedTouches[0].clientX;
      this.touchY = e.changedTouches[0].clientY;
      if(document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0]) {
      this.oldPosX = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.e;
      this.oldPosY = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.f;
      this.centerX =0;
      this.centerY =0;
      }
      this.touchstartX= 0;
      this.touchstartY= 0;
      document.addEventListener("touchmove", this.onMouseMoveOne);

    },
    onMouseMoveOne(e){
      this.touchstartX = (this.touchX - e.changedTouches[0].clientX) *-1;
      this.touchstartY = (this.touchY - e.changedTouches[0].clientY)*-1;
      this.translateX =this.oldPosX+ this.touchstartX;
      this.translateY =this.oldPosY+ this.touchstartY;
      this.fitToViewportMetro();
    },
    removeListenerTouch(e){
      document.removeEventListener("touchmove", this.onMouseMoveOne);
    },
    removeListener(e) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseout", this.onMouseOute);
      window.removeEventListener("mouseup", this.removeListener);
    },
    onMouseMove(e) {
      e.preventDefault();
      let svg = document.querySelector(".g-svg-metromap");
      this.translateX = this.translateX + e.movementX / e.view.devicePixelRatio;
      this.translateY = this.translateY + e.movementY / e.view.devicePixelRatio;
      this.cardposX = this.cardposX + e.movementX / e.view.devicePixelRatio;
      this.cardposY = this.cardposY + e.movementY / e.view.devicePixelRatio;

      if (Math.abs(this.translateX)*this.svgScale >= (1285 * this.svgScale) / 2) {
        this.cardposX = this.cardposX - e.movementX / e.view.devicePixelRatio;
        this.translateX =
          this.translateX - e.movementX / e.view.devicePixelRatio;
      }
      if (Math.abs(this.translateY)*this.svgScale >= (1295 * this.svgScale) / 2) {
        this.translateY =
          this.translateY - e.movementY / e.view.devicePixelRatio;
        this.cardposY = this.cardposY - e.movementY / e.view.devicePixelRatio;
      }
      this.fitToViewportMetro();
      this.$refs["card"].style.marginLeft = this.cardposX + "px";
      this.$refs["card"].style.marginTop = this.cardposY + "px";
    },
    zoom(param) {
      let step = 0.2;
      if (param == "+") {
        this.closeCard();
        this.svgScale = this.svgScale + step;
        if (this.svgScale > 2) {
          this.svgScale = 2;
        }
        this.fitToViewportMetro();
      } else if (param == "-") {
        this.closeCard();
        this.svgScale = this.svgScale - step;
        if (this.svgScale < step) {
          this.svgScale = 0.2;
        }
        this.fitToViewportMetro();
      }
    },
    chooseStation(e) {
      if (e.target.tagName == "use") {
        this.setStatus();
        e.target.setAttribute("href", "#balloon-select");
        this.stationOffices = [];
        this.circleClicked = true;
        let stationName = e.target.dataset.station;
        let offices = this.$store.getters["map/getRegionOffices"];
        offices.forEach((office) => {
          if (!office.NORDER) office.NORDER = 0;
          let candidate = office.IDUNDERGROUND.find((item) => {
             stationName = stationName.toLowerCase().replace("ё", "е");
              item.SNAME = item.SNAME.toLowerCase().replace("ё", "е");
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

        let body_size = (document.querySelector("body").clientWidth - 1200) / 2;
        if (body_size < 0) {
          body_size = 0;
        }
        document.querySelector(".metrowrapper").classList.add("modal_opened");
        this.$refs["card"].style.marginLeft = 0;
        this.$refs["card"].style.marginTop = 0;
        this.$refs["card"].style.top = e.layerY + "px";
        this.$refs["card"].style.left = e.layerX + "px";
        if (e.clientX + 400 > this.width) {
          this.$refs["card"].style.left = e.layerX - 375 + "px";
        }
        if (e.layerY > 500) {
          this.$refs["card"].style.transform = "translateY(-100%)";
        }
        if (e.layerY < 500) {
          this.$refs["card"].style.transform = "translateY(0)";
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
      let body = document.getElementsByTagName('body')[0]
      this.myMap.geoObjects.events.add("balloonopen", (e) => {
        body.classList.add('open-balloon')
        const target = e.get("target");
        target.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
        );
      });

      this.myMap.geoObjects.events.add("balloonclose", (e) => {
        body.classList.remove('open-balloon')
        const target = e.get("target");
        target?.options.set(
          "iconImageHref",
          "https://new.reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
        );
      });
      this.setPlaceholder();

      checkClusterStatus(this.myClusterer);
    },

    combineAgencies(agencies, i, count) {
      let arr = [];
      let slicedAgencies = agencies.slice(i, i + count)
      slicedAgencies.sort((a, b) => {
        if (!a.NORDER) a.NORDER = 0
        if (!b.NORDER) b.NORDER = 0
        return a.NORDER - b.NORDER
      })
      slicedAgencies.forEach((item) => {
        arr.push(getTemplate(item))
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
      this.closeCard();
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
        if (e.get("item").value.includes('линия')) {
          addressArr = e.get("item").value.split(', ')
          addressArr.splice(2,1)
          addressArr = addressArr.join()
        }
        showOnMap(addressArr ? addressArr : e.get("item").value);
      }
      this.suggestView.events.add("select", func);
    },

    async setPositionAttributes() {
      let lat = +Cookies.get("lat");
      // if (!lat) {
      //   let geolocation = await ymaps.geolocation.get();
      //   if (geolocation) {
      //     let query = this.suggest
      //       ? this.suggest
      //       : geolocation.geoObjects.get(0).properties.get("text");
      //     this.centerCoords = geolocation.geoObjects.position;
      //     try {
      //       this.address = await this.$axios.post("/api/suggestions/address", {
      //         query,
      //         count: 1,
      //       });
      //       if (this.address.data.suggestions.length) {
      //         this.regionId =
      //           this.address.data.suggestions[0].data.city_kladr_id.substr(
      //             0,
      //             2
      //           );
      //         this.city = this.address.data.suggestions[0].data.city;
      //       }
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   }
      // }
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
            this.address.data.suggestions[0].data.city_kladr_id.substr(0, 2);
          await this.$store.dispatch("map/fetchRegion", {
            id: this.regionId,
            coords: coords ? coords : this.centerCoords,
          });
        } else {
          this.regionId = null;
        }
        this.myClusterer?.removeAll();

        let offices = this.getOfficesByCity

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
          let start = (this.page - 1) * this.pagesCount;
          let end = start + this.pagesCount;
          if (this.currentStation) {
            let filteredByStation = [];
            this.getOffices.forEach((item) => {
              item.IDUNDERGROUND.forEach((station) => {
                if (station.SNAME.toLowerCase().replace("ё", "е").includes(this.currentStation.toLowerCase().replace("ё", "е"))) {
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

<style scoped lang="scss">
.metrowrapper {
  display: flex;
  align-items: center;
  & > div {
    > svg {
      position: absolute;
    }
  }
}
</style>
