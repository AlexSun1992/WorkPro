<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <autocomplete
      :id="selectId"
      ref="autocomplete"
      :placeholder="placeholder"
      :class="validClass"
      :auto-select="true"
      :search="search"
      :get-result-value="getResultValue"
      :default-value="getCurrentValue"
      :disabled="!edit ? !edit : data.readonly || isDisabledByRelation"
      @submit="handleSubmit"
      @blur="handleBlur"
    />
    <b-form-invalid-feedback :state="!isErr">
      {{ data.error ? data.error : validationErrorText }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlEnum",
  components: { BFormGroup, Autocomplete },
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
      placeholderValue: "Выберите из списка",
      validationErrorText: null,
      isErr: null,
      selectId: `id${this.data.fieldId}`,
    };
  },
  created() {
    if (!this.data.fieldRelation) {
      this.initData();
    }
  },
  computed: {
    placeholder() {
      return this.placeholderValue ? this.placeholderValue : this.data.placeholder;
    },
    validClass() {
      if (this.data.required) {
        if (this.isErr === true) {
          return "is-invalid";
        }
        if (this.isErr === false) {
          return "is-valid";
        }

        if (this.data.state !== null && this.data.state !== undefined) {
          return this.data.state === true ? "is-valid" : "is-invalid";
        }
      }

      return "";
    },
    getCurrentValue() {
      return this.options.find((item) => item.value === Number(this.data?.value?.value))?.text;
    },

    relationValue() {
      if (this.data.fieldRelation) {
        const arrayFieldRelation = this.data.fieldRelation.split(";");
        if (arrayFieldRelation.length) {
          const fieldsRelations = this.$store.getters["data_card/getDataFieldsByNames"](arrayFieldRelation);
          if (fieldsRelations) {
            return fieldsRelations[0].value?.value;
          }
        }
      }
      return null;
    },

    isDisabledByRelation() {
      if (this.data.fieldRelation) {
        const arrayFieldRelation = this.data.fieldRelation.split(";");
        if (arrayFieldRelation.length) {
          const fieldsRelations = this.$store.getters["data_card/getDataFieldsByNames"](arrayFieldRelation);
          if (fieldsRelations.length > 0) {
            return !fieldsRelations.every((item) => item.value?.value);
          }
        }
      }
      return false;
    },
    options: {
      get() {
        if (this.$store.getters["data_card/getDataFieldByFieldId"](this.data.fieldId)?.options) {
          return this.$store.getters["data_card/getDataFieldByFieldId"](this.data.fieldId)?.options;
        }
        if (this.data.value) {
          return [this.data];
        }
        return [];
      },
    },
  },
  watch: {
    relationValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initData();
      }
    },
    validClass(value) {
      if (this.data.required) {
        if (this.data.state === false && value === "is-invalid") {
          this.validationErrorText = "Обязательно для заполнения";
        }
      }
    },
    getCurrentValue(value) {
      this.$refs.autocomplete.value = value;
    },
  },
  methods: {
    handleBlur() {
      if (Boolean(this.$refs.autocomplete.value) === false) {
        const value = this.options.find((item) => item.value == Number(this.data?.value?.value));
        if (value === undefined && this.data.required) {
          this.validationErrorText = "Обязательно для заполнения";
          this.isErr = true;
          this.$refs.autocomplete.value = "";
        }
        if (value) {
          this.$refs.autocomplete.value = value.text;
          this.handleSubmit(value);
        }
      } else {
        const find = this.options.find((i) => i.text.includes(this.$refs.autocomplete?.value));
        if (find !== undefined) {
          this.$refs.autocomplete.value = find.text;
          this.isErr = false;

          this.handleSubmit(find);
        } else {
          this.validationErrorText = "Выберите значение из выпадающего списка";
          this.isErr = true;
          this.$refs.autocomplete.value = "";
          this.placeholderValue = "";
          this.handleSubmit(null);
        }
      }
    },

    getResultValue(item) {
      return item.text;
    },
    search(value) {
      this.initData();
      if (value) {
        const findValueInList = this.options.find((i) => i.text.includes(this.$refs.autocomplete?.value));
        if (
          findValueInList === undefined &&
          this.$refs.autocomplete?.value !== undefined &&
          this.getCurrentValue === undefined
        ) {
          this.validationErrorText = `По фразе "${this.$refs.autocomplete?.value}" ничего не найдено`;
          this.isErr = true;
        }

        if (findValueInList !== undefined) {
          this.isErr = false;
        }
      }
      if (
        value.length < 1 ||
        this.options.find((item) => item.value === Number(this.data?.value?.value))?.text === value
      ) {
        this.placeholderValue = value;
        this.$refs.autocomplete.value = "";
        return this.options;
      }
      return this.options.filter((item) => item.text.includes(value));
    },
    async initData() {
      let data = { ...this.data };
      if (typeof this.data.value === "number") {
        data = {
          ...this.data,
          value: this.data.options.find((item) => item.value === this.data.value),
        };
      }
      await this.$store.dispatch("data_card/fetchDic", { ...data });
      if (this.data.fieldRelation) {
        this.$emit("update", {
          fieldId: data.fieldId,
          name: data.name,
          value: data.value || {},
        });
      }
    },
    handleSubmit(result) {
      document.activeElement.blur();
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result || null,
      });
    },
  },
};
</script>

<style scoped>
.ui.disabled.dropdown[data-v-3a0c7bea],
.ui.dropdown .menu > .disabled.item[data-v-3a0c7bea] {
  cursor: default;
  pointer-events: none;
  opacity: 1;
}

.error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}

.ui.selection.dropdown.error {
  border-color: #f86c6b;
  background: none;
}

.help-text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
