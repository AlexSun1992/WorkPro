<template>
  <div>
    <b-form-group :class="{ required: data.required }">
      <template v-slot:label
        ><span v-html="data.label"></span
        ><span v-if="data.helpText">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span
      ></template>
      <autocomplete
        :placeholder="data.placeholder"
        ref="autocomplete"
        :class="validClass"
        :auto-select="true"
        :debounce-time="300"
        :search="search"
        :get-result-value="getResultValue"
        :default-value="getCurrentValue"
        @submit="handleSubmit"
        @blur="handleBlur"
        :disabled="!edit ? !edit : data.readonly"
      >
      </autocomplete>
      <b-form-invalid-feedback :state="data.state">
        {{ data.error ? data.error : "Обязательно для заполнения" }}
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
function getQueryParams(queryType, input) {
  if (queryType.includes("ADDRESS")) {
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
      id: "brand_model_code",
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
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
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
          ? `${result.data[this.id] || ""}|${result.value}`
          : result.value,
      });
    },

    handleBlur(value) {
      const find = this.group.find((i) =>
        this.$refs.autocomplete?.value.includes(i.value)
      );
      if (find !== undefined) {
        this.handleSubmit(find);
        return;
      }
      if (this.group.length === 0) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: null,
        });
      } else {
        this.$refs.autocomplete.value = this.group[0].value;
        this.handleSubmit(this.group[0]);
      }
    },
  },

  computed: {
    disabled() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    errorText() {
      if (this.data.state === false) {
        if (this.$refs.autocomplete.value !== "") {
          return this.data?.helpText ? this.data.helpText : errorText;
        }
        return errorText;
      }
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      } else {
        return "";
      }
    },
    getCurrentValue() {
      if (
        this.data.value !== undefined &&
        this.data.value !== null &&
        this.data.name === "SVEHICLE_MODEL"
      ) {
        return this.data.value.split("|")[1];
      }
      return this.data.value;
    },
  },
};
</script>

<style scoped></style>
