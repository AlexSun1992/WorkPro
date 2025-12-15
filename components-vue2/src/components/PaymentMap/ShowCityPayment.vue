<template>
  <div>
    <button
      type="button"
      class="btn btn-link select-sity"
      @click="showModalSelectCity()"
      id="btn_city_head_all"
    >
      {{ city }}
    </button>
    <b-modal
      id="select-city"
      size="lg"
      hide-footer
    >
      <template #modal-title> Выберите город </template>
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
                  >{{ item.text }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import Cookies from "js-cookie";
import cities from "@/utils/cities";
import getCurrentCity from "@/utils/map/currentCity";
// eslint-disable-next-line import/extensions
import { addListener, notifyListeners } from "@/utils/map/listeners.service";

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
  name: "ShowCityPayment",
  components: {
    Autocomplete,
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
      Cookies.set("kladr_id", this.kladr);
      Cookies.set("location_user", this.city);
      Cookies.set("lat", result.data.geo_lat);
      Cookies.set("lon", result.data.geo_lon);

      this.changeCity({
        city: this.city,
        kladr: this.kladr,
      });
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

    setPopularCity(result) {
      this.$refs.autocomplete.value = result.text;
      this.city = result.text;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [result.lat, result.lon],
      });
      this.kladr = result.kladr_id;
      Cookies.set("kladr_id", this.kladr);
      Cookies.set("location_user", this.city);
      Cookies.set("lat", result.lat);
      Cookies.set("lon", result.lon);
      this.changeCity({ city: this.city, kladr: this.kladr });
      notifyListeners();
    },

    showModalSelectCity() {
      this.$bvModal.show("select-city");
    },
    async search(input) {
      if (input.length < 1) {
        return [];
      }
      const { query, body } = getParams(input);
      return await this.$axios.post(`/api/suggestions/${query}`, body).then((resp) => resp.data.suggestions);
    },
    getResultValue(item) {
      return item.value;
    },
  },
};
</script>
