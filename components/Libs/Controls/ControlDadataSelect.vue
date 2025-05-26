<template>
  <div>
    <b-form-group :class="{ required: data.required }">
      <label :for="data.name">
        {{ data.label }}
        <span
          v-if="data.helpText"
          class="position-relative"
          >&nbsp;
          <span class="tooltipster">
            (?)<vue-easy-tooltip
              :with-arrow="true"
              position="top"
              :offset="4"
            >
              <span v-html="data.helpText" /></vue-easy-tooltip></span
        ></span>
      </label>

      <autocomplete
        ref="autocomplete"
        :placeholder="data.placeholder"
        :class="validClass"
        :auto-select="true"
        :debounce-time="300"
        :search="search"
        :get-result-value="getResultValue"
        :default-value="getCurrentValue"
        :disabled="!edit ? !edit : data.readonly"
        @submit="handleSubmit"
        @blur="handleBlur"
        :id="data.name"
      />
      <b-form-invalid-feedback :state="data.state">
        {{ data.error ? data.error : "Обязательно для заполнения" }}
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
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
        filters: [{ car_type: "Л" }, { car_type: "Д" }, { car_type: "МА" }, { car_type: "МЛ" }],
      },
      id: "brand_model_code",
    };
  }

  if (queryType.includes("SECONDNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["SURNAME"],
      },
    };
  }

  if (queryType.includes("THIRDNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["PATRONYMIC"],
      },
    };
  }

  if (queryType.includes("FIRSTNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["NAME"],
      },
    };
  }

  throw new Error(`Неизвестное название поля для компонента ControlDadataSelect.vue: ${queryType}`);
}

export default {
  name: "AutoComplete",
  components: { Autocomplete, BFormGroup },
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
      input: "",
    };
  },

  computed: {
    disabled() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
    getCurrentValue() {
      if (this.data.value !== undefined && this.data.value !== null && this.data.name === "SVEHICLE_MODEL") {
        return this.data.value.split("|")[1];
      }

      return this.data.value;
    },
  },

  methods: {
    async search(input) {
      if (input.length < 1) {
        this.group = [];
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
        value: this.id ? `${result.data[this.id] || ""}|${result.value}` : result.value,
      });
    },

    handleBlur() {
      const find = this.group.find((i) => this.$refs.autocomplete?.value.includes(i.value));
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
        this.$refs.autocomplete.value = null;
      } else {
        this.$refs.autocomplete.value = this.group[0].value;
        this.handleSubmit(this.group[0]);
      }
    },
  },
};
</script>

<style scoped></style>
