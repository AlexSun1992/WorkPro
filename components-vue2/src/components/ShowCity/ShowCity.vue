<template>
  <div>
    <span id="show-btn" @click="$bvModal.show('bv-modal-example')">
      {{ data }}
    </span>
    <b-modal id="bv-modal-example" hide-footer>
      <template #modal-title> Выберите ваш город</template>
      <div class="d-block text-center">
        <p class="my-4">
          Воспользуйтесь поиском если не нашли ваш регион в списке:
        </p>
        <b-form-group>
          <template>
            <span> </span>
          </template>
          <autocomplete placeholder="Поиск региона" :search="search">
          </autocomplete>
        </b-form-group>
        <span>
          <strong> Ваш регион: {{ data }} </strong>
        </span>
        <div v-for="item in popularCityes" :key="item.id">
          <span @click="changeCity(item)">{{ item.text }}</span>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "ChangeCity",
  components: {
    Autocomplete,
  },
  data() {
    return {
      data: [],
      popularCityes: [
        {
          id: 1,
          text: "Ростов-на-Дону",
        },
        {
          id: 2,
          text: "Волгоград",
        },
        {
          id: 3,
          text: "Краснодар",
        },
        {
          id: 4,
          text: "Воронеж",
        },
        {
          id: 5,
          text: "Белгород",
        },
        {
          id: 6,
          text: "Санкт-Петербург",
        },
        {
          id: 7,
          text: "Москва",
        },
        {
          id: 8,
          text: "Саратов",
        },
      ],
    };
  },
  async created() {
    const url = "/am/free/v2/data/55/800/0/0";
    let response = await fetch(url);
    let data = await response.json();
    let currentCity = data[0]._data[0].TOWN;
    this.data = currentCity;
    localStorage.setItem("location_dadata", this.data);
    return this.data;
  },
  methods: {
    changeCity(input) {
      this.data = input.text;
      localStorage.setItem("location_user", this.data);
    },
    async search() {},
  },
};
</script>

<style lang="scss" scoped></style>
