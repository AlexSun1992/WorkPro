<template>
  <div class="range-control">
    <div>
      <label v-if="data.label">
        <span
          >{{ data.label }}&nbsp;&nbsp;<span class="phb2" id="isuredSum">
          </span>
          <span v-if="data.helpText" class="position-relative"
            >&nbsp;
            <span class="tooltipster">
              (?)<vue-easy-tooltip
                :with-arrow="true"
                position="top"
                :offset="4"
              >
                <span v-html="data.helpText" /></vue-easy-tooltip></span
          ></span>
        </span>
      </label>
      <currency-input
        @input="changeValue(valueTypeNumber)"
        @blur="getNearestValue()"
        v-model="valueTypeNumber"
        :currency="{ suffix: '₽' }"
        :class="
          this.valueTypeNumber < getMinValueFromPricesValue ? 'is-invalid' : ''
        "
        useGrouping="thounsands"
        :precision="0"
        locale="ru"
        type="tel"
      ></currency-input>
      <b-form-input
        @input="handleValue(valueTypeRange)"
        id="inp"
        v-model="valueTypeRange"
        type="range"
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
          :class="{
            active: item.value === insuredSum,
            select: item.value < insuredSum,
          }"
          @click="moveToCurrentValue(item)"
        >
          <span>{{ item.SNAME_SHORT }}</span>
        </li>
      </ul>
      <button
        id="add"
        :disabled="isMaxValueReach"
        @click="addInsuranceSum"
      ></button>

      <button
        id="subtract"
        :disabled="isMinValueReach"
        @click="degradeInsuranceSum"
      ></button>
    </div>
  </div>
</template>
<script>
import { BFormInput } from "bootstrap-vue";
import { CurrencyInput } from "vue-currency-input";
import { getClosestValue } from "./ControlRange.helper";

