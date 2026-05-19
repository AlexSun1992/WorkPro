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
    <ControlDropdownBase
      :is-open="isOpen"
      :is-disabled="disabled"
      :valid-class="validClass"
      @click-trigger="handleTriggerClick"
      @outside="closeDropdown"
    >
      <template #trigger>
        <div
          v-if="!inputDisplayValue"
          class="placeholder"
        >
          {{ placeholder }}
        </div>
        <span
          v-else
          class="dw-result"
          >{{ inputDisplayValue }}</span
        >
      </template>

      <template #menu>
        <li v-if="options.length > 5 || searchQuery">
          <SearchBox
            ref="searchInput"
            v-model="searchQuery"
            @input="handleSearchInput"
          />
        </li>
        <li
          v-for="item in availableOptions"
          :key="item.ID"
          class="item"
          :class="{ 'selected-option': item.SNAME === currentValueText }"
          @mousedown.prevent.stop="handleSubmit(item)"
        >
          <span>{{ item.SNAME }}</span>
        </li>
        <li
          v-if="showNoneFound"
          class="disabled"
        >
          Нет подходящих значений
        </li>
        <li v-if="isLoading && !availableOptions.length">Загрузка....</li>
      </template>
    </ControlDropdownBase>
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
import { findUnSensitiveCaseCoincidence } from "../ControlCustomCombobox/ControlCustomCombobox.helper";
import { applyMask as _mask } from "@/utils/utils";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase.vue";
import SearchBox from "@/components/Libs/Controls/ControlTokenBox/SearchBox.vue";

// filters all relatedFields. If any relatedField has no value or is nullish, then it is disabled
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
  name: "ControlCustomComboboxJSON",

  components: {
    SearchBox,
    ControlDropdownBase,
    FormGroup,
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
    isOpen: false,
    searchQuery: "",
    isLoading: false,
  }),

  computed: {
    inputDisplayValue() {
      if (this.isOpen) {
        return this.searchQuery;
      }
      return this.currentValueText ?? "";
    },
    showNoneFound() {
      return !this.isSearching && this.searchQuery && this.availableOptions.length === 0;
    },

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

    availableOptions() {
      if (!this.searchQuery) {
        return this.options;
      }
      return this.options.filter((item) => findUnSensitiveCaseCoincidence(item.SNAME, this.searchQuery));
    },

    currentValue() {
      const value = this.data?.value;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (err) {
          console.error(err);
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
    relationFieldsValue() {
      return this.fieldsRelations.reduce((acc, item) => {
        acc[item.name] = item.value;

        return acc;
      }, {});
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
      return this.data.placeholder || "Выберите из списка";
    },
  },

  watch: {
    searchQuery(newSearchQuery, oldSearchQuery) {
      if (newSearchQuery !== oldSearchQuery) {
        clearTimeout(this.currentSearchTimeout);
        this.currentSearchTimeout = setTimeout(() => {
          this.getOptions(newSearchQuery);
        }, 300);
      }
    },

    validClass(value) {
      if (this.data.state === false && value === "is-invalid" && this.data.required) {
        this.validationErrorText = ERROR_MSG.REQUIRED;
      }
    },
    relationFieldsValue(newVal, oldVal) {
      if (isEqual(newVal, oldVal)) {
        return;
      }
      // TODO: fix relationFieldsBehavior after analysis
      // this.resetField();
      this.placeholderValue = "";
    },
  },

  methods: {
    async handleTriggerClick(ev) {
      const searchEl = this.$refs.searchInput?.$el;
      if (ev.target === searchEl || searchEl?.contains(ev.target)) {
        return;
      }
      if (this.disabled) {
        return;
      }
      this.isOpen = !this.isOpen;

      if (!this.options?.length) {
        this.isLoading = true;
        await this.getOptions();
      }

      if (this.isOpen) {
        this.isSearching = true;
        this.searchQuery = this.currentValueText ?? "";
        await this.$nextTick();
        this.$refs.searchInput?.$el.focus();
      }
    },

    // TODO: check if it works, might be wrong
    resetField() {
      console.log("RESETTING");
      this.isErr = null;
      this.searchQuery = "";
      this.handleSubmit({ [this.currentFieldName]: null });
    },

    async handleSearchInput(e) {
      if (!e) {
        return;
      }
      this.isSearching = true;

      this.isOpen = true;
      this.isErr = null;
    },

    closeDropdown() {
      this.isOpen = false;
      this.isSearching = false;

      const exactMatch = this.options.find((item) =>
        findUnSensitiveCaseCoincidence(this.searchQuery, item[this.currentFieldName])
      );

      if (exactMatch !== undefined) {
        this.handleSubmit(exactMatch);
        this.isErr = true;
      }

      if (!this.currentValueText) {
        this.searchQuery = "";

        if (this.data.required) {
          this.validationErrorText = ERROR_MSG.REQUIRED;
          this.isErr = false;
          this.handleSubmit(this.searchQuery);
        }
      }
    },

    updateFiltersData(value) {
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
    async getOptions(value) {
      const { fieldId } = this.data;
      const { zone } = this.$route.params;
      const { oneToManyData } = this;
      const getter = this.isOneToMany ? "data_card/getOneToManyDataFieldByFieldId" : "data_card/getDataFieldByFieldId";
      const field = this.$store.getters[getter](fieldId, this.oneToManyData.fieldId, this.oneToManyData.index);

      await this.$store.dispatch("data_card/fetchOptionsByJSON", { zone, field, oneToManyData, value });

      this.isLoading = false;
    },
    getResultValue(item) {
      return item[this.currentFieldName] ?? "";
    },
    normalizeValue(val) {
      if (!val) {
        return null;
      }

      const key = this.currentFieldName;

      const text = val[key];

      return {
        value: val,
        text: text ?? null,
      };
    },
    handleSubmit(data) {
      const value = this.normalizeValue(data);

      document.activeElement.blur();

      if (isEqual(value, this.currentValue)) {
        return;
      }

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.currentFieldName,
        value,
      });

      // needed for OneToMany
      this.updateFiltersData(data);
    },
  },
};
</script>

<style scoped>
.result {
  display: none;
}
@media (max-width: 992px) {
  .mobile-result div > div {
    display: none;
  }
  .mobile-result .result {
    border: 1px solid var(--warmgrey_40) !important;
    background: #f2f2f2 !important;
    color: var(--warmgrey_40) !important;
    pointer-events: none;
    padding: 14px 20px !important;
    border-radius: 15px;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    display: block;
    min-height: 56px;
  }
}
.is-valid .combobox-search-input,
.is-valid .combobox-search-input:hover,
.combobox-search-input {
  background: url(/img/icon-search.svg) 12px no-repeat !important;
  border: 0 !important;
  font-size: 1rem;
  font-weight: 400;
  line-height: 30px;
  margin: -12px -20px;
  padding: 0 40px;
  text-align: left;
}
.dw-result {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 992px) {
  span.dw-result {
    white-space: normal;
    padding: 14px 0 14px 20px;
  }
}
</style>
