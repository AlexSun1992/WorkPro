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
              <address-suggest-view
                v-if="currentTab !== 1 || !tabVisible"
                @update="showFoundOfficesOnMap"
              />
              <input
                :class="[currentTab === 1 && tabVisible ? 'd-block' : 'd-none']"
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
            <FilterComponent
              :filters="filters"
              @update="filterOffices"
            />
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
        <div
          ref="map"
          id="map"
          class="map"
        ></div>
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
            <Mosmetro
              ref="metro"
              @click="chooseStation"
            />
          </div>
          <div
            v-show="cardVisible"
            ref="card"
            class="card"
          >
            <metro-office-card
              @open="openOnMap"
              @close="closeCard"
              :offices="stationOffices"
            />
          </div>
          <ZoomComponent @zoom="zoom" />
        </div>
      </b-tab>
      <b-tab
        title="В списке"
        title-item-class="office-on-lists"
      >
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
import { BTabs, BTab, BPagination } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
/* eslint-disable */
import { isOpened, getTemplate, checkClusterStatus } from "../../../../utils/map/helpers/helpers";
/* eslint-disable */
import getCurrentCity from "../../../../utils/map/currentCity";
/* eslint-disable */
import { filters, filterData } from "../../../../utils/map/filters";
import Mosmetro from "./mosmetro.svg";
import FilterComponent from "./FilterComponent.vue";
import ZoomComponent from "./ZoomComponent.vue";
import OfficesList from "./OfficesList.vue";
import MetroOfficeCard from "./MetroOfficeCard.vue";
import AddressSuggestView from "./AddressSuggestView/AddressSuggestView";

