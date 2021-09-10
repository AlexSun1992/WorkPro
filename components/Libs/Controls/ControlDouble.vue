<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label><span v-html="data.label"></span></template>
    <b-form-input
      v-model="fieldValue"
      v-mask="data.mask"
      autocomplete="off"
      :disabled="!edit ? !edit : data.readonly"
      :type="'number'"
      :state="data.state"
      :min="0"
      oninput="validity.valid||(value='')"
    ></b-form-input>
    <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
    <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { applyMask as _mask } from "../../../utils/utils";
export default {
  name: "ControlDouble",
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
  },

  // methods: {
  //   formatter(value) {
  //     if (value < 0) {
  //       return "";
  //     } else {
  //       return this.fieldValue;
  //     }
  //   },
  // },

  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: Number(value),
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
.danger-text {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}
.required > legend:after {
  content: "*";
  color: red;
}
</style>
