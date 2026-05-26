<template>
  <form-group
    :label="data.label"
    :class="[data.required ? 'required' : '', data.readonly && currentValueText ? 'mobile-result' : '']"
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
    <SelectObjectFromMap
      :id="id"
      :class="validClass"
      v-mask="data.mask"
      @blur="handleBlur"
      @submit="handleSubmit"
      :data="this.data"
      :oneToManyData="this.oneToManyData"
      :currentValueText="this.currentValueText"
      :edit="this.edit"
      :getOptions="this.getOptions"
    />
    <div
      class="invalid-feedback"
      v-if="isErr === false"
    >
      {{ data.error ? data.error : validationErrorText }}
    </div>
  </form-group>
</template>

<script>
import isEqual from "lodash.isequal";
import SelectObjectFromMap from "@/components/Libs/Controls/ControlSelectObjectFromMap/SelectObjectFromMap";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import { findUnSensitiveCaseCoincidence } from "../ControlCustomCombobox/ControlCustomCombobox.helper";
import { applyMask as _mask } from "@/utils/utils";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every((data) => {
      const value = data.value?.value ? data.value.text : data.value;

      return value !== undefined && value !== null && value !== "";
    });
}

const ERROR_MSG = {
  REQUIRED: "Обязательно для заполнения",
  INVALID_SELECTION: "Выберите значение из выпадающего списка",
};

export default {
  name: "ControlSelectObjectFromMap",

  components: {
    FormGroup,
    SelectObjectFromMap,
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
    /**
     * @type import("./controlCustomComboboxJSON.types").OneToManyDataProp
     */
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    placeholderValue: null,
    validationErrorText: null,
    isErr: null,
  }),

  computed: {
    id() {
      return `${this.data.name}-${this.isOneToMany ? this.oneToManyData.index + 1 : 0}`;
    },
    isOneToMany() {
      return (
        this.oneToManyData?.fieldId && typeof this.oneToManyData?.index === "number" && this.oneToManyData.index >= 0
      );
    },
    formData() {
      if (this.isOneToMany) {
        const rootFields = this.$store.getters["data_card/getForm"].filter(
          (item) => item.type.toLowerCase() !== "onetomany"
        );

        return [
          ...rootFields,
          ...this.$store.getters["data_card/getOneToManyBlock"](this.oneToManyData.fieldId, this.oneToManyData.index),
        ];
      }

      return this.$store.getters["data_card/getForm"];
    },
    relationFieldsValue() {
      return this.fieldsRelations.reduce((acc, item) => {
        acc[item.name] = item.value;

        return acc;
      }, {});
    },
    currentFieldName() {
      return this.data.name;
    },
    options() {
      return (
        this.$store.getters["data_card/getDataFieldByFieldId"](
          this.data.fieldId,
          this.oneToManyData.fieldId,
          this.oneToManyData.index
        )?.options ?? []
      );
    },

    currentValue() {
      const value = this.$store.getters["data_card/getDataFieldByFieldId"](
        this.data.fieldId,
        this.oneToManyData?.fieldId,
        this.oneToManyData?.index
      )?.value;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (err) {
          console.log(err);
        }
      }
      return value;
    },
    currentValueText() {
      return this.currentValue?.text ?? null;
    },
    disabled() {
      return !this.edit || this.data.readonly || this.isDisabledByRelation;
    },
    isDisabledByRelation() {
      return calcDisabledByRelation(this.fieldsRelations);
    },
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](
          this.data.fieldRelation.split(";"),
          this.oneToManyData.fieldId,
          this.oneToManyData.index
        );
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

      if (this.isErr === true && state === true) {
        return "is-valid";
      }

      if (this.isErr === false) {
        return "is-invalid";
      }

      return "";
    },
    placeholder() {
      return this.placeholderValue || this.data.placeholder || "Выберите из списка";
    },
  },

  watch: {
    validClass(value) {
      if (this.data.state === false && value === "is-invalid" && this.data.required) {
        this.validationErrorText = ERROR_MSG.REQUIRED;
      }
    },
    relationFieldsValue(newVal, oldVal) {
      if (isEqual(newVal, oldVal)) {
        return;
      }
      this.handleBlur({ [this.currentFieldName]: null });
      this.placeholderValue = "";
    },
  },

  methods: {
    selectItem(value) {
      const valuePrepare = { ...value };

      // eslint-disable-next-line array-callback-return
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
      this.$store.dispatch("data_card/updateFiltersData", { filters: valuePrepare, index: this.oneToManyData?.index });
    },
    async search(value) {
      await this.getOptions(value);

      const fieldName = this.currentFieldName;
      const currentOption = this.options?.find((item) => item[fieldName] === this.currentValue?.text);

      if (value) {
        if (findValueInList !== undefined) {
          this.isErr = true;
        }
      }

      if (value?.length < 1 || currentOption?.[fieldName] === value) {
        this.placeholderValue = value || currentOption?.[fieldName];
        this.validationErrorText = "";

        return this.options;
      }

      return this.options.filter((item) => findUnSensitiveCaseCoincidence(item[this.currentFieldName], value));
    },
    async getOptions(value) {
      const { fieldId } = this.data;
      const { zone } = this.$route.params;
      const { oneToManyData } = this;
      const getter = this.isOneToMany ? "data_card/getOneToManyDataFieldByFieldId" : "data_card/getDataFieldByFieldId";
      const field = this.$store.getters[getter](fieldId, this.oneToManyData.fieldId, this.oneToManyData.index);

      await this.$store.dispatch("data_card/fetchOptionsByJSON", { zone, field, oneToManyData, value });
    },
    getResultValue(item) {
      return item[this.currentFieldName] ?? "";
    },
    normalizeValue(val) {
      if (!val) return null;

      const key = this.currentFieldName;

      const text = val[key]?.SNAME;

      return {
        value: val,
        text: text ?? null,
      };
    },
    handleSubmit(data) {
      let result = data;

      if (result instanceof Event) {
        const text = this.currentValue?.text;

        result = text === null ? { [this.currentFieldName]: "" } : this.currentValue?.value;
      }

      const value = this.normalizeValue(result);

      document.activeElement.blur();

      if (isEqual(value, this.currentValue)) {
        return;
      }

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.currentFieldName,
        value,
      });

      this.selectItem(result);
    },
    handleBlur(val) {
      const fieldName = this.currentFieldName;
      // modal is closed with no value selected
      if (val === null && this.currentValue) {
        return;
      }

      if (val === null && this.data.required) {
        this.isErr = false;
        this.validationErrorText = ERROR_MSG.REQUIRED;
        // value is reset by related fields
      } else if (val === null || val?.[fieldName] === null) {
        this.isErr = null;
        this.validationErrorText = "";
        // submit value
      } else {
        this.isErr = true;
        this.handleSubmit(val);
      }
    },
  },
};
</script>