Vue.use(LoadScript);
export default {
  name: "OfficesMap",
  components: {
    AddressSuggestView,
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
      cardPosY: null,
      cardPosX: null,
      translateX: 0,
      translateY: 0,
      touchX: 0,
      touchY: 0,
      touch2X: 0,
      touch2Y: 0,
      touchstartX: 0,
      touchstartY: 0,
      touchnumber: 0,
      touchstart2X: 0,
      touchstart2Y: 0,
      zoomtouch: 0,
      zoomtouch_twoo: 0,
      centerX: null,
      centerY: null,
      mapsFit: false,
      svgScale: 1,
      gScaleTransformX: 0,
      gScaleTransformY: 0,
      gWidth: 0,
      gHeight: 0,
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

      if (Cookies.get("lat") && Cookies.get("lat") !== "null") {
        await this.$store.dispatch("map/fetchRegion", {
          id: Cookies.get("kladr_id")?.substr(0, 2),
          coords: [Cookies.get("lat"), Cookies.get("lon")],
        });
      } else {
        await getCurrentCity().then(async ({ lat = "55.75396", lon = "37.620393", kladr = "7700000000000" }) => {
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
      this.translateX = 0;
      this.translateY = 0;
      const gsvg = document.querySelector('use[href="#balloon-select"]');
      if (document.querySelector('use[href="#balloon-select"]') && this.centerX != null) {
        if (this.$refs.metro.clientHeight - 1295 * this.svgScale < 0) {
          const XX = this.$refs.metro.clientHeight;
          const XXX = 1295 * this.svgScale;
          const XXXX = Math.abs(XX - XXX) / 2;
          const XXXXX = gsvg.getAttribute("y") * this.svgScale;
          if (XXXXX < XXXX - this.centerY - (137 * this.svgScale) / 2) {
            this.centerY = Math.abs(XXXXX - XXXX + 137 * this.svgScale);
          }
          if (XXXXX > this.$refs.metro.clientHeight - this.centerY) {
            this.centerY = (XX - XXXXX) * 2;
          }

          document
            .querySelector(".g-svg-metromap")
            .setAttribute("transform", `matrix(${this.svgScale},0,0,${this.svgScale},${this.centerX},${this.centerY})`);
        }

        if (document.querySelector(".g-svg-metromap").getAttribute("transform") != null) {
        }
      }
      if (gsvg != null) {
        this.chooseStation({ target: gsvg });
        const sla =
          document.querySelector('use[href="#balloon-select"]').getBoundingClientRect().top -
          document.querySelector(".svg-metromap").getBoundingClientRect().top +
          21;

        const slaa =
          document.querySelector('use[href="#balloon-select"]').getBoundingClientRect().left -
          document.querySelector(".svg-metromap").getBoundingClientRect().left +
          21;
        this.$refs.card.style.top = `${sla}px`;
        this.$refs.card.style.left = `${slaa}px`;
        if (slaa + 400 > this.width) {
          this.$refs.card.style.left = `${slaa - 375}px`;
        }
        if (sla > 500) {
          this.$refs.card.style.transform = "translateY(-100%)";
        }
        if (sla < 500) {
          this.$refs.card.style.transform = "translateY(0)";
        }
      }
    },
    fitToViewportMetro() {
      this.$nextTick(() => {
        if (this.width < 992 && this.mapsFit !== true) {
          this.svgScale = 0.5;
        } else if (this.width > 1200 && this.mapsFit !== true) {
          this.svgScale = 1;
        }

        if (this.mapsFit !== true) {
          this.gWidth = document.querySelector(".g-svg-metromap").getBoundingClientRect().width;
          this.gHeight = document.querySelector(".g-svg-metromap").getBoundingClientRect().height;
          if (document.querySelector(".svg-metromap").getBoundingClientRect().width >= this.gWidth) {
            this.centerX =
              document.querySelector(".svg-metromap").getBoundingClientRect().width / 2 -
              ((this.gWidth - 87 * this.svgScale) / 2) * this.svgScale;
          } else {
            this.centerX =
              document.querySelector(".svg-metromap").getBoundingClientRect().width / 2 -
              (this.gWidth / 2 - 87 * this.svgScale) * this.svgScale;
          }

          this.centerY = 0;
          document
            .querySelector(".g-svg-metromap")
            .setAttribute("transform", `matrix(${this.svgScale},0,0,${this.svgScale},${this.centerX},${this.centerY})`);
        } else {
          document
            .querySelector(".g-svg-metromap")
            .setAttribute(
              "transform",
              `matrix(${this.svgScale},0,0,${this.svgScale},${this.centerX + this.translateX + this.gScaleTransformX},${
                this.centerY + this.translateY + this.gScaleTransformY
              })`
            );
        }

        if (this.mapsFit !== true) {
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
      // if (this.currentFilters?.length === 0) {
      // this.setStatus();

      // }
      const gsvg = document.querySelector('use[href="#balloon-select"]');
      if (gsvg) {
        gsvg.setAttribute("href", "#balloon-open");
      }
      if (document.querySelector(".metrowrapper.modal_opened")) {
        document.querySelector(".metrowrapper").classList.remove("modal_opened");
      }
      document.body.classList.remove("overflow-hidden");
    },
    setStatus() {
      const g = document.getElementsByTagName("g");
      if (g && g[0]) {
        const offices = this.$store.getters["map/getRegionOffices"];
        for (let i = 0; i < g[0].children.length; i++) {
          if (g[0].children[i].tagName === "use") {
            let name = g[0].children[i].dataset.station;
            offices.forEach((office) => {
              const candidate = office.IDUNDERGROUND.find((item) => {
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
      if (e.target.value === "") {
        this.closeCard();
        this.isInputEmpty = true;
        this.useElement?.setAttribute("x", -1000);
        this.useElement?.setAttribute("y", -1000);
        this.myMap.geoObjects.remove(this.placemark);
        this.currentStation = "";
      } else {
        this.isInputEmpty = false;
      }
      // this.setStatus();
    },
    clear() {
      this.closeCard();
      this.myMap.geoObjects.remove(this.placemark);
      this.$refs.search.value = "";
      this.isInputEmpty = true;
      this.useElement?.setAttribute("x", -1000);
      this.useElement?.setAttribute("y", -1000);
      // this.setStatus();
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
      this.cardposX = parseInt(this.$refs.card?.style.marginLeft);
      this.cardposY = parseInt(this.$refs.card?.style.marginTop);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseout", this.onMouseOute);
      window.addEventListener("mouseup", this.removeListener);
    },
    setTouchCoords(e) {
      this.touchnumber += 1;
      if (this.touchnumber == 1) {
        this.touchX = e.changedTouches[0].clientX;
        this.touchY = e.changedTouches[0].clientY;
        if (document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0]) {
          this.oldPosX = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.e;
          this.oldPosY = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.f;
          this.centerX = 0;
          this.centerY = 0;
        }
        this.touchstartX = 0;
        this.touchstartY = 0;
      } else if (this.touchnumber == 2) {
        this.touch2X = e.changedTouches[0].clientX;
        this.touch2Y = e.changedTouches[0].clientY;
        this.touchstart2X = 0;
        this.touchstart2Y = 0;
        this.zoomtouch_twoo = Math.round(
          Math.sqrt(
            (e.touches[1].clientX - e.touches[0].clientX) ** 2 + (e.touches[1].clientY - e.touches[0].clientY) ** 2
          )
        );
        this.centerX = (e.touches[1].clientX + e.touches[0].clientX) / 2;
        this.centerY = (e.touches[1].clientY + e.touches[0].clientY) / 2;
      }

      document.addEventListener("touchmove", this.onMouseMoveOne);
      document.body.classList.add("overflow-hidden");
    },
    onMouseMoveOne(e) {
      switch (e.touches.length) {
        case 1:
          this.touchstartX = (this.touchX - e.changedTouches[0].clientX) * -1;
          this.touchstartY = (this.touchY - e.changedTouches[0].clientY) * -1;
          this.translateX = this.oldPosX + this.touchstartX;
          this.translateY = this.oldPosY + this.touchstartY;
          this.gScaleTransformX = 0;
          this.gScaleTransformY = 0;
          this.fitToViewportMetro();
          break;
        case 2:
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          var summxy = Math.sqrt(
            (e.touches[1].clientX - e.touches[0].clientX) ** 2 + (e.touches[1].clientY - e.touches[0].clientY) ** 2
          );
          var offset_touch = this.zoomtouch_twoo - summxy;
          if (this.zoomtouch > summxy) {
            if (offset_touch >= 50 && this.svgScale >= 0.3) {
              this.oldPosX = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.e;
              this.oldPosY = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.f;
              var width_prev = document.querySelector(".g-svg-metromap").getBoundingClientRect().width;
              var height_prev = document.querySelector(".g-svg-metromap").getBoundingClientRect().height;
              this.svgScale -= 0.1;
              this.zoomtouch_twoo = summxy;
              this.gScaleTransformX = (width_prev - this.gWidth * this.svgScale) / 2;
              this.gScaleTransformY = (height_prev - this.gHeight * this.svgScale) / 2;
              document
                .querySelector(".g-svg-metromap")
                .setAttribute(
                  "transform",
                  `matrix(${this.svgScale},0,0,${this.svgScale},${this.oldPosX + this.gScaleTransformX},${
                    this.oldPosY + this.gScaleTransformY
                  })`
                );
            }
            // Math.round(this.zoomtouch_twoo) - summxy
            /* this.svgScale = this.svgScale - 0.05;
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
              ); */
          }
          if (this.zoomtouch < summxy) {
            if (offset_touch <= -50 && this.svgScale <= 1.9) {
              this.oldPosX = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.e;
              this.oldPosY = document.getElementsByClassName("g-svg-metromap")[0].transform.animVal[0].matrix.f;
              var width_prev = document.querySelector(".g-svg-metromap").getBoundingClientRect().width;
              var height_prev = document.querySelector(".g-svg-metromap").getBoundingClientRect().height;
              this.svgScale += 0.1;
              this.zoomtouch_twoo = summxy;
              this.gScaleTransformX = (width_prev - this.gWidth * this.svgScale) / 2;
              this.gScaleTransformY = (height_prev - this.gHeight * this.svgScale) / 2;
              document
                .querySelector(".g-svg-metromap")
                .setAttribute(
                  "transform",
                  `matrix(${this.svgScale},0,0,${this.svgScale},${this.oldPosX + this.gScaleTransformX},${
                    this.oldPosY + this.gScaleTransformY
                  })`
                );
            }
            /*
            this.svgScale = this.svgScale + 0.05;
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
              ); */
          }
          this.zoomtouch = summxy;
          break;
        case 3:
          break;
        default:
          console.log("Not supported");
          break;
      }
    },
    removeListenerTouch(e) {
      document.removeEventListener("touchmove", this.onMouseMoveOne);
      document.body.classList.remove("overflow-hidden");
      this.touchnumber = 0;
      this.zoomtouch = 0;
      // document.querySelector(".sla").remove();
    },
    removeListener(e) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseout", this.onMouseOute);
      window.removeEventListener("mouseup", this.removeListener);
    },
    onMouseMove(e) {
      e.preventDefault();
      const svg = document.querySelector(".g-svg-metromap");
      this.translateX += e.movementX / e.view.devicePixelRatio;
      this.translateY += e.movementY / e.view.devicePixelRatio;
      this.cardposX += e.movementX / e.view.devicePixelRatio;
      this.cardposY += e.movementY / e.view.devicePixelRatio;

      if (Math.abs(this.translateX) * this.svgScale >= (1285 * this.svgScale) / 2) {
        this.cardposX -= e.movementX / e.view.devicePixelRatio;
        this.translateX -= e.movementX / e.view.devicePixelRatio;
      }
      if (Math.abs(this.translateY) * this.svgScale >= (1295 * this.svgScale) / 2) {
        this.translateY -= e.movementY / e.view.devicePixelRatio;
        this.cardposY -= e.movementY / e.view.devicePixelRatio;
      }
      this.fitToViewportMetro();
      this.$refs.card.style.marginLeft = `${this.cardposX}px`;
      this.$refs.card.style.marginTop = `${this.cardposY}px`;
    },
    zoom(param) {
      const step = 0.2;
      if (param == "+") {
        if (this.svgScale < 1.9) {
          this.closeCard();
          this.svgScale += step;
          this.gScaleTransformX = (this.gWidth * (1 - this.svgScale)) / 2;
          this.gScaleTransformY = (this.gHeight * (1 - this.svgScale)) / 2;
        }

        this.fitToViewportMetro();
      } else if (param == "-") {
        if (this.svgScale > 0.3) {
          this.closeCard();
          this.svgScale -= step;
          this.gScaleTransformX = (this.gWidth * (1 - this.svgScale)) / 2;
          this.gScaleTransformY = (this.gHeight * (1 - this.svgScale)) / 2;
        }
        this.fitToViewportMetro();
      }
    },
    chooseStation(e) {
      const gsvg = document.querySelector('use[href="#balloon-select"]');
      if (gsvg) {
        gsvg.setAttribute("href", "#balloon-open");
      }
      if (e.target.tagName == "use") {
        // this.setStatus();
        e.target.setAttribute("href", "#balloon-select");
        this.stationOffices = [];
        this.circleClicked = true;
        let stationName = e.target.dataset.station;
        const offices = this.$store.getters["map/getRegionOffices"];
        offices.forEach((office) => {
          if (!office.NORDER) office.NORDER = 0;
          const candidate = office.IDUNDERGROUND.find((item) => {
            stationName = stationName.toLowerCase().replace("ё", "е");
            item.SNAME = item.SNAME.toLowerCase().replace("ё", "е");
            if (item.SNAME.includes(", ")) {
              return item.SNAME.split(", ").includes(stationName);
            }
            return item.SNAME === stationName;
          });
          if (candidate) {
            this.stationOffices.push(office);
          }
        });
        this.stationOffices.sort((a, b) => a.NORDER - b.NORDER);

        let body_size = (document.querySelector("body").clientWidth - 1200) / 2;
        if (body_size < 0) {
          body_size = 0;
        }
        document.querySelector(".metrowrapper").classList.add("modal_opened");
        this.$refs.card.style.marginLeft = 0;
        this.$refs.card.style.marginTop = 0;
        this.$refs.card.style.top = `${e.layerY}px`;
        this.$refs.card.style.left = `${e.layerX}px`;
        if (e.clientX + 400 > this.width) {
          this.$refs.card.style.left = `${e.layerX - 375}px`;
        }
        if (e.layerY > 500) {
          this.$refs.card.style.transform = "translateY(-100%)";
        }
        if (e.layerY < 500) {
          this.$refs.card.style.transform = "translateY(0)";
        }
        if (document.querySelector("body").clientWidth <= 992) {
          document.body.classList.add("overflow-hidden");
        }
      }
    },
    async init(_, filters) {
      const lat = Cookies.get("lat");
      const lon = Cookies.get("lon");
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

      if (!this.mapState) {
        this.mapState = {
          center: this.centerCoords ? this.centerCoords : this.$store.getters["map/getDefaultCoords"],
          zoom: 12,
          controls: [],
        };
      }

      this.myMap = new ymaps.Map("map", this.mapState, {
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
      const body = document.getElementsByTagName("body")[0];
      this.myMap.geoObjects.events.add("balloonopen", (e) => {
        body.classList.add("open-balloon");
        const target = e.get("target");
        target.options.set(
          "iconImageHref",
          "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
        );
      });

      this.myMap.geoObjects.events.add("balloonclose", (e) => {
        body.classList.remove("open-balloon");
        const target = e.get("target");
        target?.options.set(
          "iconImageHref",
          "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
        );
      });
      this.setPlaceholder();
      if (window.innerWidth < 992) {
        this.myMap.options.set("balloonAutoPan", false);
      }

      // checkClusterStatus(this.myClusterer);
    },

    combineAgencies(agencies, i, count) {
      const arr = [];
      const slicedAgencies = agencies.slice(i, i + count);
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
      const myGeoObjects = [];

      const uniqueItemsCount = agencies.reduce((acc, item) => {
        acc[item.NLAT] = (acc[item.NLAT] || 0) + 1;
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
              balloonContentBody: this.combineAgencies(agencies, i, uniqueItemsCount[agencies[i].NLAT]).join(""),

              hintContent: `${agencies[i].SSHORTNAME ?? "Офис продаж"}`,
              balloonShadowPane: "outerBalloon",
            },
          },
          {
            hideIconOnBalloonOpen: false,
            iconLayout: "default#image",
            iconImageHref: "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
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
      const showOnMap = this.showOnMap.bind(this);
      this.closeCard();
      const _this = this;
      func._this = this;
      function func(e) {
        _this.isMetroSuggest = false;
        if (e.get("item").value.includes("метро")) {
          _this.isMetroSuggest = true;
          _this.currentStation = e.get("item").value.split(" метро")[1].trim();
          const maps = document.querySelectorAll(".g-svg-metromap");

          for (let i = 0; i < maps[0]?.children.length; i++) {
            if (maps[0].children[i].tagName === "use" && maps[0].children[i].dataset.station === _this.currentStation) {
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
        showOnMap(addressArr || e.get("item").value);
      }
      this.suggestView.events.add("select", func);
    },

    async setPositionAttributes() {
      const lat = +Cookies.get("lat");
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
        this.centerCoords && !this.isMetroSuggest && !state.center ? this.centerCoords : state.center,
        this.qc_geo > 2 && !this.isMetroSuggest ? zoom : 15
      );
      this.placemark.geometry.setCoordinates(
        this.centerCoords && !this.isMetroSuggest && !state.center ? this.centerCoords : state.center
      );
      this.placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });
    },
    showResult(obj) {
      const mapContainer = document.getElementById("map");
      const bounds = obj.properties.get("boundedBy");
      this.mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [mapContainer.clientWidth, mapContainer.clientHeight]);
      const shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(" ");
      this.updateMap(this.mapState, shortAddress);
    },
    async showFoundOfficesOnMap(data) {
      await this.showOnMap(data?.value || Cookies.get("location_user"));
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
            coords: coords || this.centerCoords,
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
        this.filteredOffices = filterData(this.getOfficesByCity, this.currentFilters);
      }
      const showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then((res, context) => {
        const obj = res.geoObjects.get(0);
        if (obj) {
          showResult(obj);
        }
      });
    },
    async filterOffices(filters) {
      const mapsCheckOffice = filters.find((item) => item.id === "maps-check-office");
      if (mapsCheckOffice) {
        return;
      }
      await this.$store.dispatch("map/fetchRegion", {
        id: this.regionId,
        coords: this.centerCoords,
      });
      this.currentFilters = filters;
      this.filteredOffices = filterData(this.getOfficesByCity, this.currentFilters);

      const offices = this.filteredOffices?.reduce((acc, office) => {
        if (office.IDUNDERGROUND.length > 0) {
          this.getOfficesByStations(acc, office);
        }
        return acc;
      }, {});

      this.changeStationAttribute(offices);

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

    getOfficesByStations(acc, office) {
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
        } else if (acc[metroObj.SNAME]) {
          acc[metroObj.SNAME].push(office);
        } else {
          acc[metroObj.SNAME] = [office];
        }
      });
    },

    changeStationAttribute(offices) {
      const useNodes = document.getElementsByTagName("use");
      for (const use of useNodes) {
        const station = use.getAttribute("data-station");
        if (offices[station]) {
          use.setAttribute("href", "#balloon-open");
        } else {
          use.setAttribute("href", "");
        }
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
      const filteredOffices = this.$store.getters["map/getRegionOffices"]?.filter((office) =>
        office.SADDRESS.includes(`${this.city}`)
      );

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
      data = data?.sort((a, b) => a.NDISTANSE - b.NDISTANSE);
      return data;
    },

    offices() {
      if (this.width < 900) {
        let officesArr = [];
        const countedOffices = this.getOffices?.reduce((acc, office) => {
          if (office.IDUNDERGROUND.length > 0) {
            this.getOfficesByStations(acc, office);
          } else {
            officesArr.push({
              station: "",
              info: [office],
            });
          }
          return acc;
        }, {});

        for (const key in countedOffices) {
          officesArr.push({
            station: key,
            info: countedOffices[key],
          });
        }

        officesArr = officesArr?.sort((a, b) => a.info[0].NDISTANSE - b.info[0].NDISTANSE);

        if (this.currentStation) {
          officesArr = officesArr.filter((item) => item.station == this.currentStation);
        }
        if (!this.isShownMore) {
          return officesArr.slice(0, 6);
        }
        return officesArr;
      }
      if (this.getOffices) {
        const start = (this.page - 1) * this.pagesCount;
        const end = start + this.pagesCount;
        if (this.currentStation) {
          const filteredByStation = [];
          this.getOffices.forEach((item) => {
            item.IDUNDERGROUND.forEach((s) => {
              const station = s.SNAME.toLowerCase().replace("ё", "е");
              const currentStation = this.currentStation.toLowerCase().replace("ё", "е");
              if (station === currentStation && station.length === currentStation.length) {
                filteredByStation.push(item);
              }
            });
          });
          return filteredByStation;
        }
        return this.getOffices.slice(start, end);
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
      this.showOnMap(this.$store.getters["map/getCity"]?.city, this.$store.getters["map/getCity"]?.coords);
    },
    getOfficesByCity(offices) {
      const filteredOffices = offices.filter((office) => office.SADDRESS.includes(`${this.city}`));
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
.nav-item.office-on-lists {
  margin-right: 0;
}
</style>
