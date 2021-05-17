<template>
  <div>
    <date-picker
      v-model="data.birthdate.$model"
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
            v-model="data.birthdate.$model"
            :state="state"
            :blur="debouncedUpdate"
            :disabled="isDisabled"
          />
          <b-input-group-append>
            <b-button
              v-on:click="showDataPicker"
              @focus="setButtonFocus"
              @blur="blurButtonFocus"
              class="button-datapicker"
              ><i class="fa fa-calendar"></i
            ></b-button>
          </b-input-group-append>
        </b-input-group>
      </template>
      <template v-slot:icon-calendar>
        <div></div>
      </template>
    </date-picker>
    <b-form-invalid-feedback :state="state"
      >Пожалуйста, заполните это поле</b-form-invalid-feedback
    >
  </div>
</template>

<script>
import _ from "lodash";
import DatePicker from "vue2-datepicker";
import BirthDateInput from "./BirthdateInput";
import ClickOutside from "vue-click-outside";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/ru";

const today = new Date();
today.setHours(0, 0, 0, 0);

function getDate(value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - value);
  return date;
}

export default {
  name: "BirthdayWrapper",
  components: { DatePicker, BirthDateInput },
  props: {
    data: Object,
    state: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
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
  created: function () {
    this.debouncedUpdate = _.debounce(this.hideDataPicker, 100);
  },
  methods: {
    notBeforeDate(date) {
      return date > getDate(18);
    },
    hideDataPicker() {
      this.$refs.datepicker.closePopup;
    },
    showDataPicker() {
      this.$refs.datepicker.showPopup;
    },
    setDateValue(date) {
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
