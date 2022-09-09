<template>
  <div>
    <b-form-checkbox
      v-model="fieldValue"
      class="checkbox-hide"
      :state="data.state"
      :disabled="!edit ? !edit : data.readonly"
      :id="data.webId ? data.webId : ''"
    >
      <span v-html="data.label"></span>

      <template
        ><span v-html="label"></span
        ><span v-if="data.helpText" class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span
      ></template>

      <b-form-invalid-feedback :state="data.state"
        >Необходимо указать этот параметр</b-form-invalid-feedback
      >
    </b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: "ControlBoolean",
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
      get: function () {
        if (this.data.structType === "boolrus") {
          return this.data.value === "Д" || this.data.value === true;
        } else {
          return this.data.value === "Y" || this.data.value === true;
        }
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value,
        });
      },
    },
  },
};
</script>

<style scoped></style>
