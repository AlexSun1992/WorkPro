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
          <autocomplete
            placeholder="Поиск региона"
            ref="autocomplete"
            :search="search"
          >
          </autocomplete>
          <!-- <b-form-invalid-feedback>
            {{ errorText }}
          </b-form-invalid-feedback> -->
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

/* function getQueryParams(input) {
  return {
    query: "address",
    body: {
      query: input,
    },
  };
} */
export default {
  name: "ChangeCity",
  components: {
    Autocomplete,
  },
  /* props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  }, */
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
      input: null,
      group: [],
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
  methods: {
    async search(input) {
      console.log(input);
      if (input.length < 1) {
        return [];
      }

      const url = "/api/4_1/rs/suggest/address";
      const query = "москва хабар";

      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: query }),
      };

      await fetch(url, options)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      /* const query = getQueryParams(input);
      const response = await fetch(`/api/suggestions/${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.input),
      });
      console.log(response);
      const result = await response.json();
      console.log(result); */
    },
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
