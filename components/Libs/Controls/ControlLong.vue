<template>
  <form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label
      ><span v-html="data.label"></span>
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>
    <b-form-input
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :type="'number'"
      :state="data.state"
      :min="0"
      oninput="validity.valid||(value='')"
      :id="data.name"
    ></b-form-input>
    <div
      class="invalid-feedback"
      v-if="data.state === false"
    >
      Обязательно для заполнения
    </div>
  </form-group>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlLong",
  components: { FormGroup },
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
    fieldValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.$emit("update", { fieldId: this.data.fieldId, value });
      },
    },
  },
};
</script>
