<template>
  <div>
    <b-form-checkbox
      v-model="fieldValue"
      class="checkbox-hide"
      :state="data.state && isRequiredPersonalDataCheckBox"
      :disabled="!edit ? !edit : data.readonly"
      :id="data.webId ? data.webId : ''"
    >
      <span v-html="data.label"></span>
      <template>
        <span
          v-if="data.helpText"
          class="position-relative"
        >
          <span class="tooltipster"
            >(?)
            <vue-easy-tooltip
              :with-arrow="false"
              position="top"
              :offset="4"
            >
              <span v-html="data.helpText"></span>
            </vue-easy-tooltip>
          </span>
        </span>
      </template>
    </b-form-checkbox>

    <b-form-invalid-feedback
      class="mt-2"
      :state="data.state"
      >Необходимо указать этот параметр</b-form-invalid-feedback
    >
    <b-form-invalid-feedback
      class="mt-2"
      :state="isRequiredPersonalDataCheckBox"
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
    this.$store.commit("data_card/setFormField", {
      fieldId: this.data.fieldId,
      name: this.data.name,
      value: JSON.parse(this.data.value) ?? this.data.value,
    });
  },

  computed: {
    isRequiredPersonalDataCheckBox() {
      const getSavedError = this.$store.getters[`data_card/getSavedError`];
      const requiredCheckBox = this.data.required === true;

      if (requiredCheckBox && getSavedError) {
        if (this.data.value === false && this.data.checked === true && this.data.state === true) {
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
        const newValue = this.data.required === true && value === false ? undefined : value;

        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: newValue,
        });
      },
    },
  },
};
</script>

<style scoped></style>
