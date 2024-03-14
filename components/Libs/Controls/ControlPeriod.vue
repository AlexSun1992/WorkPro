<template>
  <div>
    <b-row>
      <b-col sm="6">
        <b-form-group :label="data.label">
          <b-form-select v-model="data.month" :options="months">
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group>
          <label>&nbsp;</label>
          <b-form-select v-model="data.year" :options="years"> </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlPeriod",
  components: { BFormGroup },
  data() {
    return {
      month: null,
      year: null,
      months: [
        { value: 1, text: "Январь" },
        { value: 2, text: "Февраль" },
        { value: 3, text: "Март" },
        { value: 4, text: "Апрель" },
        { value: 5, text: "Май" },
        { value: 6, text: "Июнь" },
        { value: 7, text: "Июль" },
        { value: 8, text: "Август" },
        { value: 9, text: "Сентябрь" },
        { value: 10, text: "Октябрь" },
        { value: 11, text: "Ноябрь" },
        { value: 11, text: "Декабрь" },
      ],
      years: [
        2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
      ],
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
  watch: {
    value: function (val) {
      if (this.data.month && this.data.year) {
        this.data.value = val;
      }
    },
  },
  computed: {
    value: function () {
      return `${this.data.year}-${this.data.month}-01`;
    },
  },
};
</script>

<style scoped></style>
