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
              <address-suggest-view :isMetro="tabMetroSelected" @update="showOnMap"/>
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
      >
        <div id="map" class="map"></div>
      </b-tab>
      <b-tab
        v-if="tabMetroVisible"
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
              @close="closeMetroCard"
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
          :mobile="isMobile"
          :data="officesOnPage"
          @open="openOnMap"
          @showMore="isShownMore = $event"
        />

        <b-pagination
          v-if="filteredOffices && filteredOffices.length > 15"
          v-show="filteredOffices && !isMobile && !currentStation"
          v-model="page"
          :total-rows="filteredOffices.length > 100 ? 100 : filteredOffices.length"
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
/* eslint-disable */
Window.saveLogAgentOnOfficesMap = async (log) => {
  const logObject = log;
  logObject.vizitType = window.innerWidth < 992 ? "Y" : "N";

  function getUserId() {
    if (Cookies.get("_ym_uid")) {
      return Cookies.get("_ym_uid");
    }

    if ("yaCounter25356824" in globalThis) {
      return yaCounter25356824.getClientID();
    }

    return "";
  }

  logObject.userId = getUserId();
  let utm = new URLSearchParams(window.location.search);
  logObject.utm_source = utm.get('utm_source') ? utm.get('utm_source') : undefined;
  logObject.utm_medium = utm.get('utm_medium') ? utm.get('utm_medium') : undefined;
  logObject.utm_campaign = utm.get('utm_campaign') ? utm.get('utm_campaign') : undefined;
  logObject.utm_content = utm.get('utm_content') ? utm.get('utm_content') : undefined;
  logObject.utm_term = utm.get('utm_term') ? utm.get('utm_term') : undefined;

  logObject.isService = 'N';

  let json = JSON.stringify(logObject);

  try {
    let response = await fetch("/am/free/v2/siteapi/log/AgentsMap", {
      method: "POST",
      body: json
    });

    let result = await response.json();

    if (result[0].STATUS != 0) {
      throw new Error(result[0].ERROR);
    }
  } catch (error) {
    logErrorSite(error, 'agentMap', 'Ошибка логирования действий пользователя на карте офисов.');
  }
}

