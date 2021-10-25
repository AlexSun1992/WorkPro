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
          <autocomplete> </autocomplete>
          <b-form-invalid-feedback>
            {{ errorText }}
          </b-form-invalid-feedback>
        </b-form-group>
        <span>
          <strong> Ваш регион: {{ data }} </strong>
        </span>
        <div v-for="item in popularCityes" key="item">
          <span>{{ item }}</span>
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
        "Ростов-на-Дону",
        "Волгогад",
        "Краснодар",
        "Воронеж",
        "Белгород",
        "Санкт-Петербург",
        "Москва",
        "Саратов",
      ],
    };
  },
  async created() {
    const url = "/am/free/v2/data/55/800/0/0";
    let response = await fetch(url);
    let data = await response.json();
    let currentCity = data[0]._data[0].TOWN;
    this.data = currentCity;
    return this.data;
  },
  /* methods: {
    async changedCity() {
      const url = "/am/free/v2/data/55/800/0/0";
      let response = await fetch(url);
      let data = await response.json();
      let currentCity = data[0]._data[0].TOWN;
      this.data = currentCity;
      console.log(this.data);
      return this.data;
    },
    async cityesList() {},
  }, */
};
</script>

<style lang="scss" scoped></style>
