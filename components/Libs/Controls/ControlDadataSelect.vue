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
        :debounce-time="isFIOincludes ? 0 : 300"
        :search="search"
        :get-result-value="getResultValue"
        :default-value="getCurrentValue"
        :disabled="!edit ? !edit : data.readonly"
        @submit="handleSubmit"
        @blur="handleBlur"
        @focus="moveCaretToEnd($event)"
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
import { isFieldFIONotValid } from "./controlDadataSelect.helper";

//  dadata query
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
  if (queryType === "SVEHICLE_MODEL" || queryType === "SVEHICLE_MODEL_CASCO") {
    return {
      query: "brandmodel",
      body: {
        query: input,
        filters: [{ car_type: "Л" }, { car_type: "Д" }, { car_type: "МА" }, { car_type: "МЛ" }],
        count: 20,
      },
      id: "brand_model_code",
    };
  }

  if (queryType === "SVEHICLE_MODEL_CASCO") {
    return {
      query: "brandmodel_casco",
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
      currentValue: "",
      isTouched: false,
      isFieldValid: null,
    };
  },

  async mounted() {
    if (
      this.data.value &&
      typeof this.data.value === "string" &&
      (this.data.name === "SVEHICLE_MODEL" || this.data.name === "SVEHICLE_MODEL_CASCO")
    ) {
      this.$refs.autocomplete.value = this.data.value;
      const reserveGroup = await this.search(this.data.value);
      const exactlyValue = reserveGroup.find((i) => this.data.value.toUpperCase() === i.value.toUpperCase());

      if (exactlyValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: exactlyValue?.data,
        });
        this.isFieldValid = true;
      }
    }
  },

  destroyed() {
    this.isTouched = false;
  },

  computed: {
    disabled() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    validClass() {
      if (this.isFieldValid === true) {
        return "is-valid";
      }
      if (typeof this.isFieldValid !== "object" && this.isFieldValid === false) {
        return "is-invalid";
      }

      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      if (this.isFieldValid === null) {
        return "";
      }
      return "";
    },
    getCurrentValue() {
      const isVehicleModel = ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].includes(this.data.name);
      if (
        this.data.value !== undefined &&
        this.data.value !== null &&
        isVehicleModel &&
        typeof this.data.value === "string"
      ) {
        if (this.data.value.indexOf("|") !== -1) {
          return this.data.value.split("|")[1];
        }
        return this.data.value;
      }

      if (isVehicleModel && typeof this.data.value === "object") {
        return this.data.value.brand_model_modification;
      }

      return this.data.value;
    },

    isFIOincludes() {
      const fioFields = ["SECONDNAME", "FIRSTNAME", "THIRDNAME"].some((name) => this.data.name.includes(name));
      return fioFields;
    },

    isVehicleModelIncludes() {
      const fioFields = ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].some((name) => this.data.name.includes(name));
      return fioFields;
    },
  },

  watch: {
    getCurrentValue(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.$refs.autocomplete.value = oldValue;
      }
    },
  },

  methods: {
    moveCaretToEnd(event) {
      const isMobile = window.innerWidth <= 992;
      if (!isMobile) return;

      const targetEl = event.target;

      const len = targetEl.value.length;

      setTimeout(() => {
        targetEl.setSelectionRange(len, len);
        targetEl.scrollLeft = targetEl.scrollWidth;
      }, 0);
    },

    async search(input) {
      this.isFieldValid = null;

      if (this.isFIOincludes && input.charAt(0) === " ") {
        input = "";
        this.$refs.autocomplete.value = "";
        return;
      }
      const regex = this.data.regex || /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;

      const isInputNotValid = isFieldFIONotValid(input, regex);

      if (input !== "") {
        this.isTouched = true;
      }

      if ((this.isFIOincludes && this.isTouched === true) || input === "") {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: input.trim(),
        });
      }

      if (this.isFIOincludes && isInputNotValid) {
        this.group = [];
        return this.group;
      }

      if (input.length < 1) {
        this.group = [];
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
      const isVehicleField = ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].includes(this.data.name);

      if (isVehicleField) {
        this.currentValue = result.data?.brand_model_modification;
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: result.data,
        });
      }

      if (!isVehicleField) {
        // if this.id, finalValue looks like this:
        // "110230|ВАЗ 2114"

        const hasPrefix = !this.isFIOincludes && this.id;
        const prefix = result?.data?.[this.id] || "";
        const finalValue = hasPrefix ? `${prefix}|${result?.value}` : result?.value;

        this.currentValue = finalValue.trim();
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: finalValue,
        });
      }

      document.activeElement.blur();
    },

    async handleBlur() {
      const autocomplete = (this.$refs.autocomplete?.value || "").trim();

      if (this.currentValue === autocomplete) {
        return;
      }
      if (this.isVehicleModelIncludes) {
        this.$refs.autocomplete.value = this.$refs.autocomplete?.value.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, "");
      }

      const find = this.group.find((i) => autocomplete.toUpperCase().includes(i.value.toUpperCase()));
      const exactlyValue = this.group.find((i) => autocomplete.toUpperCase() === i.value.toUpperCase());

      if (find !== undefined || exactlyValue !== undefined) {
        this.handleSubmit(exactlyValue || find);
        if (this.isVehicleModelIncludes) {
          this.$refs.autocomplete.value = exactlyValue ? exactlyValue?.value : find?.value;
        }
        this.isFieldValid = true;

        return;
      }
      if (this.group?.length === 0) {
        if (this.isVehicleModelIncludes) {
          const reserveGroup = await this.search(autocomplete.trim());
          const find = reserveGroup.find((i) => autocomplete.includes(i.value));
          if (find) {
            this.isFieldValid = true;
            this.handleSubmit(find);
          }
          if (!find) {
            this.isFieldValid = false;
            this.$emit("update", {
              fieldId: this.data.fieldId,
              name: this.data.name,
              value: autocomplete.trim(),
            });
          }
        } else {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            name: this.data.name,
            value: autocomplete.trim(),
          });
        }
      } else {
        if (this.group.length !== 0 && this.isVehicleModelIncludes) {
          this.isFieldValid = false;
        }
        this.handleSubmit({ value: autocomplete.trim() });
      }
    },
  },
};
</script>

<style scoped></style>
