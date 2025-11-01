<template>
  <div>
    <b-form-checkbox
      v-model="fieldValue"
      class="checkbox-hide"
      :state="data.state && isRequiredPersonalDataCheckBox"
      :disabled="!edit ? !edit : data.readonly"
      :id="elementId"
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

    <div
      v-if="data.state === false"
      class="custom-invalid-feedback"
    >
      Необходимо указать этот параметр
    </div>

    <div
      v-if="!isRequiredPersonalDataCheckBox"
      class="custom-invalid-feedback"
    >
      Необходимо указать этот параметр
    </div>
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
      value: this.parseValue(this.data.value),
    });
  },

  computed: {
    elementId() {
      return this.data.webId || this.data.fieldId;
    },
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
  methods: {
    parseValue(value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  },
};
</script>

<style scoped>
.custom-invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #dc3545;
  text-align: left;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans",
    sans-serif;
}
</style>
