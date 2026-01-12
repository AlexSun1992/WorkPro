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
      v-mask="data.mask"
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
    <b-form-invalid-feedback :state="isErr || isInvalidClass">
      {{ data.error ? data.error : validationErrorText }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { BFormGroup } from "bootstrap-vue";
import { findUnSensitiveCaseCoincidence } from "./ControlCustomCombobox.helper";
import { applyMask as _mask } from "@/utils/utils";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every(({ value }) => value !== undefined && value !== null && value !== "");
}

export default {
  name: "ControlCustomCombobox",
  components: {
    Autocomplete,
    BFormGroup,
  },
  directives: {
    mask: _mask,
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
    oneToManyData: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      placeholderValue: null,
      validationErrorText: null,
      isStatusRequired: null,
      isTouch: false,
    };
  },
  mounted() {
    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });
    }
  },
  computed: {
    isRequired() {
      return this.data.required;
    },
    isErr() {
      return this.data.state;
    },
    isEditable() {
      return this.edit;
    },
    isDisabledByRelation() {
      return calcDisabledByRelation(this.fieldsRelations);
    },
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](this.data.fieldRelation.split(";"));
      }
      return [];
    },
    validClass() {
      if (this.isErr === false && this.data.required) {
        return "is-invalid";
      }
      if (this.isErr === true && this.data.required) {
        return "is-valid";
      }

      if (this.data.state !== null && this.data.state !== undefined && this.data.required && this.isErr !== null) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }

      return "";
    },
    isInvalidClass() {
      return this.validClass !== "is-invalid";
    },
    placeholder() {
      return this.placeholderValue && this.data.value ? this.placeholderValue : this.data.placeholder;
    },
    getCurrentValue() {
      return this.data.options.find((item) => item.value === Number(this.data?.value))?.text;
    },
  },
  watch: {
    getCurrentValue(value, oldValue) {
      this.$refs.autocomplete.value = value;

      if (value !== oldValue || (!value && !oldValue)) {
        this.updateValue();
      }
      // Сбрасываем isTouch здесь, так как после изменеия в handleBlur всё равно срабатывает watch для getCurrentValue
      this.isTouch = false;
    },
    validClass(value) {
      if (this.data.state === false && value === "is-invalid" && this.data.required) {
        this.validationErrorText = "Обязательно для заполнения";
      }
    },
    isRequired(value) {
      if (value === false) {
        this.validationErrorText = null;
      }
    },
  },

  methods: {
    search(value) {
      if (value) {
        const findValueInList = this.data.options.find((i) =>
          findUnSensitiveCaseCoincidence(i.text, this.$refs.autocomplete?.value)
        );

        if (findValueInList === undefined && this.$refs.autocomplete?.value !== undefined) {
          this.updateState(false, `По фразе "${this.$refs.autocomplete?.value}" ничего не найдено`);
        }

        if (findValueInList !== undefined) {
          this.updateState(true, null);
        }
      }
      if (
        value.length < 1 ||
        this.data.options.find((item) => item.value === Number(this.data?.value))?.text === value
      ) {
        this.placeholderValue = value;
        this.$refs.autocomplete.value = "";
        return this.data.options;
      }

      return this.data.options.filter((item) => findUnSensitiveCaseCoincidence(item.text, value));
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
      this.isTouch = true;
      this.updateValue();
    },
    updateValue() {
      if (Boolean(this.$refs.autocomplete.value) === false) {
        const value = this.data.options.find((item) => item.value === Number(this.data?.value));

        /* this.validationErrorText = null;
        this.isErr = this.isTouch ? true : null; */
        this.updateState(this.isTouch ? true : null, null);

        if ((value === undefined || value === null) && this.data.required && this.isTouch) {
          /* this.validationErrorText = "Обязательно для заполнения";
          this.isErr = false; */
          this.updateState(false, "Обязательно для заполнения");
          this.$refs.autocomplete.value = "";
        }
        if (value) {
          this.$refs.autocomplete.value = value.text;
          this.handleSubmit(value);
        }
      } else {
        const find = this.data.options.find((i) =>
          findUnSensitiveCaseCoincidence(i.text, this.$refs.autocomplete?.value)
        );

        if (find !== undefined) {
          /* this.$refs.autocomplete.value = find.text;
          this.isErr = this.isTouch ? true : null; */
          this.updateState(this.isTouch ? true : null, null);
          this.handleSubmit(find);
        } else {
          this.$refs.autocomplete.value = "";
          this.placeholderValue = "";

          if (!this.isRequired) {
            /* this.isErr = this.isTouch ? true : null;
            this.validationErrorText = null; */
            this.updateState(this.isTouch ? true : null, null);
          }

          this.validationErrorText = this.isRequired && this.isTouch ? "Выберите значение из выпадающего списка" : null;

          this.handleSubmit(null);
        }
      }
    },
    updateState(state, message) {
      this.$store.commit("data_card/setFieldState", {
        fieldId: this.data?.fieldId,
        state,
        error: message,
        oneToManyData: this.oneToManyData,
      });
    },
  },
};
</script>
