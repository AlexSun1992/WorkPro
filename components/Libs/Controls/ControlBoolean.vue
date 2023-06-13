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
        ><span v-if="data.helpText" class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span
      ></template>
    </b-form-checkbox>

    <b-form-invalid-feedback :state="data.state"
      >Необходимо указать этот параметр</b-form-invalid-feedback
    >
    <b-form-invalid-feedback :state="isRequiredPersonalDataCheckBox"
      >Необходимо указать этот параметр</b-form-invalid-feedback
    >
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

  mounted() {
    document.querySelectorAll(".checkbox-hide > label").forEach((elm) =>
      elm.addEventListener("click", (e) => {
        if (e.target.className === "tooltipster") {
          e.preventDefault();
        }
      })
    );
  },

  computed: {
    isRequiredPersonalDataCheckBox() {
      const getCheckBoxNameBaccept = this.data.name === "BACCEPT";
      const getCheckBoxNameBKID = this.data.name === "BKID";
      const getSavedError = this.$store.getters[`data_card/getSavedError`];
      if (
        (getCheckBoxNameBaccept && getSavedError) ||
        (getCheckBoxNameBKID && getSavedError)
      ) {
        if (
          this.data.value === false &&
          this.data.checked === true &&
          this.data.state === true
        ) {
          return false;
        }
      }
      return true;
    },

    fieldValue: {
      get() {
        if (this.data.structType === "boolrus") {
          return this.data.value === "Д" || this.data.value === true;
        }
        return this.data.value === "Y" || this.data.value === true;
      },
      set(value) {
        if (
          (this.data.name === "BACCEPT" && value === false) ||
          (this.data.name === "BKID" && value === false)
        ) {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            name: this.data.name,
            value: undefined,
          });
          return;
        }

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

<style scoped></style>
