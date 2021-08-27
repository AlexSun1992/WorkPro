<template>
  <div>
    <b-form-group>
      <template v-slot:label><span v-html="data.label"></span></template>
      <autocomplete
        :data="data"
        :search="search"
        @submit="handleSubmit"
      ></autocomplete>
    </b-form-group>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "AutoComplete",
  components: { Autocomplete },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      group: [],
      requestAddress: null,
    };
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        return [];
      }
      this.group = [];
      this.requestAddress = null;

      if (this.data.name === "ADDRESS_REG") {
        this.requestAddress = "address";
      } else if (this.data.name === "SVEHICLE_MODEL") {
        this.requestAddress = "brandmodel";
      }

      const response = await fetch(
        `/suggestions/api/4_1/rs/suggest/${this.requestAddress}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );
      const result = await response.json();

      result.suggestions.forEach((item) => {
        this.group.push(item.value);
      });

      return this.group;
    },
    handleSubmit(result) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result,
      });
    },
  },
};
</script>

<style scoped></style>