import { BTabs, BTab, BPagination } from "bootstrap-vue";
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import { filters, filterData } from "../../../../utils/map/filtersV3";
import Mosmetro from "./mosmetro.svg";
import FilterComponent from "./FilterComponent.vue";
import ZoomComponent from "./ZoomComponent.vue";
import OfficesList from "./OfficesList.vue";
import OfficeCard from "./OfficeCard.vue";
import MetroOfficeCard from "./MetroOfficeCard.vue";
import AddressSuggestView from "./AddressSuggestView/AddressSuggestView";
import { getTemplate, sortOffices } from "../../../../utils/map/helpers/helpers2";

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
    OfficeCard,
    MetroOfficeCard,
    ZoomComponent,
    BPagination,
  },
  myMap: null,
  objectManager: null,
  data() {
    return {
      filters,
      filteredOffices: null,
      //filteredAgentsData: null,
      page: 1,
      mapState: null,
      regionId: null,
      centerCoords: null,
      currentFilters: null,
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
      currentTab: 0,
      currentStation: null,
      width: window.innerWidth,
      pagesCount: 15,
      isShownMore: false,
      height: window.innerHeight,
      phonePromo: "88002345215",
      phoneDesktop: "88002345213",
      phoneMobile: "88002507679",
    };
  },
  async created() {
    try {
      window.addEventListener("resize", this.onResize);

      if (Cookies.get("lat") && Cookies.get("lat") !== "null") {
        this.regionId = Cookies.get("kladr_id").substring(0, 2);
        this.centerCoords = [Cookies.get("lat"), Cookies.get("lon")];
      } else {
        let lat = "55.75396";
        let lon = "37.620393";
        let kladr = "7700000000000";

        Cookies.set("lat", "55.75396");
        Cookies.set("lon", "37.620393");
        Cookies.set("kladr_id", "7700000000000");
        this.regionId = kladr.substring(0, 2);
        this.centerCoords = [lat, lon];
      }

      const promiseLoadData = new Promise((resolve,reject) => {
        resolve(
          this.$store.dispatch("mapV3/fetchRegion", {
            coords: this.centerCoords,
          }).catch((e) => console.log(e))
        );
      });
      const promiseLoadMap = new Promise((resolve,reject) => {
        resolve(this.$loadScript(
          `https://api-maps.yandex.ru/2.1/?apikey=95a56d05-41db-462a-a2ea-2c49ff3417a1&lang=ru_RU`
        ));
      });
      await Promise.all([promiseLoadData, promiseLoadMap]);

      //Сортируем сразу, чтобы корректно отображался порядок в кластерах
      this.filteredOffices = sortOffices(this.allOffices, this.centerCoords);

      if (this.allOffices) {
        ymaps.ready(this.initMap);
      }

    } catch (error) {
      console.log(error);
    }
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    positionSelectBalloon() {
      this.translateX = 0;
      this.translateY = 0;
      const gsvg = document.querySelector('use[href="#balloon-select"]');
      if (
        document.querySelector('use[href="#balloon-select"]') &&
        this.centerX != null
      ) {
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
            .setAttribute(
              "transform",
              `matrix(${this.svgScale},0,0,${this.svgScale},${this.centerX},${this.centerY})`
            );
        }

        if (
          document.querySelector(".g-svg-metromap").getAttribute("transform") !=
          null
        ) {
        }
      }
      if (gsvg != null) {
        this.chooseStation({ target: gsvg });
        const sla =
          document
            .querySelector('use[href="#balloon-select"]')
            .getBoundingClientRect().top -
          document.querySelector(".svg-metromap").getBoundingClientRect().top +
          21;

        const slaa =
          document
            .querySelector('use[href="#balloon-select"]')
            .getBoundingClientRect().left -
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
          this.gWidth = document
            .querySelector(".g-svg-metromap")
            .getBoundingClientRect().width;
          this.gHeight = document
            .querySelector(".g-svg-metromap")
            .getBoundingClientRect().height;
          if (
            document.querySelector(".svg-metromap").getBoundingClientRect()
              .width >= this.gWidth
          ) {
            this.centerX =
              document.querySelector(".svg-metromap").getBoundingClientRect()
                .width /
                2 -
              ((this.gWidth - 87 * this.svgScale) / 2) * this.svgScale;
          } else {
            this.centerX =
              document.querySelector(".svg-metromap").getBoundingClientRect()
                .width /
                2 -
              (this.gWidth / 2 - 87 * this.svgScale) * this.svgScale;
          }

          this.centerY = 0;
          document
            .querySelector(".g-svg-metromap")
            .setAttribute(
              "transform",
              `matrix(${this.svgScale},0,0,${this.svgScale},${this.centerX},${this.centerY})`
            );
        } else {
          document
            .querySelector(".g-svg-metromap")
            .setAttribute(
              "transform",
              `matrix(${this.svgScale},0,0,${this.svgScale},${
                this.centerX + this.translateX + this.gScaleTransformX
              },${this.centerY + this.translateY + this.gScaleTransformY})`
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
    closeMetroCard() {
      this.circleClicked = false;

      const gsvg = document.querySelector('use[href="#balloon-select"]');
      if (gsvg) {
        gsvg.setAttribute("href", "#balloon-open");
      }
      if (document.querySelector(".metrowrapper.modal_opened")) {
        document
          .querySelector(".metrowrapper")
          .classList.remove("modal_opened");
      }
      document.body.classList.remove("overflow-hidden");
    },

    async openOnMap(office) {
      this.currentTab = 0;
      this.myMap.setZoom(15);

      await this.objectManager.objects.balloon.open(office.ID + '0');
      this.updateYandexBalloon();

      if (this.isMobile) {
        this.myMap.setCenter([office.NLAT, office.NLONG]);
        let gpc = this.myMap.getGlobalPixelCenter();
        gpc[1] += 128;
        this.myMap.setGlobalPixelCenter(gpc);

        this.closeMetroCard();
      }
    },

    updateYandexBalloon() {
      this.objectManager.objects.balloon.setData(this.objectManager.objects.balloon.getData());
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
        if (
          document.getElementsByClassName("g-svg-metromap")[0].transform
            .animVal[0]
        ) {
          this.oldPosX =
            document.getElementsByClassName(
              "g-svg-metromap"
            )[0].transform.animVal[0].matrix.e;
          this.oldPosY =
            document.getElementsByClassName(
              "g-svg-metromap"
            )[0].transform.animVal[0].matrix.f;
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
            (e.touches[1].clientX - e.touches[0].clientX) ** 2 +
              (e.touches[1].clientY - e.touches[0].clientY) ** 2
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
            (e.touches[1].clientX - e.touches[0].clientX) ** 2 +
              (e.touches[1].clientY - e.touches[0].clientY) ** 2
          );
          var offset_touch = this.zoomtouch_twoo - summxy;
          if (this.zoomtouch > summxy) {
            if (offset_touch >= 50 && this.svgScale >= 0.3) {
              this.oldPosX =
                document.getElementsByClassName(
                  "g-svg-metromap"
                )[0].transform.animVal[0].matrix.e;
              this.oldPosY =
                document.getElementsByClassName(
                  "g-svg-metromap"
                )[0].transform.animVal[0].matrix.f;
              var width_prev = document
                .querySelector(".g-svg-metromap")
                .getBoundingClientRect().width;
              var height_prev = document
                .querySelector(".g-svg-metromap")
                .getBoundingClientRect().height;
              this.svgScale -= 0.1;
              this.zoomtouch_twoo = summxy;
              this.gScaleTransformX =
                (width_prev - this.gWidth * this.svgScale) / 2;
              this.gScaleTransformY =
                (height_prev - this.gHeight * this.svgScale) / 2;
              document
                .querySelector(".g-svg-metromap")
                .setAttribute(
                  "transform",
                  `matrix(${this.svgScale},0,0,${this.svgScale},${
                    this.oldPosX + this.gScaleTransformX
                  },${this.oldPosY + this.gScaleTransformY})`
                );
            }
          }
          if (this.zoomtouch < summxy) {
            if (offset_touch <= -50 && this.svgScale <= 1.9) {
              this.oldPosX =
                document.getElementsByClassName(
                  "g-svg-metromap"
                )[0].transform.animVal[0].matrix.e;
              this.oldPosY =
                document.getElementsByClassName(
                  "g-svg-metromap"
                )[0].transform.animVal[0].matrix.f;
              var width_prev = document
                .querySelector(".g-svg-metromap")
                .getBoundingClientRect().width;
              var height_prev = document
                .querySelector(".g-svg-metromap")
                .getBoundingClientRect().height;
              this.svgScale += 0.1;
              this.zoomtouch_twoo = summxy;
              this.gScaleTransformX =
                (width_prev - this.gWidth * this.svgScale) / 2;
              this.gScaleTransformY =
                (height_prev - this.gHeight * this.svgScale) / 2;
              document
                .querySelector(".g-svg-metromap")
                .setAttribute(
                  "transform",
                  `matrix(${this.svgScale},0,0,${this.svgScale},${
                    this.oldPosX + this.gScaleTransformX
                  },${this.oldPosY + this.gScaleTransformY})`
                );
            }
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

      if (
        Math.abs(this.translateX) * this.svgScale >=
        (1285 * this.svgScale) / 2
      ) {
        this.cardposX -= e.movementX / e.view.devicePixelRatio;
        this.translateX -= e.movementX / e.view.devicePixelRatio;
      }
      if (
        Math.abs(this.translateY) * this.svgScale >=
        (1295 * this.svgScale) / 2
      ) {
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
          this.closeMetroCard();
          this.svgScale += step;
          this.gScaleTransformX = (this.gWidth * (1 - this.svgScale)) / 2;
          this.gScaleTransformY = (this.gHeight * (1 - this.svgScale)) / 2;
        }

        this.fitToViewportMetro();
      } else if (param == "-") {
        if (this.svgScale > 0.3) {
          this.closeMetroCard();
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
        e.target.setAttribute("href", "#balloon-select");
        this.stationOffices = [];
        this.circleClicked = true;
        let stationName = e.target.dataset.station;
        const offices = this.filteredOffices; // this.$store.getters["map/getRegionOffices"];
        offices.forEach((office) => {
          if (!office.NORDER) office.NORDER = 1000;
          const candidate = office.IDUNDERGROUND.find((item) => {
            // stationName = stationName.toLowerCase().replace("ё", "е");
            // item.SNAME = item.SNAME.toLowerCase().replace("ё", "е");
            if (item.SNAME.includes(", ")) {
              return item.SNAME.split(", ").includes(stationName);
            }
            return item.SNAME === stationName;
          });
          if (candidate && office.IDTOWN == 1) {
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
    async initMap() {
      let customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
        '<div style="height: 430px;">',
          '<div style="height: 100%;' +
            'display: block;\n' +
            'overflow-x: hidden;\n' +
            'overflow-y: auto;">',
            '{% for geoObject in properties.geoObjects %}',
              '{{ geoObject.properties.balloonContent|raw }}',
            '{% endfor %}',
          '</div>',
        '</div>',
      ].join(''));
      let customBalloonPanelContentLayout = ymaps.templateLayoutFactory.createClass([
        '<div style="height: 100%;' +
        'display: block;\n' +
        'overflow-x: hidden;\n' +
        'overflow-y: auto;">',
          '{% for geoObject in properties.geoObjects %}',
            '{{ geoObject.properties.balloonContent|raw }}',
          '{% endfor %}',
        '</div>',
      ].join(''));

      let objectManager = new ymaps.ObjectManager({
        clusterize: true,
      });
      objectManager.clusters.options.set({
        preset: 'islands#darkGreenClusterIcons',
        balloonMaxHeight: 430,
        balloonContentLayout: customBalloonContentLayout,
        balloonPanelContentLayout: customBalloonPanelContentLayout,
      });

      objectManager.add(this.getGeoObjects(this.filteredOffices));
      //objectManager.add(this.getBalloonAgentsData(this.filteredAgentsData));
      objectManager.add(this.getBalloonAgentsData(this.allAgents));

      objectManager.objects.events.add(['balloonopen', 'balloonclose'], function(e) {
        let objectId = e.get('objectId');
        if ((objectManager.objects.getById(objectId)).properties.typeObject == 'agent') {
          if (e.get('type') == 'balloonopen') {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref: '/system/modules/ru.reso.v2/resources/img/icons/pin_agent_active.svg'
            });
            Window.saveLogAgentOnOfficesMap({
              pressBubble : "Y"
            });
          } else {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref: '/system/modules/ru.reso.v2/resources/img/icons/pin_agent.svg'
            });
          }
        } else {
          if (e.get('type') == 'balloonopen') {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref: '/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg'
            });
          } else {
            objectManager.objects.setObjectOptions(objectId, {
              iconImageHref: '/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg'
            });
          }
        }
      });

      if (!this.mapState) {
        this.mapState = {
          center: this.centerCoords
            ? this.centerCoords
            : this.$store.getters["mapV3/getDefaultCoords"],
          zoom: 12,
          controls: [],
        };
      }

      this.myMap = new ymaps.Map("map", this.mapState, {
        yandexMapDisablePoiInteractivity: true,
        hideIconOnBalloonOpen: false,
        balloonPanelMaxMapArea: 496000,
        balloonPanelMaxHeightRatio: 0.5,
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
      this.objectManager = objectManager;
      this.myMap.geoObjects.add(objectManager);

      this.updateMap();
    },

    filterOffices(filters) {
      this.currentFilters = filters;

      if (this.currentFilters.length === 0) {
        this.objectManager.setFilter(function (obj) {
          return true;
        });
      } else {
        this.objectManager.setFilter(function (obj) {
          return filters.some(n => n.name.some(name => obj.properties[name]) || (n.name == 'LSALE' && obj.properties.typeObject == 'agent'));
        });
      }

      this.filteredOffices = filterData(this.allOffices, this.currentFilters);
      //После фильтрации нужно повторно отсортировать для корректного порядка в кластерах
      this.filteredOffices = sortOffices(this.filteredOffices, this.centerCoords);

      if (this.tabMetroVisible) {
        this.closeMetroCard();
        const offices = this.filteredOffices?.reduce((acc, office) => {
          if (office.IDUNDERGROUND.length > 0) {
            this.getOfficesByStations(acc, office);
          }
          return acc;
        }, {});
        this.changeStationAttribute(offices);
      }

      this.objectManager.objects.getAll().filter(function(x) {
        return !this.objectManager.getObjectState(x.id).isFilteredOut;
      });
    },

    getGeoObjects(offices) {
      const myGeoObjects = [];

      for (let office of offices) {
        myGeoObjects.push({
            type: 'Feature',
            id: office.ID + '0',
            geometry: {
              type: 'Point',
              coordinates: [office.NLAT, office.NLONG],
            },
            properties: {
              balloonContent: getTemplate(office),
              hintContent: `${office.SSHORTNAME ?? "Офис продаж"}`,
              balloonShadowPane: "outerBalloon",

              typeObject: 'office',
              LOMS: office.LOMS,
              LREG_CENTER: office.LREG_CENTER,
              LSALE: office.LSALE,
              LSPR: office.LSPR,
            },
            options: {
              hideIconOnBalloonOpen: false,
              iconLayout: "default#image",
              iconImageHref: "/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
              iconImageSize: [56, 56],
              iconImageOffset: [-28, -28],
              balloonOffset: [66, -10],
            }
          });
      }

      return myGeoObjects;
    },

    customRound(number) {
      let i = number % 1 * 100;
      let newNumber = number;
      if (i < 25)
        newNumber = Math.floor(number);
      else if (i < 75)
        newNumber = Math.floor(number) + 0.5;
      else
        newNumber = Math.ceil(number);

      return newNumber;
    },

    getPhone() {
      let agentsMapUtmSource = new URLSearchParams(window.location.search).get('utm_source');
      if (agentsMapUtmSource != null && agentsMapUtmSource != "" && agentsMapUtmSource != "reso"){
        return this.phonePromo;
      }
      if (this.width < 768) {
        return this.phoneMobile;
      }
      return this.phoneDesktop;
    },

    getTemplateLayoutAgentCard(item) {
      let agent = item.agent;
      let urlApiPhoto = "/system/modules/ru.reso.v2/actions/compressAgentPhoto.jpeg?id=" + agent.IDAGENT;
      let ratingClass = 'stars' + (this.customRound(agent.SRATING) + "").replace('.', '_');
      let srcImgAgent = (agent.NPHOTOSIZE != 0 ? " src='" + urlApiPhoto + "' onerror='this.src=\"" + (agent.LSEX ? "/system/modules/ru.reso.v2/resources/img/ImageMap/profile.png" : "/system/modules/ru.reso.v2/resources/img/ImageMap/femaleProfile.png") + "\"'" : " src='" + (agent.LSEX ? "/system/modules/ru.reso.v2/resources/img/ImageMap/profile.png" : "/system/modules/ru.reso.v2/resources/img/ImageMap/femaleProfile.png") + "'");

      const listNumbers = agent.PHONE.split(",");
      const patternTempPhone = `${this.getPhone().slice(0, 1)}(${this.getPhone().slice(1, 4)})${this.getPhone().slice(4, 7)}-${this.getPhone().slice(7, 9)}-${this.getPhone().slice(9, 11)}`;

      return (`<div class="agent-card-item" data-agent_id="${agent.ID}">
            <!--<span class="agent-card-stars ${ratingClass}"></span>-->
            ${agent.LEVELID > 2 ? '<p class="agent-card-rating">' + agent.LEVELNAME + '</p>' : ''}
            <p class="agent-card-name">${agent.NAME}</p>
        <span class="agent-card-message">Агент поможет оформить полис</span>
        <img ${srcImgAgent} class="agent-card-img">
            <a class="gent-card-call" href="tel:${this.getPhone()},${listNumbers[1]}" onclick="Window.saveLogAgentOnOfficesMap({
            pressButton: 'Y',
            phone: this.href.split(',')[1]
          });">
              <p class="agent-card-tel">${patternTempPhone}<br><span>доб. </span>${listNumbers[1]}</p>
              <div class="agent-card-tel-button"></div>
            </a>
          </div>`);
    },

    getBalloonAgentsData(agentsData) {
      let balloonAgentsData = [];

      for (let item of agentsData) {
        let currDistance = undefined;

        balloonAgentsData.push(
          {
            type:"Feature",
            id: item.ID + '1',
            geometry:{
              type:"Point",
              coordinates:[item.NLATITUDE,item.NLONGITUDE]
            },
            properties:{
              balloonContent: this.getTemplateLayoutAgentCard({agent: item, distance: currDistance}, 'balloon'),
              clusterCaption:"",
              hintContent:item.NAME,
              productList:item.SPRODUCTLIST,

              typeObject: 'agent',
            },
            options:{
              openEmptyBalloon:true,
              iconLayout:"default#image",
              iconImageHref:'/system/modules/ru.reso.v2/resources/img/icons/pin_agent.svg',
              iconImageSize:[42, 42],
              iconImageOffset:[-17,-17],
              hideIconOnBalloonOpen: false,
              balloonOffset: [57, 0]
            }
          }
        );

      }

      return balloonAgentsData;
    },

    /*getDistance(a, b) {
      return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    },*/

    updateMap(state) {
      if (state?.center) {
        this.centerCoords = state.center;
      } else {
        this.centerCoords = this.myMap.getCenter();
      }
      let zoom = this.myMap.getZoom();
      if (state?.zoom) zoom = state.zoom;

      this.filteredOffices = sortOffices(this.filteredOffices, this.centerCoords);
      //this.filteredOffices.sort( (a, b) => this.getDistance([a.NLAT, a.NLONG], this.centerCoords) > this.getDistance([b.NLAT, b.NLONG], this.centerCoords) ? 1 : -1);

      let minLat = this.centerCoords[0];
      let minLong = this.centerCoords[1];
      let maxLat = this.filteredOffices[0].NLAT;
      let maxLong = this.filteredOffices[0].NLONG;
      if (minLat > maxLat) {
        minLat = this.filteredOffices[0].NLAT;
        maxLat = this.centerCoords[0];
      }
      if (minLong > maxLong) {
        minLong = this.filteredOffices[0].NLONG;
        maxLong = this.centerCoords[1];
      }
      let bounds = [[minLat, minLong], [maxLat, maxLong]];
      let mapSize = this.myMap.container.getSize();
      if (mapSize[0] == 0 || mapSize[1] == 0) {
        mapSize = [this.width, this.height];
      }
      let newState = ymaps.util.bounds.getCenterAndZoom(bounds, mapSize);

      if (newState.zoom <= zoom) {
        this.myMap.setCenter(newState.center);
        this.myMap.setZoom(newState.zoom);
      } else {
        if (state?.center) {
          this.myMap.setCenter(state.center);
        }
        if (state?.zoom) {
          this.myMap.setZoom(zoom);
        }
      }
    },

    async showOnMap(data) {
      if (data) {
        this.regionId = data.data.kladr_id.substring(0, 2);

        if (this.tabMetroVisible) {
          this.closeMetroCard();
          this.currentStation = data.data.metro != null ? data.data.metro[0].name.replace("ё", "е") : null;

          if (this.tabMetroSelected) {
            const _this = this;
            const map = document.querySelector(".g-svg-metromap");

            map?.children.forEach((child) => {
              if (child.tagName === "use" && data.data.metro[0].name.replace("ё", "е") === child.dataset.station.replace("ё", "е")) {
                child.setAttribute("href", "#balloon-select");
                _this.positionSelectBalloon();
              }
            });
          }
        } else {
          this.currentStation = null;
        }

        if (data.data.qc_geo < 5) {
          this.updateMap({center: [data.data.geo_lat, data.data.geo_lon], zoom: (data.data.qc_geo < 3 ? 15 : 12)});
        } else {

          let res = await ymaps.geocode(data.value, {
            results: 1
          });
          let bounds = res.geoObjects.get(0).properties.get('boundedBy');
          this.myMap.setBounds(bounds, {
            checkZoomRange: true
          });

          let mapSize = this.myMap.container.getSize();
          if (mapSize[0] == 0 || mapSize[1] == 0) {
            mapSize = [this.width, this.height];
          }
          let newState = ymaps.util.bounds.getCenterAndZoom(bounds, mapSize);
          this.centerCoords = newState.center;

          //this.filteredOffices.sort( (a, b) => this.getDistance([a.NLAT, a.NLONG], this.centerCoords) > this.getDistance([b.NLAT, b.NLONG], this.centerCoords) ? 1 : -1);
          this.filteredOffices = sortOffices(this.filteredOffices, this.centerCoords);
        }

      } else {
        this.closeMetroCard();
        this.currentStation = null;
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

    changeStationAttribute(offices, activeStation) {
      const useNodes = document.getElementsByTagName("use");
      for (const use of useNodes) {
        const station = use.getAttribute("data-station");
        if (offices[station]) {
          if (station == activeStation) {
            use.setAttribute("href", "#balloon-select");
          } else {
            use.setAttribute("href", "#balloon-open");
          }
        } else {
          use.setAttribute("href", "");
        }
      }
    },
  },
  computed: {
    isMobile() {
      return this.width < 992;
    },
    searchPlaceholder() {
      return this.regionId == 77 || this.regionId == 78 ? "Введите адрес или метро" : "Введите адрес";
    },
    tabMetroVisible() {
      return this.regionId == 77;
    },
    tabMetroSelected() {
      return this.currentTab == 1 && this.tabMetroVisible;
    },
    allOffices() {
      return this.$store.getters["mapV3/getRegionOffices"];
    },
    allAgents() {
      return this.$store.getters["mapV3/getAgentsData"];
    },
    officesOnPage() {
      if (this.filteredOffices) {
        if (this.isMobile) {

          let officesArr = [];
          const countedOffices = this.filteredOffices?.reduce((acc, office) => {
            if (office.IDUNDERGROUND.length > 0 && office.IDTOWN == 1) {
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

          officesArr = officesArr?.sort(
            (a, b) => a.info[0].NDISTANSE - b.info[0].NDISTANSE
          );

          if (this.currentStation) {
            officesArr = officesArr.filter(
              (item) => item.station == this.currentStation
            );
          }

          if (!this.isShownMore) {
            return officesArr.slice(0, 6);
          }
          return officesArr.slice(0, 100);

        } else {
          const start = (this.page - 1) * this.pagesCount;
          const end = start + this.pagesCount;

          if (this.currentStation) {
            const filteredByStation = [];
            this.filteredOffices.forEach((item) => {
              item.IDUNDERGROUND.forEach((s) => {
                const station = s.SNAME.toLowerCase().replace("ё", "е");
                const currentStation = this.currentStation
                  .toLowerCase()
                  .replace("ё", "е");
                if (
                  station === currentStation &&
                  station.length === currentStation.length &&
                  item.IDTOWN == 1
                ) {
                  filteredByStation.push(item);
                }
              });
            });
            return filteredByStation;
          }

          return this.filteredOffices.slice(start, end);
        }
      }
    },

    cardVisible() {
      return this.circleClicked && this.stationOffices.length;
    },
  },

  watch: {
    tabMetroSelected() {
      if (this.tabMetroSelected) {
        const offices = this.filteredOffices?.reduce((acc, office) => {
          if (office.IDUNDERGROUND.length > 0) {
            this.getOfficesByStations(acc, office);
          }
          return acc;
        }, {});
        this.changeStationAttribute(offices, this.currentStation);

        this.$nextTick(() => {
          this.positionSelectBalloon();
        });
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
