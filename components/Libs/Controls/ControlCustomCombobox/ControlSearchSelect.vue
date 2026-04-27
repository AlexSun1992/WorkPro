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
            <span v-html="data.helpText" /></vue-easy-tooltip
        ></span>
      </span>
    </template>

    <div :class="['ui', { disabled: isDisabled }]">
      <ControlDropdownBase
        :isOpen="isOpen"
        :isDisabled="isDisabled"
        :validClass="validClass"
        @click-trigger="handleTriggerClick"
        @toggle="handleToggleBtn"
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
          <li v-if="availableOptions.length > 5 || searchQuery">
            <SearchBox
              ref="search"
              v-model="searchQuery"
              @input="handleInput"
            />
          </li>
          <li
            v-for="item in availableOptions"
            :key="item.value"
            class="item"
            :class="{ 'selected-option': String(item.value) === String(data.value) }"
            @click.stop="selectItem(item)"
            @mousedown.prevent.stop="selectItem(item)"
          >
            <span>{{ item.text }}</span>
          </li>
          <li v-if="isLoading && !availableOptions.length">Загрузка....</li>
          <li
            v-if="!isLoading && !availableOptions.length"
            class="disabled"
          >
            Нет подходящих значений
          </li>
        </template>
      </ControlDropdownBase>
    </div>

    <div
      class="invalid-feedback"
      v-if="state === false"
    >
      {{ validationErrorText }}
    </div>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import ControlDropdownBase from "../ControlDropdownBase.vue";
import SearchBox from "@/components/Libs/Controls/ControlTokenBox/SearchBox";

export default {
  name: "ControlSearchSelect",
  components: {
    SearchBox,
    BFormGroup,
    ControlDropdownBase,
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
      isOpen: false,
      isSearching: false,
      searchQuery: "",
      validationErrorText: null,
      isErr: null,
    };
  },
  computed: {
    options() {
      return this.data.options ?? [];
    },
    isLoading() {
      return this.data.isLoading;
    },
    isDisabled() {
      return !this.edit || this.data.readonly || this.isLoading || this.options.length === 0;
    },
    placeholder() {
      if (this.options.length === 0 && this.isLoading === false && !this.data.placeholder) {
        return `${this.data.label} не найден`;
      }
      return this.data.placeholder ?? "Выберите из списка";
    },
    selectedOption() {
      const val = this.data?.value;
      if (val == null || val === "") return null;
      const numVal = isNaN(val) ? val : Number(val);
      return this.options.find((i) => i.value === numVal || i.value === val) ?? null;
    },
    inputDisplayValue() {
      if (this.isSearching) return this.searchQuery;
      return this.selectedOption?.text ?? "";
    },
    availableOptions() {
      if (!this.isSearching || !this.searchQuery) return this.options;
      return this.options.filter((i) => i.text.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    state() {
      if (this.isErr) return false;
      return this.data.state;
    },
    validClass() {
      if (this.state !== null && this.state !== undefined && this.data.required) {
        return this.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
  },
  watch: {
    options(value) {
      if (value.length === 1 && !this.selectedOption) {
        this.update(this.options[0].value);
      }
    },
  },
  mounted() {
    if (this.options.length === 0) {
      this.update(null);
    }

    if (this.data?.value) {
      const haveOption = this.options.find((el) => el.ID === Number(this.data.value)) || {};

      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });

      if (!Object.keys(haveOption).length) {
        this.update(null);
      }
    }
  },
  methods: {
    handleInput(e) {
      if (!e) return;
      this.searchQuery = e.target?.value ?? e;
      this.isSearching = true;

      this.isOpen = true;
      this.isErr = null;

      if (this.searchQuery) {
        const findOption = this.options.find((i) => i.text.toLowerCase().includes(this.searchQuery.toLowerCase()));
        if (!findOption) {
          this.validationErrorText = "Выберите значение из выпадающего списка";
          this.isErr = true;
        }
      }
    },
    handleBlur() {
      this.isErr = false;
      this.isSearching = false;
      this.searchQuery = "";

      if (!this.selectedOption) {
        this.validationErrorText = "Обязательно для заполнения";
        this.update("");
      }
    },
    handleTriggerClick(ev) {
      const searchEl = this.$refs.search?.$el;
      if (ev.target === searchEl || searchEl?.contains(ev.target)) return;
      if (!this.isDisabled) {
        this.isOpen = !this.isOpen;
      }
    },
    handleToggleBtn(open) {
      if (!this.isDisabled) {
        this.isOpen = open ?? !this.isOpen;
      }
    },
    selectItem(item) {
      this.update(item.value);
      this.isSearching = false;
      this.searchQuery = "";
      this.isErr = false;
      this.validationErrorText = "";
      this.isOpen = false;
    },
    closeDropdown() {
      this.isOpen = false;
      this.isSearching = false;
      if (!this.selectedOption) this.searchQuery = "";
    },
    update(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value,
      });
    },
  },
};
</script>

<style scoped>
.combobox-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 18px;
  font-weight: 400;
  min-height: 30px;
  flex: 1;
  padding: 0;
  color: inherit;
}

.combobox-input:disabled {
  cursor: not-allowed;
  color: #6c757d;
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
