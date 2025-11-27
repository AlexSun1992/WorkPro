<template>
  <div
    class="range-control"
    :class="isDisabled ? 'disabled' : ''"
  >
    <div>
      <label
        v-if="data.label"
        :for="data.name"
      >
        <span
          >{{ data.label
          }}<span
            v-if="data.helpText"
            class="position-relative"
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
        v-model="valueTypeNumber"
        :currency="{ suffix: '₽' }"
        :class="this.valueTypeNumber < getMinValueFromPricesValue ? 'is-invalid' : ''"
        @input="changeValue(valueTypeNumber)"
        @blur="getNearestValue()"
        useGrouping="thounsands"
        :precision="0"
        locale="ru"
        type="tel"
        :disabled="isDisabled"
        :id="data.name"
      ></currency-input>

      <b-form-input
        @input="handleValue(valueTypeRange)"
        @mouseup="showLoader"
        @mousedown="emitFunc"
        :id="`inp${data.name}`"
        v-model="valueTypeRange"
        type="range"
        :min="0"
        :max="maxValueRange"
        :disabled="isDisabled"
      >
      </b-form-input>

      <ul
        :data-amountOfValues="data.options.length"
        class="range-list"
      >
        <li
          v-for="item in data.options"
          :key="item.ID"
          :class="{
            active: item.value === valueTypeNumber,
            select: item.value < valueTypeNumber,
          }"
          @click="moveToCurrentValue(item)"
        >
          <span>{{ item.SNAME_SHORT }}</span>
        </li>
      </ul>
      <button
        id="add"
        :disabled="isMaxValueReach"
        @click="addInsuranceSum(valueTypeNumber)"
      ></button>
      <button
        id="subtract"
        :disabled="isMinValueReach"
        @click="degradeInsuranceSum(valueTypeNumber)"
      ></button>
    </div>
  </div>
</template>
<script>
import { BFormInput } from "bootstrap-vue";
import { CurrencyInput } from "vue-currency-input";
import { getClosestValue } from "../ControlRange/ControlRange.helper";
import {
  createArrayOfVirtualPoints,
  computedValue,
  moveToCurrentComputedValueTypeNumber,
  moveRangeToComputedValueNumber,
  inputValue,
} from "./ControlRangeInput.helper";

