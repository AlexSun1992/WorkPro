<template>
  <div>
    <date-picker
      v-model="data"
      :open="open"
      placeholder="Дата рождения"
      @change="hideDataPicker"
      @input="setDateValue"
      type="date"
      title-format="DD.MM.YYYY"
      format="DD.MM.YYYY"
      :lang="lang"
      :disabled-date="notBeforeDate"
      :default-value="defaultDate"
      :clearable="false"
      :disabled="isDisabled"
      ref="datepicker"
    >
      <template v-slot:input>
        <b-input-group>
          <birth-date-input
            ref="birthDateInputInstance"
            v-model="data"
            :state="state"
            :blur="debouncedUpdate"
            :tabindex="tabindex"
            :disabled="isDisabled"
          />
          <b-input-group-append>
            <button
              v-on:click="showDataPicker"
              @focus="setButtonFocus"
              @blur="blurButtonFocus"
              class="btn btn-secondary button-datapicker"
              type="button"
            >
              <i class="fa fa-calendar"></i>
            </button>
          </b-input-group-append>
        </b-input-group>
      </template>
      <template v-slot:icon-calendar>
        <div></div>
      </template>
    </date-picker>
    <b-form-invalid-feedback :state="state">Пожалуйста, заполните это поле</b-form-invalid-feedback>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import DatePicker from "vue2-datepicker";
import ClickOutside from "vue-click-outside";
import moment from "moment/moment";
import "vue2-datepicker/locale/ru";
import "vue2-datepicker/index.css";
import BirthDateInput from "./BirthdateInput";

const today = new Date();
today.setHours(0, 0, 0, 0);

function getDate(value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - value);
  return date;
}

export default {
  name: "BirthdayPicker",
  components: { DatePicker, BirthDateInput },
  props: {
    state: Boolean,
    disabled: Boolean,
    tabindex: Number,
  },
  data() {
    return {
      data: null,
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: false,
      },
      defaultDate: getDate(18),
      isOpenPanel: undefined,
      open: false,
      buttonFocus: false,
    };
  },
  created() {
    this.debouncedUpdate = debounce(this.hideDataPicker, 100);
  },
  methods: {
    notBeforeDate(date) {
      return date > getDate(18);
    },
    hideDataPicker(value) {
      if (value) {
        this.open = false;
      }
      if (this.data) {
        this.$emit("input", moment(this.data).format("YYYY-MM-DD"));
      } else {
        this.$emit("input", null);
      }
    },
    showDataPicker() {
      this.open = true;
    },
    setDateValue(date) {
      this.$emit("input", moment(date).format("DD.MM.YYYY"));
      this.$refs.birthDateInputInstance.setDate(date);
    },
    setButtonFocus() {
      this.buttonFocus = true;
    },
    blurButtonFocus() {
      this.buttonFocus = false;
    },
  },
  computed: {
    isDisabled() {
      return this.disabled;
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style scoped></style>
