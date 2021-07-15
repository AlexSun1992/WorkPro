<template>
  <div>
    <b-form-input
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
    ></b-form-input>
  </div>
</template>

<script>
import moment from "moment/moment";
import _ from "lodash";
import { BFormInput } from "bootstrap-vue";
import { mask } from "vue-the-mask";

export default {
  name: "BirthdateInput",
  data() {
    return {
      dateMask: "##.##.####",
      placeholder: "__.__.__",
      date: "",
    };
  },
  components: {
    BFormInput,
  },
  directives: { mask },
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

<style scoped>
::v-deep {
  @import "bootstrap/scss/bootstrap.scss";
}
</style>
