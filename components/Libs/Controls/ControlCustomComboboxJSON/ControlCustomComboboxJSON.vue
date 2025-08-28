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
            <span v-html="data.helpText" />
          </vue-easy-tooltip>
        </span>
      </span>
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
      :default-value="currentValue"
      :disabled="disabled"
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
import { isEqual } from "lodash";
import { findUnSensitiveCaseCoincidence } from "../ControlCustomCombobox/ControlCustomCombobox.helper";
import { applyMask as _mask } from "@/utils/utils";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every(({ value }) => value !== undefined && value !== null && value !== "");
}

export default {
  name: "ControlCustomComboboxJSON",

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
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    placeholderValue: null,
    validationErrorText: null,
    isErr: null,
  }),

  computed: {
    currentFieldName() {
      return this.data.name;
    },
    options() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](this.data.fieldId)?.options ?? [];
    },
    currentValue() {
      return this.data.value?.text ?? null;
    },
    disabled() {
      return !this.edit || this.data.readonly || this.isDisabledByRelation;
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
      const { required, state } = this.data;

      if (!required) {
        return "";
      }

      if (typeof state === "boolean") {
        return state ? "is-valid" : "is-invalid";
      }

      if (this.isErr === true) {
        return "is-valid";
      }

      if (this.isErr === false) {
        return "is-invalid";
      }

      return "";
    },
    placeholder() {
      return this.placeholderValue || this.data.placeholder || "Выберете из списка";
    },
  },

  watch: {
    getCurrentValueText(value) {
      this.$refs.autocomplete.value = value ?? null;
    },
    validClass(value) {
      if (this.data.state === false && value === "is-invalid" && this.data.required) {
        this.validationErrorText = "Обязательно для заполнения";
      }
    },
    fieldsRelations(value) {
      const isRelationValueUpdated = value?.find((item) => {
        const valueHistory = this.$store.getters["data_card/getFormValueHistoryByField"](item.name);

        if (valueHistory?.[1]) {
          return !isEqual(valueHistory[1], item.value);
        }

        return false;
      });

      if (isRelationValueUpdated) {
        this.handleBlur();
      }
    },
  },

  methods: {
    selectItem(value) {
      const valuePrepare = { ...value };

      Object.keys(valuePrepare).map((key) => {
        if (Number.isInteger(valuePrepare[key]) === false) {
          try {
            JSON.parse(valuePrepare[key]);
            delete valuePrepare[key];
          } catch (e) {
            return null;
          }
        }
      });

      this.visible = false;
      this.$store.commit("data_card/setFilters", valuePrepare);
    },
    async search(value) {
      await this.getOptions(value);

      const fieldName = this.currentFieldName;
      const currentOption = this.options?.find((item) => item[fieldName] === this.currentValue);

      if (value) {
        const findValueInList = this.options?.find((i) =>
          findUnSensitiveCaseCoincidence(i[this.currentFieldName], this.$refs.autocomplete?.value)
        );

        if (findValueInList === undefined && this.$refs.autocomplete?.value !== undefined) {
          this.validationErrorText = `По фразе "${this.$refs.autocomplete?.value}" ничего не найдено`;
          this.isErr = false;
        }

        if (findValueInList !== undefined) {
          this.isErr = true;
        }
      }

      if (value?.length < 1 || currentOption?.[fieldName] === value) {
        this.placeholderValue = value ?? currentOption?.[fieldName];
        this.$refs.autocomplete.value = null;

        return this.options;
      }

      return this.options.filter((item) => findUnSensitiveCaseCoincidence(item[this.currentFieldName], value));
    },
    async getOptions(value) {
      const { fieldId } = this.data;
      const { zone } = this.$route.params;

      await this.$store.dispatch("data_card/fetchOptionsByJSON", { zone, fieldId, value });
    },
    getResultValue(item) {
      return item[this.currentFieldName] ?? "";
    },
    handleSubmit(result) {
      const value = result ? { value: result, text: result[this.currentFieldName] ?? null } : null;

      document.activeElement.blur();

      if (isEqual(value, this.data.value)) {
        return;
      }

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.currentFieldName,
        value,
      });

      this.selectItem(result);
    },
    handleBlur() {
      const fieldName = this.currentFieldName;

      if (Boolean(this.$refs.autocomplete.value) === false) {
        const value = this.options?.find((item) => item[fieldName] === this.currentValue);

        if (value === undefined && this.data.required) {
          this.validationErrorText = "Обязательно для заполнения";
          this.isErr = false;
          this.$refs.autocomplete.value = null;
        }

        if (value) {
          this.$refs.autocomplete.value = value[this.currentFieldName];
        }

        this.handleSubmit(value);
      } else {
        const find = this.options?.find((i) =>
          findUnSensitiveCaseCoincidence(i[this.currentFieldName], this.$refs.autocomplete?.value)
        );

        if (find !== undefined) {
          this.$refs.autocomplete.value = find[this.currentFieldName];
          this.isErr = true;
          this.handleSubmit(find);
        } else {
          this.$refs.autocomplete.value = null;
          this.placeholderValue = "";
          this.validationErrorText = "Выберите значение из выпадающего списка";

          if (!this.data.required) {
            this.isErr = null;
            this.validationErrorText = null;
          }

          this.handleSubmit(null);
        }
      }
    },
  },
};
</script>
