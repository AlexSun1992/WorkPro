<template>
  <div>
    <div>
      <autocomplete
        placeholder="Поиск города"
        ref="autocomplete"
        :debounce-time="300"
        :search="search"
        :get-result-value="getResultValue"
        :default-value="city"
      >
      </autocomplete>
    </div>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

function getParams(input) {
  return {
    query: "address",
    body: {
      query: input,
    },
  };
}
export default {
  name: "UserLocation",
  components: {
    Autocomplete,
  },
  data() {
    return {
      city: null,
      selectedCity: null,
    };
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        return [];
      }
      const { query, body } = getParams(input);
      return await this.$axios.post(`/api/suggestions/${query}`, body).then((resp) => resp.data.suggestions);
    },
    getResultValue(item) {
      return item.value;
    },
  },
};
</script>
