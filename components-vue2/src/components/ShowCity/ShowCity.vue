<template>
  <div>
    <span id="show-btn" @click="$bvModal.show('select-city')">
      {{ city }}
    </span>
    <b-modal id="select-city" size="lg" hide-footer>
      <template #modal-title> Выберите ваш город</template>
      <div>
        Воспользуйтесь поиском если не нашли ваш регион в списке:
        <autocomplete
          placeholder="Поиск региона"
          :debounce-time="300"
          :search="search"
          :get-result-value="getResultValue"
          @submit="setSearchedCity"
        >
        </autocomplete>
        <span>
          <strong> Ваш регион: {{ city }} </strong>
        </span>
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
        return res.data[0]._data[0].TOWN.replace(/г/gi, "") || "Москва";
      }));
  },
  methods: {
    setSearchedCity(result) {
      this.city = result.data["city"];
      localStorage.setItem("location_user", this.city);
    },
    setPopularCity(result) {
      this.city = result.text;
      localStorage.setItem("location_user", this.city);
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
      return this.popularCities.sort(compare);
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
