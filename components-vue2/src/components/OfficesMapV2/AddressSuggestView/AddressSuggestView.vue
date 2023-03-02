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
      textMap: '',
      textMetro: '',
    };
  },
  props: {
    isMetro: {
      type: Boolean,
    },
  },
  methods: {
    async search(input) {
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
            }
          ],
        }
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
      if (this.isMetro){
        this.textMetro = item.data.street;
        this.textMap = item.value;
        return item.data.street;
      }
      this.textMetro = '';
      this.textMap = item.value;
      return item.value;
    },
    handleSubmit(result) {
      this.input = result?.value;
      this.$emit("update", result);
    },
    handleBlur() {
      const find = this.group.find((i) =>
        this.$refs.autocomplete?.value.includes(i.value)
      );
      if (find === undefined) {
        this.handleSubmit(null);
      }
    },
    clearSuggest() {
      if (this.isMetro) {
        this.textMetro = '';
      } else {
        this.textMap = '';
      }
      this.input = '';
      this.$refs.autocomplete.value = '';
    },
  },
  computed: {
    isInputEmpty() {
      return !(this.input);
    },
  },
  watch: {
    isMetro(newVal) {
      if (newVal) {
        this.$refs.autocomplete.value = this.textMetro;
        this.input = this.textMetro;
      } else {
        this.$refs.autocomplete.value = this.textMap;
        this.input = this.textMap;
      }
    },
  },
};
</script>

<style scoped></style>
