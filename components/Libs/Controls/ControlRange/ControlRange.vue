<template>
  <div :label="data.label">
    <span v-if="data.helpText" class="tooltipster">
      (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
        <span v-html="data.helpText" /></vue-easy-tooltip
    ></span>
    <b-form-input
      @input="getNearestValue()"
      type="number"
      v-model="value"
    ></b-form-input>
    <b-form-input
      id="inp"
      v-model="value1"
      type="range"
      @input="handleValue(value)"
      :min="getMinRangeValue"
      :max="getMaxRangeValue"
    >
    </b-form-input>
    <p id="isuredSum">Страховая сумма:{{ insuredSum }}</p>
  </div>
</template>
<script>
import { BFormInput } from "bootstrap-vue";
import { getClosestValue } from "./ControlRange.helper";

export default {
  name: "ControlRange",
  components: {
    BFormInput,
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
      default: () => {},
    },
  },
  data() {
    return {
      value: "",
      value1: "0",
      insuredSum: null,
    };
  },

  created() {
    this.getNearestValue();
  },

  computed: {
    getMinRangeValue() {
      return 0;
    },
    getMaxRangeValue() {
      const numbervalue = this.data.options.length - 1;
      return numbervalue;
    },
    getAllPrices() {
      const getPricesFromData = this.data.options.map((item) => item.text);
      return getPricesFromData;
    },
    getAllPricesValue() {
      const getPricesFromData = this.data.options.map((item) => item.value);
      return getPricesFromData;
    },
  },

  methods: {
    getNearestValue() {
      const closestValue = getClosestValue(this.getAllPricesValue, this.value);
      this.insuredSum = closestValue;
      const getIndex = this.getAllPricesValue.indexOf(closestValue);
      this.value1 = getIndex;
    },

    handleValue() {
      this.insuredSum = this.getAllPricesValue[this.value1];
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.insuredSum,
      });
    },
  },
};
</script>

<style scoped>
#inp {
  padding: 0;
}
</style>
