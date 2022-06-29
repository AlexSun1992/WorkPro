<template>
  <div>
    <b-form-input
      :id="data.name"
      v-model="dataValue"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      type="text"
      :placeholder="data.placeholder"
      @input="updateValue($event)"
    />

    <b-form-invalid-feedback :state="isState">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
  </div>
</template>
<script>
export default {
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
    isState() {
      return this.data.state;
    },
    dataValue: {
      set() {
        return this.data?.value;
      },
      get() {
        return this.data?.value;
      },
    },
  },

  methods: {
    updateValue(val) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: val,
      });
    },
  },
};
</script>
