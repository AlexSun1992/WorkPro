<template>
  <div>
    <b-form-group>
      <template v-slot:label><span v-html="data.label"></span></template>
      <autocomplete
        :data="data"
        :autoSelect="true"
        :search="search"
        :getResultValue="getResultValue"
        @submit="handleSubmit"
        :disabled="disabled"
      >
      </autocomplete>
    </b-form-group>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

function getQueryParams(queryType, input) {
  if (queryType === "SADDRESS_REG") {
    return {
      query: "address",
      body: {
        query: input,
      },
    };
  }
  if (queryType === "SCITY_SETTLEMENT") {
    return {
      query: "address",
      body: {
        query: input,
        from_bound: {
          value: "city",
        },
        to_bound: {
          value: "settlement",
        },
      },
    };
  }
  if (queryType === "SVEHICLE_MODEL") {
    return {
      query: "brandmodel",
      body: {
        query: input,
      },
      id: "id",
    };
  }
  throw new Error(
    `Неизвестное название поля для компонента ControlDadataSelect.vue: ${queryType}`
  );
}

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
      id: "",
    };
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        return [];
      }

      this.group = [];
      const { query, body, id } = getQueryParams(this.data.name, input);
      if (id) {
        this.id = id;
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

      return this.group;
    },
    getResultValue(item) {
      return item.value;
    },
    handleSubmit(result) {
      console.log(result);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.id
          ? `${result.data[this.id]}|${result.value}`
          : result.value,
      });
    },
  },
  computed: {
    disabled() {
      return this.$store.getters["data_card/getReadOnly"];
    },
  },
};
</script>

<style scoped></style>