export default {
  name: "ControlRange",
  components: {
    BFormInput,
    CurrencyInput,
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
      valueTypeNumber: null,
      valueTypeRange: null,
      insuredSum: null,
    };
  },

  created() {
    const valueNvalue = this.data.options.find((item) => item.NVALUE);

    if (this.isOnlyTwoItemsInPrices === false) {
      if (this.data.value) {
        if (valueNvalue) {
          this.valueTypeNumber = this.data.options.find(
            (item) => item.ID === this.data.value
          ).NVALUE;
        }

        if (!valueNvalue) {
          this.valueTypeNumber = this.data.options.find(
            (item) => item.ID === this.data.value
          ).ID;
        }

        this.valueTypeRange = this.getAllPricesValue.indexOf(
          this.valueTypeNumber
        );
        this.insuredSum = this.valueTypeNumber;
      }
    }
    if (this.isOnlyTwoItemsInPrices) {
      if (valueNvalue) {
        this.valueTypeNumber = this.data.options.find(
          (item) => item.ID === this.data.value
        )?.NVALUE;
      }
      if (!valueNvalue) {
        this.valueTypeNumber = this.data.options.find(
          (item) => item.ID === this.data.value
        ).ID;
      }
      this.valueTypeRange = this.valueTypeNumber;
      this.insuredSum = this.data.value;
    }
    if (valueNvalue) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.isOnlyTwoItemsInPrices
          ? this.insuredSum
          : this.data.options.find((item) => item.NVALUE === this.insuredSum)
              .ID,
      });
    }

    if (!valueNvalue) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.isOnlyTwoItemsInPrices
          ? this.insuredSum
          : this.data.options.find((item) => item.ID === this.insuredSum).value,
      });
    }
  },

  watch: {
    insuredSum() {
      const valueNvalue = this.data.options.find((item) => item.NVALUE);
      if (valueNvalue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.isOnlyTwoItemsInPrices
            ? this.insuredSum
            : this.data.options.find((item) => item.NVALUE === this.insuredSum)
                ?.ID,
        });
      }
      if (!valueNvalue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.isOnlyTwoItemsInPrices
            ? this.insuredSum
            : this.data.options.find((item) => item.ID === this.insuredSum)
                .value,
        });
      }
    },
  },

  computed: {
    getAllPricesValue() {
      const findvalueNvalue = this.data.options.find((item) => item.NVALUE);
      if (findvalueNvalue) {
        const getSpeciaPriceslData = this.data.options.map(
          (item) => item.NVALUE
        );
        return getSpeciaPriceslData;
      }
      const getPricesFromData = this.data.options.map((item) => item.value);
      return getPricesFromData;
    },
    isOnlyTwoItemsInPrices() {
      if (this.getAllPricesValue.length === 2) {
        return true;
      }
      return false;
    },
    getRangeValue() {
      return this.$store.getters["data_card/getRangeValue"];
    },
    isMinValueReach() {
      if (this.insuredSum === this.getAllPricesValue[this.getMinRangeValue]) {
        return true;
      }
      return false;
    },

    isMaxValueReach() {
      if (this.insuredSum === this.getAllPricesValue[this.getMaxRangeValue]) {
        return true;
      }
      return false;
    },

    getMinRangeValue() {
      return 0;
    },

    getMaxRangeValue() {
      const numbervalue = this.getAllPricesValue.length - 1;
      return numbervalue;
    },

    getMinValueFromPricesValue() {
      return Math.min(...this.getAllPricesValue);
    },
    getMaxValueFromPricesValue() {
      return Math.max(...this.getAllPricesValue);
    },
  },

  methods: {
    changeValue(value) {
      const closestValue = getClosestValue(
        this.getAllPricesValue,
        Number(value)
      );

      if (this.isOnlyTwoItemsInPrices === false) {
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        this.valueTypeRange = getIndex;
        this.insuredSum = closestValue;
      }
      if (this.isOnlyTwoItemsInPrices === true) {
        this.valueTypeRange = this.valueTypeNumber;
        this.insuredSum = this.valueTypeNumber;
      }
    },
    getNearestValue() {
      const closestValue = getClosestValue(
        this.getAllPricesValue,
        this.valueTypeNumber
      );
      if (this.isOnlyTwoItemsInPrices === false) {
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        this.valueTypeRange = getIndex;
        this.insuredSum = closestValue;
        this.valueTypeNumber = closestValue;
      }
      if (this.isOnlyTwoItemsInPrices === true) {
        this.valueTypeRange = this.valueTypeNumber;
        this.insuredSum = this.valueTypeNumber;
        if (this.valueTypeNumber < this.getMinValueFromPricesValue) {
          this.valueTypeNumber = this.getMinValueFromPricesValue;
        }
        if (this.valueTypeNumber > this.getMaxValueFromPricesValue) {
          this.valueTypeNumber = this.getMaxValueFromPricesValue;
        }
      }
    },

    handleValue(value) {
      if (this.isOnlyTwoItemsInPrices === false) {
        this.insuredSum = this.getAllPricesValue[value];
        this.valueTypeNumber = this.insuredSum;
      }
      if (this.isOnlyTwoItemsInPrices === true) {
        this.valueTypeNumber = Number(value);
        this.insuredSum = Number(this.valueTypeNumber);
      }
    },
    moveToCurrentValue(value) {
      const getValue = value.NVALUE;
      if (getValue) {
        if (this.isOnlyTwoItemsInPrices === false) {
          this.insuredSum = getValue;
          this.valueTypeNumber = getValue;
          const getIndexValue = this.getAllPricesValue.indexOf(getValue);
          this.valueTypeRange = getIndexValue;
        }
        if (this.isOnlyTwoItemsInPrices === true) {
          this.insuredSum = getValue;
          this.valueTypeNumber = getValue;
          this.valueTypeRange = getValue;
        }
      }
      if (!getValue) {
        const getId = value.ID;
        this.insuredSum = getId;
        this.valueTypeNumber = getId;
        if (this.isOnlyTwoItemsInPrices === true) {
          this.valueTypeRange = getId;
        }
        if (this.isOnlyTwoItemsInPrices === false) {
          const getIndex = this.getAllPricesValue.indexOf(getId);
          this.valueTypeRange = getIndex;
        }
      }
      if (this.insuredSum >= this.getMinValueFromPricesValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.isOnlyTwoItemsInPrices
            ? this.insuredSum
            : this.data.options.find((item) => item.NVALUE === this.insuredSum)
                ?.ID,
        });
      }
    },

    addInsuranceSum() {
      this.valueTypeRange = Number(this.valueTypeRange);
      if (this.isOnlyTwoItemsInPrices === false) {
        this.valueTypeRange += 1;
        this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
        this.valueTypeNumber = this.insuredSum;
      }
      if (this.isOnlyTwoItemsInPrices === true) {
        const closestValue = getClosestValue(
          this.getAllPricesValue,
          this.insuredSum
        );
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        this.valueTypeRange = getIndex + 1;
        this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
        this.valueTypeNumber = this.insuredSum;
      }
    },

    degradeInsuranceSum() {
      this.valueTypeRange = Number(this.valueTypeRange);
      if (
        this.valueTypeRange < this.getMinRangeValue &&
        this.isOnlyTwoItemsInPrices === false
      ) {
        this.valueTypeRange = this.getMinRangeValue;
      }
      if (this.isOnlyTwoItemsInPrices === false) {
        this.valueTypeRange -= 1;
        this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
        this.valueTypeNumber = this.insuredSum;
      }
      if (this.isOnlyTwoItemsInPrices === true) {
        const closestValue = getClosestValue(
          this.getAllPricesValue,
          this.insuredSum
        );
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        this.valueTypeRange = getIndex - 1;
        this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
        this.valueTypeNumber = this.insuredSum;
      }
      this.insuredSum = this.getAllPricesValue[this.valueTypeRange];
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
  color: #43b02a;
  --thumb-height: 15px;
  --track-height: 2px;
  --track-color: #c3c3c3;
  --brightness-hover: 100%;
  --brightness-down: 100%;
  --clip-edges: 2px;
  border: 0;
  border-radius: 0;
  position: absolute;
  bottom: 32px;
  background: transparent;
}

