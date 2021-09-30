<template>
  <div>
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <template v-slot:label><span v-html="data.label"></span></template>
      <date-picker
        v-model="fieldValue"
        v-mask="maskTemplate"
        :disabled="!edit ? !edit : data.readonly"
        type="date"
        valueType="DD.MM.YYYY"
        format="DD.MM.YYYY"
        :first-day-of-week="1"
        :lang="lang"
        :input-class="data.state === false ? `${state} is-invalid` : state"
      ></date-picker>
      <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
      <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
      <b-form-invalid-feedback :state="data.state">
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ru";
import { applyMask as _mask } from "../../../utils/utils";
export default {
  name: "ControlTimestamp",
  components: { DatePicker },
  directives: {
    mask: _mask,
  },
  data() {
    return {
      lang: "ru",
      state: "timestamp form-control",
      maskTemplate: "##.##.####",
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
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", { fieldId: this.data.fieldId, value: value });
      },
    },
  },
};
</script>

<style>
.timestamp.form-control:disabled,
.form-control.disabled {
  opacity: 1;
  color: #000;
}
.timestamp.error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
  margin-top: 9px;
}

.required > legend:after {
  content: "*";
  color: red;
}
</style>
