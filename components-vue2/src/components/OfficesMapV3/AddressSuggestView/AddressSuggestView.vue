<template>
  <div>
    <b-form-group>
      <autocomplete
        ref="autocomplete"
        placeholder="Введите адрес или метро"
        :auto-select="true"
        :debounce-time="300"
        :search="search"
        :get-result-value="getResultValue"
        @submit="handleSubmit"
        @blur="handleBlur"
      />
    </b-form-group>
    <button
      v-show="!isInputEmpty"
      @click="clearSuggest"
      class="suggest-clear"
    ></button>
  </div>
</template>

<script>
/* eslint-disable */
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "AddressSuggestView",
  components: { Autocomplete },
  data() {
    return {
      group: [],
      requestAddress: null,
      id: "",
      input: "",
      textMap: "",
      textMetro: "",
      isInputEmpty: true,
    };
  },
  props: {
    isMetro: {
      type: Boolean,
    },
  },
  methods: {
    async search(input, onlyCity) {
      this.group = [];
      if (input.length < 1) {
        return [];
      }
      const query = "address";
      let body = {
        query: input,
      };
      if (this.isMetro) {
        body = {
          query: input,
          locations: [
            {
              city_fias_id: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
              street_type_full: "метро",
            },
          ],
        };
      }
      if (onlyCity) {
        body = {
          query: input,
          from_bound: { value: "city" },
          to_bound: { value: "settlement" },
        };
      }
      const response = await fetch(`/api/suggestions/${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      result.suggestions.forEach((item) => {
        this.group.push(item);
      });

      return result?.suggestions || [];
    },
    getResultValue(item) {
      if (this.isMetro) {
        this.textMetro = item.data.street;
        this.textMap = item.value;
        return item.data.street;
      }
      this.textMetro = item.data.metro == null ? "" : item.data.street;
      this.textMap = item.value;
      return item.value;
    },
    handleSubmit(result) {
      if (result) {
        this.input = result.value;
        this.isInputEmpty = false;
        this.$emit("update", result);
      } else {
        this.isInputEmpty = true;
      }
    },
    handleBlur() {
      const find = this.group.find((i) => this.$refs.autocomplete?.value === i.value);
      if (find === undefined) {
        if (this.group.length > 0) {
          this.$refs.autocomplete.value = this.getResultValue(this.group[0]);
          this.handleSubmit(this.group[0]);
        } else {
          this.clearSuggest();
        }
      } else {
        this.$refs.autocomplete.value = this.getResultValue(find);
        this.handleSubmit(find);
      }
    },
    clearSuggest() {
      if (this.isMetro) {
        this.textMetro = "";
      } else {
        this.textMap = "";
      }
      this.input = "";
      this.$refs.autocomplete.value = "";
      this.isInputEmpty = true;
      this.$emit("update", null);
    },
  },
  computed: {
    cityData() {
      return this.$store.getters["map/getCity"];
    },
  },
  watch: {
    isMetro(newVal) {
      if (newVal) {
        this.$refs.autocomplete.value = this.textMetro;
        this.isInputEmpty = !this.textMetro;
      } else {
        this.$refs.autocomplete.value = this.textMap;
        this.isInputEmpty = !this.textMap;
      }
    },
    async cityData() {
      let city = this.$store.getters["map/getCity"]?.city;
      if (!this.input && city) {
        let result = await this.search(city, true);
        this.textMap = result[0].value;
        this.isInputEmpty = false;
        this.$refs.autocomplete.value = this.textMap;
        this.$emit("update", result[0]);
      }
    },
  },
};
</script>

<style scoped></style>
