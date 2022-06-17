<template>
  <div>
    <b-form-input
      v-if="!data.mask && !checkFieldName(fieldsNameHub, data.name)"
      v-model="data.value"
      @input="updateValue($event)"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      type="text"
      :placeholder="data.placeholder"
      :id="data.name"
    >
    </b-form-input>
    <b-form-invalid-feedback
      >Обязательно для заполнения</b-form-invalid-feedback
    >
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
  data() {
    return {
      fieldsNameHub: [
        "SFIRSTNAME",
        "SSECONDNAME",
        "STHIRDNAME",
        "ADDRESS",
        "SISSUED_WHERE",
        "SDOCDEP",
        "SNEWPHONE",
        "SCODEFIELD",
        "SNEWEMAIL",
      ],
    };
  },

  methods: {
    checkFieldName(fieldsNameHub, compareName) {
      const isAutocompleteField = fieldsNameHub.find((item) =>
        item.includes(compareName)
      );

      return Boolean(isAutocompleteField);
    },
    updateValue(val) {
      if (this.data.value !== val) {
        if (val !== null && val !== undefined) {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            name: this.data.name,
            value: val,
          });
        }
      }
    },
  },
};
</script>
