<template>
  <div>
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <template v-slot:label><span v-html="data.label"></span></template>
      <b-form-select
        v-model="data.value"
        @change="update"
        :options="data.options"
        :disabled="!edit ? !edit : data.readonly"
        :class="{ 'error-outline': isValid == false }"
        :state="data.state"
      ></b-form-select>
      <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
      <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
      <b-form-invalid-feedback>
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: "ControlCombobox",
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
  methods: {
    update() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: String(this.data.value),
      });
    },
  },
  computed: {
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      )?.state;
    },
  },

  created() {
    // this.data.value = null;
    this.value = this.data.placeholder;
    if (this.data.placeholder !== undefined) {
      const item = {
        value: null,
        text: this.data.placeholder,
        disabled: true,
      };
      this.data.options.unshift(item);
    }
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

.required > legend:after {
  content: "*";
  color: #f86c6b;
}

.error-outline {
  border: 1px solid #f86c6b;
}
</style>