export default {
  name: "ControlRangeInput",
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
      width: 0,
      maxValueRange: null,
      timeoutId: null,
    };
  },

  updated() {
    const getRangeElement = document.getElementById(`inp${this.data.name}`);
    this.maxValueRange = getRangeElement.clientWidth;
  },

  created() {
    const getValue = this.data.value;
    if (getValue) {
      if (getValue >= this.getMaxValueFromPricesValue) {
        this.valueTypeNumber = this.getMaxValueFromPricesValue;
      }
      if (getValue <= this.getMinValueFromPricesValue) {
        this.valueTypeNumber = this.getMinValueFromPricesValue;
      }
      if (getValue > this.getMinValueFromPricesValue && getValue < this.getMaxValueFromPricesValue) {
        this.valueTypeNumber = getValue;
      }

      this.valueTypeRange = this.valueTypeNumber;
    }

    if (!getValue) {
      const valueNvalue = this.data.options.find((item) => Object.hasOwn(item, "NVALUE"));
      this.valueTypeRange = valueNvalue.NVALUE;
      this.valueTypeNumber = this.valueTypeRange;
    }
  },

  async mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    getAllPricesValue(nVal, oldVal) {
      if (JSON.stringify(nVal) !== JSON.stringify(oldVal)) {
        const value = moveRangeToComputedValueNumber(
          this.getAllPricesValue,
          document.getElementById(`inp${this.data.name}`)?.clientWidth,
          this.data.value
        );
        this.valueTypeRange = value;
        this.getNearestValue();
        this.handleResize();
      }
    },
  },
  computed: {
    isDisabled() {
      const isDisabled = !this.edit ? !this.edit : this.data.readonly;
      return isDisabled;
    },
    getAllPricesValue() {
      const findvalueNvalue = this.data.options.find((item) => item.NVALUE);
      if (findvalueNvalue) {
        const getSpeciaPriceslData = this.data.options.map((item) => item.NVALUE);
        return getSpeciaPriceslData;
      }
      const getPricesFromData = this.data.options.map((item) => item.value);
      return getPricesFromData;
    },
    isOnlyTwoItemsInPrices() {
      if (this.getAllPricesValue.length === 2) {
        return false;
      }
      return true;
    },

    getRangeValue() {
      return this.$store.getters["data_card/getRangeValue"];
    },
    isMinValueReach() {
      if (this.valueTypeNumber === this.getAllPricesValue[this.getMinRangeValue]) {
        return true;
      }
      return false;
    },

    isMaxValueReach() {
      if (this.valueTypeNumber === this.getAllPricesValue[this.getMaxRangeValue]) {
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

    getMaxValueRange() {
      const elementRange = document.getElementById(`inp${this.data.name}`);
      if (elementRange) {
        return elementRange.clientWidth;
      }
      return 0;
    },
  },

  methods: {
    showLoader() {
      this.emitFunc();

      if (this.valueTypeNumber !== this.data.value) {
        this.$store.commit("data_card/setLoading", true);
      }
    },
    emitFunc() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.valueTypeNumber,
      });

      this.$store.commit("data_card/setLoading", false);
    },
    getNearestValue() {
      const closestValue = getClosestValue(this.getAllPricesValue, this.valueTypeNumber);

      if (this.valueTypeNumber > this.getAllPricesValue[this.getMaxRangeValue]) {
        this.valueTypeNumber = closestValue;
      }

      if (this.valueTypeNumber < this.getAllPricesValue[this.getMinRangeValue]) {
        this.valueTypeNumber = closestValue;
      }
      if (this.valueTypeNumber === "") {
        this.valueTypeNumber = this.getAllPricesValue[this.getMinRangeValue];
      }
      this.emitFunc();
    },
    handleResize() {
      this.width = window.innerWidth;
      const getRangeHTMLElement = document.getElementById(`inp${this.data.name}`).clientWidth;
      if (getRangeHTMLElement) {
        this.valueTypeRange = inputValue(this.getAllPricesValue, this.valueTypeNumber, getRangeHTMLElement);
      }
    },
    handleValue(value) {
      const getRangeHTMLElement = document.getElementById(`inp${this.data.name}`).clientWidth;
      const revealValue = computedValue(this.getAllPricesValue, getRangeHTMLElement, value);
      this.valueTypeNumber = Math.round(revealValue);
    },

    moveToCurrentValue(value) {
      let getRealValue = value.NVALUE ? value.NVALUE : value.value;
      if (value.NVALUE === 0) {
        getRealValue = 0;
      }
      const getRangeInputElement = document.getElementById(`inp${this.data.name}`).clientWidth;
      this.valueTypeNumber = moveToCurrentComputedValueTypeNumber(this.getAllPricesValue, getRealValue);

      this.valueTypeRange = moveRangeToComputedValueNumber(this.getAllPricesValue, getRangeInputElement, getRealValue);
      this.emitFunc();
    },

    changeValue(value) {
      const getRangeElementClientWidth = document.getElementById(`inp${this.data.name}`).clientWidth;
      this.valueTypeRange = inputValue(this.getAllPricesValue, value, getRangeElementClientWidth);
    },

    addInsuranceSum() {
      const closestValueFromRealPrices = getClosestValue(this.getAllPricesValue, this.valueTypeNumber);
      const getStep = this.data.options.find((elem) => elem.NVALUE === closestValueFromRealPrices);
      if (Object.hasOwn(getStep, "NSTEP")) {
        const getMaxValueFromPrice = Math.max(...this.getAllPricesValue);
        const virtualPoits = this.getAllPricesValue;
        const closestValueFromVirtualPoints = getClosestValue(virtualPoits, this.valueTypeNumber);
        const indexOfCurrentVirtualValue = virtualPoits.indexOf(closestValueFromVirtualPoints);
        const indexOfNextVirtualValue = indexOfCurrentVirtualValue + 1;
        this.valueTypeNumber = virtualPoits[indexOfNextVirtualValue];
      }

      if (!Object.hasOwn(getStep, "NSTEP")) {
        this.valueTypeRange = Number(this.valueTypeRange);
        const closestValue = getClosestValue(this.getAllPricesValue, this.valueTypeNumber);
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        const getNexIndex = getIndex + 1;
        this.valueTypeNumber = this.getAllPricesValue[getNexIndex];
      }
      this.getNearestValue();
    },

    degradeInsuranceSum() {
      const closestValueFromRealPrices = getClosestValue(this.getAllPricesValue, this.valueTypeNumber);
      const getStep = this.data.options.find((elem) => elem.NVALUE === closestValueFromRealPrices);

      if (getStep) {
        if (
          this.getMinValueFromPricesValue > this.valueTypeNumber ||
          this.getMaxValueFromPricesValue < this.valueTypeNumber
        ) {
          this.valueTypeRange = this.getAllPricesValue.indexOf(closestValueFromRealPrices);

          this.valueTypeNumber = this.getAllPricesValue[this.valueTypeRange];
        }

        if (Object.hasOwn(getStep, "NSTEP")) {
          const getMaxValueFromPrice = Math.max(...this.getAllPricesValue);
          const virtualPoits = this.getAllPricesValue;
          const closestValueFromVirtualPoints = getClosestValue(virtualPoits, this.valueTypeNumber);
          const indexOfCurrentVirtualValue = virtualPoits.indexOf(closestValueFromVirtualPoints);
          const indexOfNextVirtualValue = indexOfCurrentVirtualValue - 1;
          this.valueTypeNumber = virtualPoits[indexOfNextVirtualValue];
        }
      }

      if (!Object.hasOwn(getStep, "NSTEP")) {
        this.valueTypeRange = Number(this.valueTypeRange);
        if (this.valueTypeRange < this.getMinRangeValue) {
          this.valueTypeRange = this.getMinRangeValue;
        }
        const closestValue = getClosestValue(this.getAllPricesValue, this.valueTypeNumber);
        const getIndex = this.getAllPricesValue.indexOf(closestValue);
        const getNexIndex = getIndex - 1;
        this.valueTypeNumber = this.getAllPricesValue[getNexIndex];
        this.valueTypeRange = this.valueTypeNumber;
      }
      this.getNearestValue();
    },
  },
};
</script>

<style scoped>
.custom-range {
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
  --thumb-height: 15px;
  --track-height: 2px;
  --thumb-width: 15px;
  border: 7px solid currentColor;
  --thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
  --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
  --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
  --clip-further: calc(100% + 1px);
  --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0 100vmax currentColor;
  width: var(--thumb-width, var(--thumb-height));
  background: currentColor linear-gradient(currentColor 0 0) no-repeat scroll left center;
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
  background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center / 100% calc(var(--track-height) + 1px);
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

.range-control.disabled .range-list li {
  pointer-events: none;
}
@media (max-width: 992px) {
  input {
    border-bottom-right-radius: 15px !important;
    border-bottom-left-radius: 15px !important;
    padding-left: 49px !important;
    padding-right: 49px !important;
    height: 48px !important;
  }
  .custom-range {
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
.custom-range:disabled {
  border: 0 !important;
}

.range-control.disabled button {
  pointer-events: none;
  opacity: 0.5;
}
</style>