input[type="range"]:focus,
input[type="range"]:hover {
  border: 0;
  color: #43b02a;
}
input[type="range"].win10-thumb {
  color: #43b02a;
  --thumb-height: 15px;
  --thumb-width: 15px;
  --clip-edges: 0.0125em;
}

/* === range commons === */
input[type="range"] {
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
}

input[type="range"]:active {
  cursor: grabbing;
}

input[type="range"]:disabled {
  filter: grayscale(1);
  opacity: 0.3;
  cursor: not-allowed;
}

/* === WebKit specific styles === */
input[type="range"],
input[type="range"]::-webkit-slider-runnable-track,
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  transition: all ease 100ms;
  height: var(--thumb-height);
}

input[type="range"]::-webkit-slider-runnable-track,
input[type="range"]::-webkit-slider-thumb {
  position: relative;
}

input[type="range"]::-webkit-slider-thumb {
  /***  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: #43b02a;
  box-shadow: 0 0 0 5px white;***/
  --thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
  --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
  --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
  --clip-further: calc(100% + 1px);
  --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
    100vmax currentColor;

  width: var(--thumb-width, var(--thumb-height));
  background: linear-gradient(currentColor 0 0) scroll no-repeat left center /
    50% calc(var(--track-height) + 1px);
  background-color: currentColor;
  box-shadow: var(--box-fill);
  border-radius: var(--thumb-width, var(--thumb-height));

  filter: brightness(100%);
  clip-path: polygon(
    100% -1px,
    var(--clip-edges) -1px,
    0 var(--clip-top),
    -100vmax var(--clip-top),
    -100vmax var(--clip-bottom),
    0 var(--clip-bottom),
    var(--clip-edges) 100%,
    var(--clip-further) var(--clip-further)
  );
}

input[type="range"]:hover::-webkit-slider-thumb {
  filter: brightness(var(--brightness-hover));
  cursor: grab;
}

input[type="range"]:active::-webkit-slider-thumb {
  filter: brightness(var(--brightness-down));
  cursor: grabbing;
}

input[type="range"]::-webkit-slider-runnable-track {
  background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
    100% calc(var(--track-height) + 1px);
}

input[type="range"]:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

/* === Firefox specific styles === */
input[type="range"],
input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-thumb {
  appearance: none;
  transition: all ease 100ms;
  height: var(--thumb-height);
}

input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-thumb,
input[type="range"]::-moz-range-progress {
  background: #43b02a;
}

input[type="range"]::-moz-range-thumb {
  background: currentColor;
  border: 0;
  width: var(--thumb-width, var(--thumb-height));
  border-radius: var(--thumb-width, var(--thumb-height));
  cursor: grab;
}

input[type="range"]:active::-moz-range-thumb {
  cursor: grabbing;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  background: #43b02a;
}

input[type="range"]::-moz-range-progress {
  appearance: none;
  background: #43b02a;
  transition-delay: 30ms;
}

input[type="range"]::-moz-range-track,
input[type="range"]::-moz-range-progress {
  height: calc(var(--track-height) + 1px);
  border-radius: var(--track-height);
}

input[type="range"]::-moz-range-thumb,
input[type="range"]::-moz-range-progress {
  filter: #43b02a;
}

