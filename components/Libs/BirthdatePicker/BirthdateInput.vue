<template>
  <div>
    <b-input
      id="date"
      v-mask="dateMask"
      @blur="debouncedUpdate()"
      @update="debouncedUpdate()"
      :placeholder="placeholder"
      v-model="date"
      :state="state"
      :disabled="isDisabled"
      :tabindex="tabindex"
      autocomplete="off"
    ></b-input>
  </div>
</template>

<script>
import moment from "moment/moment";
import _ from "lodash";

export default {
  name: "BirthdateInput",
  data() {
    return {
      dateMask: "##.##.####",
      placeholder: "__.__.__",
      date: "",
    };
  },
  created: function () {
    this.debouncedUpdate = _.debounce(this.updateInput, 100);
  },
  props: {
    state: Boolean,
    blur: Function,
    disabled: Boolean,
    tabindex: Number,
  },
  methods: {
    updateInput() {
      if (moment(this.date, "DD.MM.YYYY", true).isValid()) {
        this.$emit("input", moment(this.date, "DD.MM.YYYY").toDate());
        this.blur();
      } else {
        this.$emit("input", null);
        this.blur();
      }
    },
    setDate(date) {
      this.date = moment(date).format("DD.MM.YYYY");
    },
  },
  watch: {
    date: function (val) {
      if (val) {
        this.updateInput();
      }
    },
  },
  computed: {
    isDisabled() {
      return this.disabled;
    },
  },
};
</script>

<style scoped></style>
