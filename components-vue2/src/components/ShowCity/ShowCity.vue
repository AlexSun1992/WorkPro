<template>
  <div>
    <b-dropdown
      lazy="true"
      size="md"
      variant="link"
      toggle-class="text-decoration-none"
      no-caret
      :text="city"
      ref="dropdown"
    >
      <b-dropdown-header>Ваш город {{ city }}?</b-dropdown-header>
      <b-dropdown-item>
        <span
          @click="setAutoCity(city)"
          class="gotolk btn_trn btn-p-sm btn-icon-left"
        >
          Да, верно
        </span>
        <span
          class="btn gotolk btn_trn btn-p-sm btn-icon-left btn-secondary"
          @click="showModalSelectCity()"
        >
          Нет, другой
        </span>
      </b-dropdown-item>
    </b-dropdown>
    <b-modal id="select-city" size="lg" hide-footer>
      <template #modal-title> Выберите город</template>
      <div>
        <span>
          <strong> Ваш город: {{ city }} </strong>
        </span>
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
        <hr />

        <div class="col-lg-12>">
          <div class="row">
            <div :class="`col-lg-${12 / cols}`" v-for="column in columns">
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
  },
  data() {
    return {
      city: null,
      popularCities: cities,
      cols: 3,
    };
  },
  async created() {
    this.city =
      localStorage.getItem("location_user") ||
      (await this.$axios.get(`/am/free/v2/data/55/800/0/0`).then((res) => {
        this.$refs.dropdown.show(true);
        if (res.data[0]._data[0].TOWN) {
          return res.data[0]._data[0].TOWN.replace(/г/gi, "");
        } else {
          return "Москва";
        }
      }));
  },
  methods: {
    setSearchedCity(result) {
      if (result.data["city"]) {
        this.city = result.data["city"];
      }
      localStorage.setItem("location_user", this.city);
    },
    setPopularCity(result) {
      this.$refs.autocomplete.value = result.text;
      this.city = result.text;
      localStorage.setItem("location_user", this.city);
    },
    setAutoCity(result) {
      localStorage.setItem("location_user", result);
    },
    showModalSelectCity() {
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
