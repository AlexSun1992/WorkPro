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

    <currency-input
      class="form-control"
      :class="validClass"
      :placeholder="placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-model="fieldValue"
      :allowNegative="false"
      :currency="{ suffix: ` ${placeholder}` }"
      :precision="precision"
      @blur="eventHandlerBlur"
      :id="oneToManyData ? String(oneToManyData.index) : data.name"
    />

    <p
      v-if="data.dangerText"
      class="danger-text"
    >
      {{ data.dangerText }}
    </p>
    <div
      class="invalid-feedback"
      v-if="data.state === false"
    >
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </div>
  </form-group>
</template>

<script>
import { CurrencyInput } from "vue-currency-input";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlCustomDouble",
  components: { CurrencyInput, FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
    },
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },

  mounted() {
    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });
    }
  },

  methods: {
    eventHandlerBlur() {
      this.$emit("blur", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
  },

  computed: {
    precision() {
      return this.data?.mask ? this.data.mask.length : 2;
    },
    placeholder() {
      return this.data.placeholder || "";
    },
    fieldValue: {
      get() {
        if (this.data.value !== 0) {
          return this.data.value;
        }
        return {};
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value !== null ? Number(value) : null,
        });
      },
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
  },
};
</script>

<style scoped></style>
