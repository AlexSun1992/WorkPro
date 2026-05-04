<template>
  <div>
    <div class="checkbox-hide">
      <input
        type="checkbox"
        v-model="fieldValue"
        :disabled="!edit ? !edit : data.readonly"
        :id="elementId"
        class="custom-control-input"
      />
      <label
        :for="elementId"
        class="custom-control-label"
      >
        <span v-html="data.label"></span>
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
      </label>

      <div
        v-if="data.state === false || !isRequiredPersonalDataCheckBox"
        class="custom-invalid-feedback"
      >
        Необходимо указать этот параметр
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlBoolean",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
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
    this.$store.commit(`${this.ns}/setFormField`, {
      fieldId: this.data.fieldId,
      name: this.data.name,
      value: this.parseValue(this.data.value),
    });
  },

  computed: {
    elementId() {
      const oneTwoManyIndex = this.$attrs.oneToManyData?.index || "";
      const id = String(this.data.webId || this.data.fieldId) || "control-boolean";
      return oneTwoManyIndex ? `${id}-${oneTwoManyIndex}` : id;
    },
    isRequiredPersonalDataCheckBox() {
      const getSavedError = this.$store.getters[`${this.ns}/getSavedError`];
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
    ns() {
      return this.params?.ns || "data_card";
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
