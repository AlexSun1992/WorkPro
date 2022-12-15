<template>
  <div>
    <date-picker
      v-model="birthdate"
      @input="setDateValue"
      @change="setDateChange"
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
      :input-class="state === false ? `${state} is-invalid` : state"
      :clearable="true"
    />
    <b-form-invalid-feedback :state="state">
      Обязательное поле
    </b-form-invalid-feedback>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import { mask } from "vue-the-mask";

function getDate(value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - value);
  return date;
}
export default {
  name: "ControlTimestamp",
  components: { DatePicker },
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
    notBeforeDate(date) {
      if (date < getDate(120) === true) {
        return true;
      }
      return date > getDate(18);
    },
  },
};
</script>

<style scoped></style>
