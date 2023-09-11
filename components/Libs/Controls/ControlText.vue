<template>
  <b-form-group :label="label" :label-for="data.name">
    <b-form-textarea
      id="textarea1"
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :state="data.state"
      placeholder="Введите текст"
      :rows="3"
      :max-rows="6"
    />
    <template #label>
      <span v-html="data.label" />
      <span v-if="data.helpText" class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  name: "ControlText",
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
    label() {
      return this.data.label;
    },
    fieldValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
      },
    },
  },
};
</script>

<style scoped>
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
