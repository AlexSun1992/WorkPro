<template>
  <div class="map-container mt-3">
    <div
      :class="[templatesToShow.length ? '' : 'd-none']"
      id="regcenter"
      v-html="templatesToShow.join('')"
      class="card"
    ></div>
    <div class="office-tab-content" style="position: relative">
      <div ref="map" id="map" class="map"></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import { getTemplate } from "../../../../utils/map/helpers/helpers";
import getCurrentCity from "../../../../utils/map/currentCity";

Vue.use(LoadScript);
export default {
  name: "PaymentMap",

  data() {
    return {
      myMap: null,
      myClusterer: null,
      mapState: null,
      regionId: null,
      centerCoords: null,
      address: null,
      placemark: null,
      city: "",
      qc_geo: null,
      regCenters: null,
      isCardVisible: false,
      geoObjectTemplates: [],
      templatesToShow: [],
      balloonTemplate: "",
      width: window.innerWidth,
      height: window.innerHeight,
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
        await getCurrentCity().then(
          async ({
            lat = "55.75396",
            lon = "37.620393",
            kladr = "7700000000000",
          }) => {
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
        this.regCenters = this.$store.getters["map/getRegionOffices"].filter(
          (item) => item.LREG_CENTER
        );
        if (this.regCenters.length) {
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
    async init() {
      const lat = Cookies.get("lat");
      const lon = Cookies.get("lon");
      if (lat && lon) {
        this.centerCoords = [lat, lon];
      }
      this.myClusterer = new ymaps.Clusterer({
        preset: "islands#darkGreenClusterIcons",
      });
      this.myClusterer.add(this.getGeoObjects(this.regCenters));
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
      const body = document.getElementsByTagName("body")[0];
      this.myMap.geoObjects.events.add.bind(this);
      this.myMap.geoObjects.events.add("balloonopen", (e) => {
        body.classList.add("open-balloon");
        const target = e.get("target");
        this.balloonTemplate = target.properties.get("balloonContentBody");
        this.templatesToShow = this.geoObjectTemplates.filter(
          (template) => !this.balloonTemplate.includes(template)
        );
        if (this.templatesToShow.length) {
          this.isCardVisible = true;
          const regCenter = document.querySelector("#regcenter");
          if (regCenter) {
            regCenter.classList.remove("is-active");
            regCenter.style.top =
              40 +
              document.querySelector(".ymaps-2-1-79-balloon").offsetHeight +
              "px";
          }
        }
        target.options.set(
          "iconImageHref",
          "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent_active.svg"
        );
      });
      this.myMap.geoObjects.events.add("balloonclose", (e) => {
        this.isCardVisible = false;
        body.classList.remove("open-balloon");
        const target = e.get("target");
        target?.options.set(
          "iconImageHref",
          "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg"
        );
      });

      // Fires by F5
      this.openBalloon();
    },

    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },

    combineAgencies(agencies, i, count) {
      const agenciesArr = [];
      const slicedAgencies = agencies.slice(i, i + count);
      slicedAgencies.forEach((item) => {
        agenciesArr.push(getTemplate(item));
      });
      return agenciesArr;
    },
    getGeoObjects(agencies) {
      const myGeoObjects = [];
      const uniqueItemsCount = agencies.reduce((acc, item) => {
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
              "https://reso.ru/export/system/modules/ru.reso.v2/resources/img/icons/ya_agent.svg",
            iconImageSize: [56, 56],
            iconImageOffset: [0, 0],
          }
        );
      }
      return myGeoObjects;
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
      this.myMap.setCenter(
        this.centerCoords && !state.center ? this.centerCoords : state.center,
        this.qc_geo > 2 ? zoom : 15
      );
      this.placemark.geometry.setCoordinates(
        this.centerCoords && !state.center ? this.centerCoords : state.center
      );
      this.placemark.properties.set({
        iconCaption: caption,
        balloonContent: caption,
      });

      this.geoObjectTemplates.length = 0;

      // Fires by changing city
      this.openBalloon();
    },

    showResult(obj) {
      const mapContainer = document.getElementById("map");
      const bounds = obj.properties.get("boundedBy");
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
      try {
        this.address = await this.$axios.post("/api/suggestions/address", {
          query: suggest,
          count: 1,
        });
        this.qc_geo = this.address.data.suggestions[0].data.qc_geo;
        this.city = suggest;
        this.centerCoords = coords;
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

        const offices = this.$store.getters["map/getRegionOffices"].filter(
          (item) => item.LREG_CENTER
        );
        this.myClusterer.add(this.getGeoObjects(offices));
        this.myMap.geoObjects.add(this.myClusterer);
      } catch (e) {
        console.log(e);
      }
      const showResult = this.showResult.bind(this);
      ymaps.geocode(suggest).then((res) => {
        showResult(res.geoObjects.get(0));
      });
    },

    openBalloon() {
      if (window.innerWidth > 992) {
        this.myClusterer.getGeoObjects().forEach((obj, i) => {
          this.geoObjectTemplates.push(
            obj.properties.get("balloonContentBody")
          );
          obj.balloon.open([this.regCenters[i].NLAT, this.regCenters[i].NLON]);
        });
      } else {
        this.myMap.options.set("balloonAutoPan", false);
        this.regCenters = this.$store.getters["map/getRegionOffices"].filter(
          (item) => item.LREG_CENTER
        );

        this.myMap.setCenter(
          [
            this.regCenters[0].NLAT,
            this.regCenters[0].NLON || this.regCenters[0].NLONG,
          ],
          12
        );
      }
    },
  },
  computed: {
    cityData() {
      return this.$store.getters["map/getCity"];
    },
  },

  watch: {
    async cityData() {
      this.myMap.geoObjects.remove(this.placemark);
      this.showOnMap(
        this.$store.getters["map/getCity"]?.city,
        this.$store.getters["map/getCity"]?.coords
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
