<template>
  <div :label="data.label">
    <span v-if="data.helpText" class="tooltipster">
      (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
        <span v-html="data.helpText" /></vue-easy-tooltip
    ></span>
    <p id="isuredSum">Страховая сумма:{{ insuredSum }}</p>
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
    <ul :data-amountOfValues="data.options.length">
      <li
        v-for="item in data.options"
        :key="item.ID"
        :class="item.value === insuredSum ? 'active' : ''"
      >
        {{ item.SNAME }}
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
  margin: 18px 0;
  width: 100%;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #3071a9;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -14px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #367ebd;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #3071a9;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #2a6495;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]::-ms-fill-upper {
  background: #3071a9;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]::-ms-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #3071a9;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #367ebd;
}
</style>
