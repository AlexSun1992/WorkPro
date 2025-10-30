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
    <model-select
      ref="autocomplete"
      :options="options"
      :placeholder="placeholder"
      :isDisabled="isDisabled"
      v-model="searchSelectValue"
      :class="validClass"
      :data-loading="isLoading"
      @searchchange="searchChange"
      @blur="handleBlur"
      :id="data.name"
    >
    </model-select>

    <b-form-invalid-feedback>
      {{ validationErrorText }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

export default {
  name: "ControlSearchSelect",
  components: {
    ModelSelect,
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
      placeholderValue: "Выберите из списка",
      validationErrorText: null,
      isErr: null,
    };
  },

  computed: {
    searchSelectValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.update(value?.value ?? value);
      },
    },
    isDisabled() {
      return !this.edit || this.data.readonly || this.isLoading || this.options.length === 0;
    },
    placeholder() {
      if (this.options.length === 0 && this.isLoading === false && !this.data.placeholder) {
        return `${this.data.label} не найден`;
      }
      return this.data.placeholder ? this.data.placeholder : this.placeholderValue;
    },
    validClass() {
      if (this.state !== null && this.state !== undefined && this.data.required) {
        return this.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
    options() {
      return this.data.options;
    },
    isLoading() {
      return this.data.isLoading;
    },
    state() {
      if (this.isErr) {
        return false;
      }
      return this.data.state;
    },
  },

  watch: {
    options(value) {
      if (value.length === 1 && !this.searchSelectValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          type: this.data.type,
          value: this.options[0].value,
        });
        this.update(this.options[0].value);
      }
    },
  },

  async mounted() {
    const input = document.getElementById("IDREGNUMBER");
    if (input) {
      input.setAttribute("readonly", "");
    }

    if (this.options.length === 0) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value: null,
      });
      this.update(null);
    }

    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });
    }
  },

  methods: {
    update(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value: value,
      });
    },
    handleBlur() {
      this.isErr = false;

      if (!this.searchSelectValue) {
        this.validationErrorText = `Обязательно для заполнения`;
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          type: this.data.type,
          value: null,
        });
        this.update(null);
      }
    },
    searchChange(value) {
      this.isErr = false;
      if (value) {
        const findOption = this.options.find((i) => i.text.toLowerCase().includes(value.toLowerCase()));
        if (!findOption) {
          this.validationErrorText = `Выберите значение из выпадающего списка`;
          this.isErr = true;
        }
      }
    },
  },
};
</script>
