<template>
  <div class="wrapper">
    <a
      style="text-decoration: none"
      href="#"
      v-b-modal.modal-center
      class="city btn-link"
      @click="loadCities"
      >{{ city }}</a
    >
    <b-modal id="modal-center" size="xl" centered hide-footer hide-header>
      <h2>
        <strong>Выберите регион или город</strong>
      </h2>
      <b-input-group class="mt-4">
        <autocomplete
          :suggestions="allCities ? allCities : []"
          @update="foundCity = $event"
          :placeholder="'Выберите регион или город'"
        ></autocomplete>
        <b-input-group-append class="ml-3">
          <b-button @click="applyFoundCity" variant="success">Выбрать</b-button>
        </b-input-group-append>
      </b-input-group>
      <ul class="popular-cities" v-if="top6cities">
        <li v-for="(item, i) in top6cities" @click="setCity(item)" :key="i">
          {{ item }}
        </li>
      </ul>
      <div class="container" v-if="top30cities">
        <div class="col" v-for="(column, i) in columns" :key="i">
          <div @click="setCity(item)" v-for="(item, i) in column" :key="i">
            {{ item }}
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import Autocomplete from "~/components/Libs/Autocomplete/Autocomplete";

export default {
  components: { Autocomplete },
  data() {
    return {
      city: null,
      top6cities: null,
      top30cities: null,
      foundCity: null,
      cols: 4,
      allCities: null,
      value: "",
    };
  },
  async created() {
    // Нужно передавать ip клиента через nginx бэку
    // this.city = this.$store.state.cities.city;
    this.city = "Москва";
  },
  methods: {
    async loadCities() {
      // Изменить на метод получения популярных городов
      const {
        data: { top6cities, top30cities },
      } = await this.$axios.get("/api/cities");
      this.top6cities = top6cities;
      this.top30cities = top30cities;
      this.getAllCities();
    },
    setCity(item) {
      this.city = item;
      this.$bvModal.hide("modal-center");
    },
    applyFoundCity() {
      this.city = this.foundCity;
      this.$bvModal.hide("modal-center");
    },
    async getAllCities() {
      // Изменить на метод получения всех городов в выпадающем списке
      const {
        data: { top6cities, top30cities },
      } = await this.$axios.get("/api/cities");
      this.allCities = top30cities;
    },
  },
  computed: {
    columns() {
      const columns = [];
      const mid = Math.ceil(this.top30cities.length / this.cols);
      for (let col = 0; col < this.cols; col++) {
        columns.push(this.top30cities.slice(col * mid, col * mid + mid));
      }
      return columns;
    },
    menu() {
      return this.$store.getters["pages/getMenu"];
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
}
.container {
  margin-top: 30px;
  display: flex;
  padding-left: 0;
}
.popular-cities {
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
  cursor: pointer;
  & li {
    display: inline;
    margin-right: 20px;
  }
}
.col {
  flex-grow: 1;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  & > div {
    cursor: pointer;
  }
}
.city {
  cursor: pointer;
}
</style>
