<template>
  <div>
    <date-picker
      id="birth-date"
      v-model="birthdate"
      @input="setDateValue"
      @change="setDateChange"
      @blur="setBlurChange"
      v-mask="maskTemplate"
      :disabled-date="notBeforeDate"
      :default-value="defaultDate"
      :disabled="disabled"
      type="date"
      value-type="DD.MM.YYYY"
      placeholder="__.__.__"
      format="DD.MM.YYYY"
      :first-day-of-week="1"
      :lang="lang"
      :input-class="classValid"
      :clearable="true"
      :input-attr="{ 'data-testid': 'regBornDate' }"
    />
    <div
      class="invalid-feedback"
      v-if="state === false"
    >
      Обязательное поле
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import "vue2-datepicker/index.css";
import { mask } from "vue-the-mask";

function getDate(value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - value);
  return date;
}
export default {
  name: "BirthdatePicker2",
  components: { DatePicker },
  directives: { mask },
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
  props: {
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    state: {
      required: true,
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      birthdate: null,
      lang: "ru",
      maskTemplate: "##.##.####",
      defaultDate: getDate(18),
    };
  },
  watch: {
    value(newValue) {
      if (this.modelValue === undefined) {
        this.birthdate = newValue;
      }
    },
    modelValue(newValue) {
      this.birthdate = newValue;
    },
  },
  mounted() {
    if (this.currentValue) {
      this.birthdate = this.currentValue;
    }
  },
  methods: {
    setDateValue(date) {
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", date);
      this.$emit("update:modelValue", date);
    },
    setDateChange(date) {
      this.$emit("change", date);
    },
    setBlurChange(e) {
      if (!e.target.value) {
        // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
        this.$emit("input", null);
        this.$emit("update:modelValue", null);
      }
    },
    notBeforeDate(date) {
      if (date < getDate(120) === true) {
        return true;
      }
      return date > getDate(0);
    },
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    classValid() {
      if (this.state === null) {
        return null;
      }
      if (this.state === false) {
        return "is-invalid";
      }
      if (this.state === true) {
        return "is-valid";
      }
      return null;
    },
  },
};
</script>

<style scoped></style>
