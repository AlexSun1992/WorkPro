<template>
  <div>
    <label v-if="data.label">
      <span
        >{{ data.label }}&nbsp;&nbsp;<span class="phb2">{{ insuredSum }}</span>
        <span v-if="data.helpText" class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText" /></vue-easy-tooltip
        ></span>
      </span>
    </label>
    <b-form-input
      @input="getNearestValue()"
      type="number"
      v-model="valueTypeNumber"
      @focus="valueTypeNumber === 0 ? (valueTypeNumber = '') : valueTypeNumber"
    ></b-form-input>
    <b-form-input
      id="inp"
      v-model="valueTypeRange"
      type="range"
      @input="handleValue()"
      :min="
        isOnlyTwoItemsInPrices ? getMinValueFromPricesValue : getMinRangeValue
      "
      :max="
        isOnlyTwoItemsInPrices ? getMaxValueFromPricesValue : getMaxRangeValue
      "
    >
    </b-form-input>
    <ul :data-amountOfValues="data.options.length" class="range-list">
      <li
        v-for="item in data.options"
        :key="item.ID"
        :class="item.value === insuredSum ? 'active' : ''"
      >
        <span>{{ item.SNAME }}</span>
      </li>
    </ul>
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
    isFlexibleRange: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      valueTypeNumber: 0,
      valueTypeRange: 0,
      insuredSum: null,
      startFinishValueMock: [1500000, 3000000, 4100000],
    };
  },

  created() {
    if (this.data.value) {
      this.insuredSum = this.data.value;
      const getIndexOfChoosenValue = this.getAllPricesValue.indexOf(
        this.insuredSum
      );
      this.valueTypeRange = getIndexOfChoosenValue;
      this.valueTypeNumber = this.getAllPricesValue[getIndexOfChoosenValue];
    }
    if (this.isOnlyTwoItemsInPrices) {
      if (this.data.value) {
        this.insuredSum = this.data.value;
        this.valueTypeRange = this.data.value;
        this.valueTypeNumber = this.data.value;
      }
    }
  },

  watch: {
    insuredSum(value) {
      this.valueTypeNumber = Number(value);
    },
  },

  computed: {
    getMinRangeValue() {
      return 0;
    },
    getMaxRangeValue() {
      const numbervalue = this.data.options.length - 1;
      return numbervalue;
    },

    getAllPricesValue() {
      const getPricesFromData = this.data.options.map((item) => item.value);
      return getPricesFromData;
    },

    isOnlyTwoItemsInPrices() {
      // return this.startFinishValueMock; поставил заглушку (массив с двумя значениями)
      if (this.startFinishValueMock.length === 2) {
        return true;
      }
      return false;
    },

    getMinValueFromPricesValue() {
      return Math.min(...this.startFinishValueMock);
    },

    getMaxValueFromPricesValue() {
      return Math.max(...this.startFinishValueMock);
    },
  },

  methods: {
    getNearestValue() {
      if (this.isOnlyTwoItemsInPrices === false) {
        const closestValue = getClosestValue(
          this.getAllPricesValue,
          this.valueTypeNumber
        );

        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        this.valueTypeRange = getIndex;
        this.insuredSum = closestValue;
      }

      if (this.isOnlyTwoItemsInPrices) {
        if (this.valueTypeNumber !== "") {
          this.valueTypeRange = this.valueTypeNumber;
          this.insuredSum = Number(this.valueTypeNumber);
        }
        if (this.valueTypeNumber < this.getMinValueFromPricesValue) {
          this.valueTypeRange = this.getMinValueFromPricesValue;
          this.insuredSum = Number(this.getMinValueFromPricesValue);
          this.valueTypeNumber = this.getMinValueFromPricesValue;
        }
        if (this.valueTypeNumber > this.getMaxValueFromPricesValue) {
          this.valueTypeRange = this.getMaxValueFromPricesValue;
          this.insuredSum = Number(this.getMaxValueFromPricesValue);
          this.valueTypeNumber = this.getMaxValueFromPricesValue;
        }
      }

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.insuredSum,
      });
    },

    handleValue() {
      if (this.isOnlyTwoItemsInPrices === false) {
        this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
      }

      if (this.isOnlyTwoItemsInPrices === true) {
        this.valueTypeNumber = this.valueTypeRange;
        this.insuredSum = Number(this.valueTypeNumber);
      }

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

.active {
  color: green;
}
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  border: 0;
  height: 20px;
  margin-top: 1rem;
}
input[type="range"]:hover {
  border: 0;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none; /* 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;*/
  background: #43b02a;
  border-radius: 1.3px;
  border: 0; /*0.2px solid #010101;*/
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: none; /* 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;*/
  border: 0px solid #000000;
  height: 17px;
  width: 17px;
  border-radius: 17px;
  background: #43b02a;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #43b02a;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: #43b02a;
  border-radius: 0;
  border: 0;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: none;
  border: 0;
  height: 17px;
  width: 17px;
  border-radius: 17px;
  background: #43b02a;
  cursor: pointer;
}
.range-list {
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}
.range-list li {
  padding: 0;
  margin: 0;
  overflow: hidden;
  text-align: center;
  position: absolute;
  top: 0;
}

.range-list li:first-child {
  text-align: left;
  left: 0;
}
.range-list li:last-child {
  right: 0;
  text-align: right;
}
.range-list li span {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  overflow: hidden;
}
.range-list[data-amountofvalues] > li {
  transform: translateX(-50%);
}
.range-list[data-amountofvalues] > li:last-child,
.range-list[data-amountofvalues] > li:first-child {
  transform: translateX(0%);
}
.range-list[data-amountofvalues="3"] > li {
  max-width: calc(100% / 3);
}
.range-list[data-amountofvalues="3"] > li:nth-child(2) {
  left: 50%;
  transform: translateX(-50%);
}
.range-list[data-amountofvalues="4"] > li {
  max-width: calc(100% / 4);
}
.range-list[data-amountofvalues="4"] > li:nth-child(2) {
  left: calc(100% / 3);
}
.range-list[data-amountofvalues="4"] > li:nth-child(3) {
  left: calc((100% / 3) * 2);
}
.range-list[data-amountofvalues="5"] > li {
  max-width: calc(100% / 4);
}
.range-list[data-amountofvalues="5"] > li:nth-child(2) {
  left: calc(100% / 4);
}
.range-list[data-amountofvalues="5"] > li:nth-child(3) {
  left: calc((100% / 4) * 2);
}
.range-list[data-amountofvalues="5"] > li:nth-child(4) {
  left: calc((100% / 4) * 3);
}
.range-list[data-amountofvalues="6"] > li {
  max-width: calc(100% / 6);
}
.range-list[data-amountofvalues="6"] > li:nth-child(2) {
  left: calc(100% / 5);
}
.range-list[data-amountofvalues="6"] > li:nth-child(3) {
  left: calc((100% / 5) * 2);
}
.range-list[data-amountofvalues="6"] > li:nth-child(4) {
  left: calc((100% / 5) * 3);
}
.range-list[data-amountofvalues="6"] > li:nth-child(5) {
  left: calc((100% / 5) * 4);
}
</style>
