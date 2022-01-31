<template>
  <b-form-group :label="label" :label-for="data.name">
    <b-form-textarea
      @blur="blur"
      @focus="focus"
      id="textarea1"
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :state="data.state"
      placeholder="Введите текст"
      :rows="3"
      :max-rows="6"
    >
    </b-form-textarea>
    <template v-slot:label
      ><span v-html="data.label"></span
      ><span v-if="data.helpText">
        (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
          <span v-html="data.helpText"></span></vue-easy-tooltip></span
    ></template>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  name: "ControlText",
  data() {
    return {
      isFetch: null,
      fieldValue: "",
    };
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
  methods: {
    focus() {
      this.isFetch = true;
    },
    blur() {
      this.isFetch = false;
    },
  },
  computed: {
    label() {
      return this.data.label;
    },
    // fieldValue: {
    //   get: function () {
    //      console.log("я из get", this.data);
    //     return this.data.value;
    //   },
    //   set: function (value) {
    //     console.log("я из set", value);
    //     if (this.focusLost) {
    //       this.$emit("update", {
    //         fieldId: this.data.fieldId,
    //         name: this.data.name,
    //         value: value,
    //       });
    //     }
    //   },
    // },
    // fieldValue() {
    //   return this.data.value;
    // },
  },
  watch: {
    isFetch(value) {
      if (value === false) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value,
        });
      }
    },
  },
};
</script>

<style scoped>
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
/* .form-control:disabled, .form-control[readonly]{
    background-color: white;
  } */
</style>
