<template>
  <div>
    <autocomplete
      :search="search"
      aria-label="Search for a country"
      :placeholder="placeholderString"
      @click="handleSubmit"
    ></autocomplete>
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
    link: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      group: [],
      suggestionType: "",
      placeholderString: "",
    };
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        return [];
      }

      this.group = [];

      const response = await fetch(
        `/suggestions/api/4_1/rs/suggest/${this.suggestionType}`,
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
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value,
        });
      },
    },
  },
  created() {
    this.suggestionType = this.link;
    this.placeholderString = this.placeholder;
  },
};
</script>

<style scoped></style>
