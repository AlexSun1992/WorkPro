<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span v-if="data.helpText" class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip position="top" offset="4">
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <autocomplete
      :id="data.name"
      ref="autocomplete"
      :placeholder="placeholder"
      :class="validClass"
      :auto-select="true"
      :search="search"
      :get-result-value="getResultValue"
      :default-value="getCurrentValue"
      :disabled="!isEditable || data.readonly || isDisabledByRelation"
      @submit="handleSubmit"
      @blur="handleBlur"
    />

    <b-form-invalid-feedback :state="isErr">
      {{ data.error ? data.error : validationErrorText }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { BFormGroup } from "bootstrap-vue";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every(
      ({ value }) => value !== undefined && value !== null && value !== ""
    );
}

export default {
  name: "ControlCustomCombobox",
  components: {
    Autocomplete,
    BFormGroup,
  },
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
      placeholderValue: null,
      validationErrorText: null,
      isErr: null,
    };
  },
  computed: {
    isEditable() {
      return this.edit;
    },
    isDisabledByRelation() {
      return calcDisabledByRelation(this.fieldsRelations);
    },
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](
          this.data.fieldRelation.split(";")
        );
      }
      return [];
    },
    validClass() {
      if (this.isErr === false) {
        return "is-invalid";
      }
      if (this.isErr === true) {
        return "is-valid";
      }

      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }

      return "";
    },
    placeholder() {
      return this.placeholderValue
        ? this.placeholderValue
        : this.data.placeholder;
    },
    getCurrentValue() {
      return this.data.options.find(
        (item) => item.value === Number(this.data?.value)
      )?.text;
    },
  },
  watch: {
    getCurrentValue(value) {
      this.$refs.autocomplete.value = value;
    },
    validClass(value) {
      if (this.data.state === false && value === "is-invalid") {
        this.validationErrorText = "Обязательно для заполнения";
      }
    },
  },
  methods: {
    search(value) {
      if (value) {
        const findValueInList = this.data.options.find((i) =>
          i.text.includes(this.$refs.autocomplete?.value)
        );

        if (
          findValueInList === undefined &&
          this.$refs.autocomplete?.value !== undefined &&
          this.getCurrentValu === undefined
        ) {
          this.validationErrorText = `По фразе "${this.$refs.autocomplete?.value}" ничего не найдено`;
          this.isErr = false;
        }

        if (findValueInList !== undefined) {
          this.isErr = true;
        }
      }
      if (
        value.length < 1 ||
        this.data.options.find(
          (item) => item.value === Number(this.data?.value)
        )?.text === value
      ) {
        this.placeholderValue = value;
        this.$refs.autocomplete.value = "";
        return this.data.options;
      }

      return this.data.options.filter((item) => item.text.includes(value));
    },
    getResultValue(item) {
      return item.text;
    },
    handleSubmit(result) {
      document.activeElement.blur();
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result?.value ?? null,
      });
    },
    handleBlur() {
      if (Boolean(this.$refs.autocomplete.value) === false) {
        const value = this.data.options.find(
          (item) => item.value === Number(this.data?.value)
        );

        if (value === undefined) {
          this.validationErrorText = "Обязательно для заполнения";
          this.isErr = false;
          this.$refs.autocomplete.value = "";
        }
        if (value) {
          this.$refs.autocomplete.value = value.text;
          this.handleSubmit(value);
        }
      } else {
        const find = this.data.options.find((i) =>
          i.text.includes(this.$refs.autocomplete?.value)
        );
        if (find !== undefined) {
          this.$refs.autocomplete.value = find.text;
          this.isErr = true;

          this.handleSubmit(find);
        } else {
          this.validationErrorText = "Выберите значение из выпадающего списка";
          this.$refs.autocomplete.value = "";
          this.placeholderValue = "";
          this.handleSubmit(null);
        }
      }
    },
  },
};
</script>
