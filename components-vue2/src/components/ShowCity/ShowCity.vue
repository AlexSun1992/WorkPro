<template>
  <div>
    <b-button class="select-sity" variant="link" @click="visible = !visible">
      {{ city }}
    </b-button>
    <b-collapse v-model="visible" class="sity-question">
      <b-card>
        <div class="close-sity-block"></div>
        <div class="sity-block-text">
          Ваш город: <b>{{ city }}</b>
        </div>
        <b-button
          variant="primary"
          @click="setAutoCity(city)"
          class="btn-icon-left"
        >
          Да, верно
        </b-button>
        <b-button
          variant="secondary"
          class="ml-3"
          @click="showModalSelectCity()"
        >
          Нет, другой
        </b-button>
      </b-card>
    </b-collapse>
    <b-modal id="select-city" size="lg" hide-footer>
      <template #modal-title>Выберите город</template>
      <div>
        <div class="mb-2">
          <strong> Ваш город: {{ city }} </strong>
        </div>
        <autocomplete
          placeholder="Поиск города"
          ref="autocomplete"
          :debounce-time="300"
          :search="search"
          :get-result-value="getResultValue"
          @submit="setSearchedCity"
          :defaultValue="city"
        >
        </autocomplete>
        <div class="mt-2">
          <div class="row">
            <div
              :class="`col-lg-${12 / cols}`"
              v-for="column in columns"
              :key="column.id"
            >
              <div v-for="item in column" :key="item.id">
                <span @click="setPopularCity(item)" style="cursor: pointer">{{
                  item.text
                }}</span>
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
import { BButton, BCollapse, BCard } from "bootstrap-vue";
import Cookies from "js-cookie";
import cities from "./cities";

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
  name: "ChangeCity",
  components: {
    Autocomplete,
    BButton,
    BCollapse,
    BCard,
  },
  props: {
    changeCity: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      city: null,
      visible: false,
      kladr: null,
      lat: null,
      lon: null,
      popularCities: cities,
      cols: 3,
      request: null,
    };
  },
  async created() {
    if (Cookies.get("location_user") && Cookies.get("kladr_id")) {
      this.kladr = Cookies.get("kladr_id");
      this.city = Cookies.get("location_user");
    } else {
      this.request = await this.$axios
        .get(`/am/free/v2/data/55/800/0/0`)
        .then((res) => {
          this.visible = true;
          if (res.data[0]._data[0].TOWN) {
            this.city = res.data[0]._data[0].TOWN.replace(/^г/i, "");
            Cookies.set("location_user", this.city);
          }
          if (res.data[0]._data[0].KLADR_ID) {
            this.kladr = res.data[0]._data[0].KLADR_ID;
            Cookies.set("kladr_id", this.kladr);
          }
          if (res.data[0]._data[0].LAT) {
            this.lat = res.data[0]._data[0].LAT;
          }
          if (res.data[0]._data[0].LON) {
            this.lon = res.data[0]._data[0].LON;
          }
          if (!res.data[0]._data[0].TOWN) {
            this.city = "Москва";
            Cookies.set("location_user", this.city);
          }
          if (!res.data[0]._data[0].KLADR_ID) {
            this.kladr = "7700000000000";
            Cookies.set("kladr_id", this.kladr);
          }
          if (!res.data[0]._data[0].LAT) {
            this.lat = "55.75396";
          }
          if (!res.data[0]._data[0].LON) {
            this.lon = "37.620393";
          }
          if (this.city && this.kladr) {
            this.changeCity({
              city: this.city,
              kladr: this.kladr,
            });
          }
        });
    }
  },
  methods: {
    setSearchedCity(result) {
      if (result.data["city"]) {
        this.city = result.data["city"];
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
    },
    setAutoCity(result) {
      this.visible = false;
      this.$store.dispatch("map/setCity", {
        city: this.city,
        coords: [this.lat, this.lon],
      });
      Cookies.set("kladr_id", this.kladr);
      Cookies.set("location_user", result);
    },
    showModalSelectCity() {
      this.visible = false;
      this.$bvModal.show("select-city");
    },
    async search(input) {
      if (input.length < 1) {
        return [];
      }
      const { query, body } = getParams(input);
      return await this.$axios
        .post(`/api/suggestions/${query}`, body)
        .then((resp) => {
          return resp.data.suggestions;
        });
    },
    getResultValue(item) {
      return item.value;
    },
  },
  computed: {
    sortedPopularCities: function () {
      function compare(a, b) {
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
        return 0;
      }
      this.popularCities.sort(compare);
      this.popularCities.unshift({
        id: 1,
        kladr_id: "7700000000000",
        text: "Москва",
        lat: "55.75396",
        lon: "37.620393",
      });
      return this.popularCities;
    },
    columns() {
      const columns = [];
      const mid = Math.ceil(this.sortedPopularCities.length / this.cols);
      for (let col = 0; col < this.cols; col++) {
        columns.push(
          this.sortedPopularCities.slice(col * mid, col * mid + mid)
        );
      }
      return columns;
    },
  },
};
</script>

<style lang="scss" scoped></style>
