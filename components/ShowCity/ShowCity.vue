<template>
  <div>
    <button
      type="button"
      class="btn btn-link select-sity"
      @click="visible = !visible"
      id="btn_city_head_all"
    >
      {{ city }}
    </button>
    <div
      class="sity-question collapse show"
      v-if="visible"
    >
      <b-card>
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
          @click="showModalSelectCity()"
          id="btn_change_city_head_all"
        >
          Нет, другой
        </button>
      </b-card>
    </div>
    <ControlModal
      id="select-city"
      size="lg"
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

        <autocomplete
          ref="autocomplete"
          placeholder="Поиск города"
          :debounce-time="300"
          :search="search"
          :get-result-value="getResultValue"
          :default-value="city"
          @submit="setSearchedCity"
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
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { BCard } from "bootstrap-vue";
import Cookies from "js-cookie";
import cities from "@/utils/cities";
import getCurrentCity from "@/utils/map/currentCity";
// eslint-disable-next-line import/extensions
import { addListener, notifyListeners } from "@/utils/map/listeners.service";
import ControlModal from "../Libs/Controls/AsyncModalAction/ControlModal";

function getParams(input) {
  return {
    query: "address",
    body: {
      query: input,
      from_bound: {
        value: "city",
      },
      to_bound: {
        value: "settlement",
      },
    },
  };
}
export default {
  name: "ShowCity",
  components: {
    Autocomplete,
    BCard,
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
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
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
      if (result.data.city) {
        this.city = result.data.city;
      }
      this.kladr = result.data.kladr_id;
      Cookies.set("kladr_id", this.kladr, { expires: 365 });
      Cookies.set("location_user", this.city, { expires: 365 });
      Cookies.set("lat", result.data.geo_lat, { expires: 365 });
      Cookies.set("lon", result.data.geo_lon, { expires: 365 });

      this.changeCity({
        city: this.city,
        kladr: this.kladr,
      });

      this.isCityModalOpen = false;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [result.data.geo_lat, result.data.geo_lon],
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
      this.$refs.autocomplete.value = result.text;
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
    },

    async search(input) {
      if (input.length < 1) {
        return [];
      }
      const { query, body } = getParams(input);
      return await this.$axios.post(`/api/suggestions/${query}`, body).then((resp) => {
        const { suggestions } = resp.data;
        return suggestions.filter((suggestion) => suggestion.data.city);
      });
    },
    getResultValue(item) {
      return item.value;
    },
  },
};
</script>