input[type="range"]:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.range-list {
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 0;
}
.range-list li {
  padding: 0;
  margin: 0;
  text-align: center;
  position: absolute;
  top: 10px;
  cursor: pointer;
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

.range-list[data-amountofvalues="7"] > li {
  max-width: calc(100% / 7);
}
.range-list[data-amountofvalues="7"] > li:nth-child(2) {
  left: calc(100% / 6);
}
.range-list[data-amountofvalues="7"] > li:nth-child(3) {
  left: calc((100% / 6) * 2);
}
.range-list[data-amountofvalues="7"] > li:nth-child(4) {
  left: calc((100% / 6) * 3);
}
.range-list[data-amountofvalues="7"] > li:nth-child(5) {
  left: calc((100% / 6) * 4);
}
.range-list[data-amountofvalues="7"] > li:nth-child(6) {
  left: calc((100% / 6) * 5);
}

.range-list[data-amountofvalues="8"] > li {
  max-width: calc(100% / 8);
}
.range-list[data-amountofvalues="8"] > li:nth-child(2) {
  left: calc(100% / 7);
}
.range-list[data-amountofvalues="8"] > li:nth-child(3) {
  left: calc((100% / 7) * 2);
}
.range-list[data-amountofvalues="8"] > li:nth-child(4) {
  left: calc((100% / 7) * 3);
}
.range-list[data-amountofvalues="8"] > li:nth-child(5) {
  left: calc((100% / 7) * 4);
}
.range-list[data-amountofvalues="8"] > li:nth-child(6) {
  left: calc((100% / 7) * 5);
}
.range-list[data-amountofvalues="8"] > li:nth-child(7) {
  left: calc((100% / 7) * 6);
}

.range-list[data-amountofvalues="9"] > li {
  max-width: calc(100% / 9);
}
.range-list[data-amountofvalues="9"] > li:nth-child(2) {
  left: calc(100% / 8);
}
.range-list[data-amountofvalues="9"] > li:nth-child(3) {
  left: calc((100% / 8) * 2);
}
.range-list[data-amountofvalues="9"] > li:nth-child(4) {
  left: calc((100% / 8) * 3);
}
.range-list[data-amountofvalues="9"] > li:nth-child(5) {
  left: calc((100% / 8) * 4);
}
.range-list[data-amountofvalues="9"] > li:nth-child(6) {
  left: calc((100% / 8) * 5);
}
.range-list[data-amountofvalues="9"] > li:nth-child(7) {
  left: calc((100% / 8) * 6);
}
.range-list[data-amountofvalues="9"] > li:nth-child(8) {
  left: calc((100% / 8) * 7);
}

.range-list[data-amountofvalues="10"] > li {
  max-width: calc(100% / 10);
}
.range-list[data-amountofvalues="10"] > li:nth-child(2) {
  left: calc(100% / 9);
}
.range-list[data-amountofvalues="10"] > li:nth-child(3) {
  left: calc((100% / 9) * 2);
}
.range-list[data-amountofvalues="10"] > li:nth-child(4) {
  left: calc((100% / 9) * 3);
}
.range-list[data-amountofvalues="10"] > li:nth-child(5) {
  left: calc((100% / 9) * 4);
}
.range-list[data-amountofvalues="10"] > li:nth-child(6) {
  left: calc((100% / 9) * 5);
}
.range-list[data-amountofvalues="10"] > li:nth-child(7) {
  left: calc((100% / 9) * 6);
}
.range-list[data-amountofvalues="10"] > li:nth-child(8) {
  left: calc((100% / 9) * 7);
}
.range-list[data-amountofvalues="10"] > li:nth-child(9) {
  left: calc((100% / 9) * 8);
}

.range-list[data-amountofvalues="11"] > li {
  max-width: calc(100% / 11);
}
.range-list[data-amountofvalues="11"] > li:nth-child(2) {
  left: calc(100% / 10);
}
.range-list[data-amountofvalues="11"] > li:nth-child(3) {
  left: calc((100% / 10) * 2);
}
.range-list[data-amountofvalues="11"] > li:nth-child(4) {
  left: calc((100% / 10) * 3);
}
.range-list[data-amountofvalues="11"] > li:nth-child(5) {
  left: calc((100% / 10) * 4);
}
.range-list[data-amountofvalues="11"] > li:nth-child(6) {
  left: calc((100% / 10) * 5);
}
.range-list[data-amountofvalues="11"] > li:nth-child(7) {
  left: calc((100% / 10) * 6);
}
.range-list[data-amountofvalues="11"] > li:nth-child(8) {
  left: calc((100% / 10) * 7);
}
.range-list[data-amountofvalues="11"] > li:nth-child(9) {
  left: calc((100% / 10) * 8);
}
.range-list[data-amountofvalues="11"] > li:nth-child(10) {
  left: calc((100% / 10) * 9);
}

.range-list[data-amountofvalues="12"] > li {
  max-width: calc(100% / 12);
}
.range-list[data-amountofvalues="12"] > li:nth-child(2) {
  left: calc(100% / 11);
}
.range-list[data-amountofvalues="12"] > li:nth-child(3) {
  left: calc((100% / 11) * 2);
}
.range-list[data-amountofvalues="12"] > li:nth-child(4) {
  left: calc((100% / 11) * 3);
}
.range-list[data-amountofvalues="12"] > li:nth-child(5) {
  left: calc((100% / 11) * 4);
}
.range-list[data-amountofvalues="12"] > li:nth-child(6) {
  left: calc((100% / 11) * 5);
}
.range-list[data-amountofvalues="12"] > li:nth-child(7) {
  left: calc((100% / 11) * 6);
}
.range-list[data-amountofvalues="12"] > li:nth-child(8) {
  left: calc((100% / 11) * 7);
}
.range-list[data-amountofvalues="12"] > li:nth-child(9) {
  left: calc((100% / 11) * 8);
}
.range-list[data-amountofvalues="12"] > li:nth-child(10) {
  left: calc((100% / 11) * 9);
}
.range-list[data-amountofvalues="12"] > li:nth-child(11) {
  left: calc((100% / 11) * 10);
}

.range-list[data-amountofvalues="13"] > li {
  max-width: calc(100% / 13);
}
.range-list[data-amountofvalues="13"] > li:nth-child(2) {
  left: calc(100% / 12);
}
.range-list[data-amountofvalues="13"] > li:nth-child(3) {
  left: calc((100% / 12) * 2);
}
.range-list[data-amountofvalues="13"] > li:nth-child(4) {
  left: calc((100% / 12) * 3);
}
.range-list[data-amountofvalues="13"] > li:nth-child(5) {
  left: calc((100% / 12) * 4);
}
.range-list[data-amountofvalues="13"] > li:nth-child(6) {
  left: calc((100% / 12) * 5);
}
.range-list[data-amountofvalues="13"] > li:nth-child(7) {
  left: calc((100% / 12) * 6);
}
.range-list[data-amountofvalues="13"] > li:nth-child(8) {
  left: calc((100% / 12) * 7);
}
.range-list[data-amountofvalues="13"] > li:nth-child(9) {
  left: calc((100% / 12) * 8);
}
.range-list[data-amountofvalues="13"] > li:nth-child(10) {
  left: calc((100% / 12) * 9);
}
.range-list[data-amountofvalues="13"] > li:nth-child(11) {
  left: calc((100% / 12) * 10);
}
.range-list[data-amountofvalues="13"] > li:nth-child(12) {
  left: calc((100% / 12) * 11);
}

.range-control {
  position: relative;
  padding-bottom: 40px;
}
.custom-range {
  position: absolute;
  bottom: 37px;
  left: 0px;
}
input {
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
button {
  display: none;
}
@media (max-width: 992px) {
  input {
    border-bottom-right-radius: 15px !important;
    border-bottom-left-radius: 15px !important;
    padding-left: 49px !important;
    padding-right: 49px !important;
    height: 48px !important;
  }
  #inp {
    display: none;
  }
  button {
    display: block;
    position: absolute;
    z-index: 1;
    bottom: 20px;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 0 15px 15px 0;
  }
  button:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  #add {
    right: 0;
    background: url(/img/icon-range-add.svg) 50% 50% no-repeat;
  }
  #subtract {
    left: 0;
    background: url(/img/icon-range-subtract.svg) 50% 50% no-repeat;
  }
  .range-list[data-amountofvalues] > li {
    display: none;
  }
  .range-list[data-amountofvalues] > li:last-child,
  .range-list[data-amountofvalues] > li:first-child {
    display: block;
    top: 0px;
    width: 45%;
    max-width: 45%;
    font-size: 0.75rem;
    color: #868686;
  }
  .range-control {
    padding-bottom: 20px;
  }
}
</style>
