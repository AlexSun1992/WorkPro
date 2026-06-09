<template>
  <div>
    <button
      type="button"
      class="btn btn-link select-sity"
      @click="handleCityHeadClick"
      id="btn_city_head_all"
      ref="btnCityHead"
    >
      {{ city }}
    </button>
    <div
      class="sity-question collapse show"
      v-if="visible"
    >
      <div>
        <div class="close-sity-block" />
        <div class="sity-block-text">
          Ваш город: <b>{{ city }}</b>
        </div>
        <button
          type="button"
          class="btn btn-primary btn-icon-left"
          @click="setAutoCity(city)"
          id="btn_yes_city_head_all"
        >
          Да, верно
        </button>
        <button
          type="button"
          class="btn btn-secondary ml-3"
          @click="showModalSelectCity"
          id="btn_change_city_head_all"
        >
          Нет, другой
        </button>
      </div>
    </div>
    <ControlModal
      id="select-city"
      hide-footer
      :is-open="isCityModalOpen"
      :has-footer="false"
      :show-close="true"
      :show-ok="false"
      :show-cancel="false"
      :close-on-out-side-click="true"
      @close="onCityModalClose"
    >
      <template #title> Выберите город </template>

      <div>
        <div class="mb-2">
          <strong> Ваш город: {{ city }} </strong>
        </div>

        <ControlDadataSelect2
          :data="{
            name: 'SCITY_SETTLEMENT',
            placeholder: 'Поиск города',
            value: city,
          }"
          :edit="true"
          @update="setSearchedCity"
        />
        <div class="mt-2">
          <div class="row">
            <div
              v-for="column in columns"
              :key="column.id"
              :class="`col-lg-${12 / cols}`"
            >
              <div
                v-for="item in column"
                :key="item.id"
              >
                <span
                  style="cursor: pointer"
                  @click="setPopularCity(item)"
                >
                  {{ item.text }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ControlModal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import cities from "@/utils/cities";
import getCurrentCity from "@/utils/map/currentCity";
// eslint-disable-next-line import/extensions
import { addListener, notifyListeners } from "@/utils/map/listeners.service";
import ControlModal from "../Libs/Controls/AsyncModalAction/ControlModal";
import ControlDadataSelect2 from "@/components/Libs/Controls/ControlDadataSelect2";

export default {
  name: "ShowCity",
  components: {
    ControlDadataSelect2,
    ControlModal,
  },
  props: {
    changeCity: {
      type: Function,
      required: false,
      default: () => "",
    },
  },
  data() {
    return {
      city: null,
      visible: false,
      kladr: null,
      lat: null,
      lon: null,
      popularCities: [...cities].sort((a, b) => {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      }),
      cols: 3,
      request: null,
      isCityModalOpen: false,
    };
  },
  computed: {
    sortedPopularCities() {
      return this.popularCities;
    },
    columns() {
      const columns = [];
      const mid = Math.ceil(this.sortedPopularCities.length / this.cols);
      for (let col = 0; col < this.cols; col++) {
        columns.push(this.sortedPopularCities.slice(col * mid, col * mid + mid));
      }
      return columns;
    },
  },
  async created() {
    addListener(this.setCookies);
    this.popularCities.unshift({
      id: 1,
      kladr_id: "7700000000000",
      text: "Москва",
      lat: "55.75396",
      lon: "37.620393",
    });
    if (Cookies.get("location_user") && Cookies.get("kladr_id")) {
      this.kladr = Cookies.get("kladr_id");
      this.city = Cookies.get("location_user");
    } else {
      getCurrentCity().then(({ kladr, city }) => {
        if (city && kladr) {
          this.city = city;
          this.kladr = kladr;
          this.changeCity({
            city,
            kladr,
          });
        }
      });
    }
  },
  methods: {
    setSearchedCity(result) {
      if (result.value.data.city) {
        this.city = result.value.data.city;
      }
      this.kladr = result.value.data.kladr_id;
      Cookies.set("kladr_id", this.kladr, { expires: 365 });
      Cookies.set("location_user", this.city, { expires: 365 });
      Cookies.set("lat", result.value.data.geo_lat, { expires: 365 });
      Cookies.set("lon", result.value.data.geo_lon, { expires: 365 });

      this.changeCity({
        city: this.city,
        kladr: this.kladr,
      });

      this.isCityModalOpen = false;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [result.value.data.geo_lat, result.value.data.geo_lon],
      });
    },

    setCookies() {
      if (Cookies.get("location_user") && Cookies.get("kladr_id")) {
        this.kladr = Cookies.get("kladr_id");
        this.city = Cookies.get("location_user");
      }
    },
    onCityModalClose(event) {
      this.isCityModalOpen = false;
    },
    setPopularCity(result) {
      this.city = result.text;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [result.lat, result.lon],
      });
      this.kladr = result.kladr_id;
      Cookies.set("kladr_id", this.kladr, { expires: 365 });
      Cookies.set("location_user", this.city, { expires: 365 });
      Cookies.set("lat", result.lat, { expires: 365 });
      Cookies.set("lon", result.lon, { expires: 365 });
      this.changeCity({ city: this.city, kladr: this.kladr });

      this.isCityModalOpen = false;
      notifyListeners();
    },
    setAutoCity(result) {
      this.visible = false;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [this.lat, this.lon],
      });
      Cookies.set("kladr_id", this.kladr, { expires: 365 });
      Cookies.set("location_user", result, { expires: 365 });
    },
    showModalSelectCity() {
      this.visible = false;
      this.isCityModalOpen = true;
      this.$nextTick(() => {
        document.querySelectorAll(".close")[0].blur();
      });
    },

    getResultValue(item) {
      return item.value;
    },
    handleCityHeadClick() {
      this.visible = !this.visible;
      if (this.visible) {
        this.$nextTick(() => this.$refs.btnCityHead?.blur());
      }
    },
  },
};
</script>
