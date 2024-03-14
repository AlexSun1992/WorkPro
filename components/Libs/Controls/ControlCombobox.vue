<template>
  <div>
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
            (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
              <span v-html="data.helpText" /></vue-easy-tooltip></span
        ></span>
      </template>
      <b-form-select
        :value="value"
        :options="options"
        :disabled="!edit ? !edit : data.readonly"
        :class="{ 'error-outline': isValid == false }"
        :state="data.state"
        @change="changeValue"
      />
      <p v-if="data.dangerText" class="danger-text">
        {{ data.dangerText }}
      </p>
      <b-form-invalid-feedback>
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlCombobox",
  components: { BFormGroup },
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
  computed: {
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      )?.state;
    },
    value: {
      get() {
        return this.data.value;
      },
      set(value) {
        return value;
      },
    },
    options() {
      return this.data.options;
    },
  },
  created() {
    this.value = this.value ? this.value : null;
    if (this.data.placeholder !== undefined && this.value === null) {
      const item = {
        value: null,
        text: this.data.placeholder,
        disabled: true,
      };
      if (this.options[0].text !== this.data.placeholder) {
        this.options.unshift(item);
      }
    }
  },
  methods: {
    changeValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: String(value),
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

.error-outline {
  border: 1px solid #f86c6b;
}
</style>
