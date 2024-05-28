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
    <b-form-invalid-feedback :state="state">
      Обязательное поле
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import "vue2-datepicker/index.css";
import { mask } from "vue-the-mask";
import { BFormInvalidFeedback } from "bootstrap-vue";

function getDate(value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - value);
  return date;
}
export default {
  name: "ControlTimestamp",
  components: { DatePicker, BFormInvalidFeedback },
  directives: { mask },
  props: {
    state: {
      required: true,
      default: () => null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false,
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
  methods: {
    setDateValue(date) {
      this.$emit("input", date);
    },
    setDateChange(date) {
      this.$emit("change", date);
    },
    setBlurChange(e) {
      if (!e.target.value) {
        this.$emit("input", null);
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
