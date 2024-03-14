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
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "AddressSuggestView",
  components: { Autocomplete, BFormGroup },
  data() {
    return {
      group: [],
      requestAddress: null,
      id: "",
      input: "",
    };
  },
  methods: {
    async search(input) {
      this.group = [];
      if (input.length < 1) {
        return [];
      }
      const { query, body } = {
        query: "address",
        body: {
          query: input,
        },
      };
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
  },
};
</script>

<style scoped></style>
