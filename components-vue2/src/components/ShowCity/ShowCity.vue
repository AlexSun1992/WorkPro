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
import { cities } from "./cities.js";
import { BButton, BCollapse, BCard } from "bootstrap-vue";
import Cookies from "js-cookie";

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
  data() {
    return {
      city: null,
      visible: false,
      kladr: null,
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
            this.city = res.data[0]._data[0].TOWN.replace(/г/gi, "");
          }
          if (res.data[0]._data[0].KLADR_ID) {
            this.kladr = res.data[0]._data[0].KLADR_ID;
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
    },
    setPopularCity(result) {
      this.$refs.autocomplete.value = result.text;
      this.city = result.text;
      this.kladr = result.kladr_id;
      Cookies.set("kladr_id", this.kladr);
      Cookies.set("location_user", this.city);
    },
    setAutoCity(result) {
      this.visible = false;
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
