<template>
  <div>
    <b-form-group :class="{ required: data.required }">
      <template v-slot:label><span v-html="data.label"></span></template>
      <autocomplete
        ref="autocomplete"
        :debounce-time="300"
        :search="search"
        :get-result-value="getResultValue"
        @submit="handleSubmit"
        @blur="handleBlur"
        :disabled="disabled"
      >
      </autocomplete>
      <b-form-invalid-feedback :state="data.state">
        Обязательно для заполнения
      </b-form-invalid-feedback>
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
      input: null,
    };
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        return [];
      }
      this.input = input;
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
      this.input = result.value;
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.id
          ? `${result.data[this.id]}|${result.value}`
          : result.value,
      });
    },
    handleBlur() {
      const find = this.group.find((i) => this.input.includes(i.value));
      if (find === undefined) {
        this.$refs.autocomplete.value = "";
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: null,
        });
      } else {
        this.$refs.autocomplete.value = find.value;
      }
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
