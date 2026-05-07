<template>
  <form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label
      ><span v-html="data.label"></span
      ><span
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

    <b-form-input
      :placeholder="data.placeholder"
      v-model="fieldValue"
      v-mask="data.mask"
      autocomplete="off"
      :disabled="!edit ? !edit : data.readonly"
      :type="'number'"
      :state="data.state"
      :min="0"
      oninput="validity.valid||(value='')"
      @blur="eventHandlerBlur"
      :id="oneToManyData ? String(oneToManyData.index) : data.name"
    ></b-form-input>
    <div
      class="invalid-feedback"
      v-if="data.state === false"
    >
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </div>
  </form-group>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import { applyMask as _mask } from "@/utils/utils";

export default {
  name: "ControlDouble",
  components: { FormGroup },
  directives: {
    mask: _mask,
  },

  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    oneToManyData: {
      type: Object,
      default: undefined,
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },

  computed: {
    fieldValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value === null || value === undefined || value === "" || value.match(/^(0)\1/) ? null : Number(value),
        });
      },
    },
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
</style>
