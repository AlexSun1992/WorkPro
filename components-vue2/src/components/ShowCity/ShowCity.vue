<template>
  <div>
    <span id="show-btn" @click="$bvModal.show('select-city')">
      {{ city }}
    </span>
    <b-modal id="select-city" hide-footer>
      <template #modal-title> Выберите ваш город</template>
      <div class="d-block text-center">
        <autocomplete
          placeholder="Выберите город"
          :debounce-time="300"
          :search="search"
          :get-result-value="getResultValue"
          @submit="setSearchedCity"
        >
        </autocomplete>
        <span>
          <strong> Ваш регион: {{ city }} </strong>
        </span>
        <div v-for="item in popularCities" :key="item.id">
          <span @click="setPopularCity(item)" style="cursor: pointer">{{
            item.text
          }}</span>
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
    };
  },
  async created() {
    await this.$axios.get(`/am/free/v2/data/55/800/0/0`).then((res) => {
      this.city = res.data[0]._data[0].TOWN || "г. Москва";
      localStorage.setItem("location_user", this.city);
    });
  },
  methods: {
    setSearchedCity(result) {
      this.city = result.data["city_with_type"];
      localStorage.setItem("location_user", this.city);
    },
    setPopularCity(result) {
      this.city = `г. ${result.text}`;
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
};
</script>

<style lang="scss" scoped></style>
