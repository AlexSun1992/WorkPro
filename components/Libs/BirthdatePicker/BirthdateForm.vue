<template>
  <b-row>
    <b-col>
      <b-form-select
        v-model="date.day"
        :options="days"
        :state="state"
        @change="debouncedUpdate()"
        @focus.native="setFocus"
        @blur.native="unsetFocus"
      ></b-form-select>
    </b-col>
    <div class="col">
      <b-form-select
        v-model="date.month"
        :options="months"
        :state="state"
        @change="debouncedUpdate()"
        @focus.native="setFocus"
        @blur.native="unsetFocus"
      ></b-form-select>
    </div>
    <div class="col">
      <b-form-select
        v-model="date.year"
        :options="years"
        :state="state"
        @change="debouncedUpdate()"
        @focus.native="setFocus"
        @blur.native="unsetFocus"
      ></b-form-select>
    </div>
  </b-row>
</template>

<script>
import debounce from "lodash.debounce";
import data from "./data";

function getDataString(date) {
  if (date.day && date.month && date.year) {
    return `${date.day}.${date.month}.${date.year}`;
  } 
    return null;
  
}
export default {
  data() {
    return {
      date: { day: null, month: null, year: null },
      days: data.days(),
      months: data.month(),
      years: data.years(),
      focus: false,
    };
  },
  props: ["value", "state"],
  created () {
    this.debouncedUpdate = debounce(this.updateInput, 10);
  },
  methods: {
    updateInput() {
      if (!this.focus || getDataString(this.date)) {
        this.$emit("input", getDataString(this.date));
      }
    },
    setFocus() {
      this.focus = true;
    },
    unsetFocus() {
      this.focus = false;
    },
  },
  watch: {
    focus (newQuestion) {
      if (!newQuestion) {
        this.debouncedUpdate();
      }
    },
  },
};
</script>

<style scoped></style>
