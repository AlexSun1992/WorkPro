<template>
  <div class="row align-items-center">
    <div class="col-12 col-lg-auto order-1 order-lg-1">
      <b-input-group
        class="gos-number"
        :class="{
          'is-invalid': isValid === false && regNumberDisabled === false,
          'is-valid': isValid,
        }"
      >
        <input
          v-model="numberModel"
          @paste="handlePaste"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          :disabled="regNumberDisabled"
          placeholder="А 000 АА"
          autocomplete="off"
          ref="number"
        />

        <input
          v-model="codeModel"
          @blur="codeBlur"
          :disabled="regNumberDisabled"
          placeholder="000"
          autocomplete="off"
          ref="code"
        />
      </b-input-group>
    </div>

    <div class="col-12 col-lg-auto mt-3 mt-lg-0 order-4 order-lg-2">
      <b-checkbox
        class="checkbox-hide"
        v-model="isWithoutCarNumber"
        @change="goWithoutCarNumber($event)"
      >
        Госномера ещё нет
        <br />
        <span class="text-success">заполню данные вручную</span>
      </b-checkbox>
    </div>
    <div class="col-12 order-2 order-lg-3">
      <b-form-invalid-feedback
        v-if="isValid !== null && regNumberDisabled === false"
        :state="isValid"
        >{{ "Пожалуйста, введите корректно госномер" }}
      </b-form-invalid-feedback>
    </div>
    <div class="col-12 order-3 order-lg-4">
      <div v-if="customerCarNumbers && customerCarNumbers.length">
        <a
          href="#"
          v-for="(item, index) in customerCarNumbers"
          :key="index"
          class="lgreen text-decoration-none"
          @click="setCarNumber(item.SNAME)"
          target="_self"
        >
          <small>{{ index ? ",&nbsp;" : "" }} {{ item.SNAME }}</small>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { BCol, BRow } from "bootstrap-vue";
import { isCodeValid, isNumberValid, isValid } from "../ControlRegNumber/helpers";
import {
  REGEXP_NUMBER,
  REGEXP_ADD_SPACE,
  AUTO_REG_NUMBER_LENGTHS,
  NON_CONTROL_KEYS,
} from "./RegNumberAutoNumber.helpers";

export default {
  name: "RegNumberAutoNumber",
  props: {
    clientCars: [],
    value: {
      default: null,
    },
    data: {
      default: null,
    },
  },
  data() {
    return {
      isWithoutCarNumber: false,
      regNumberDisabled: false,
      numberValue: "",
      codeValue: "",
      isVisitedNumber: false,
      isVisitedCode: false,
      state: null,
      copyPaste: false,
      selectStart: 0,
    };
  },
  computed: {
    numberModel: {
      get() {
        this.$store.getters["data_card/getForm"];
        return this.getNumberValue();
      },
      set(value) {
        this.setNumberValue(value);
      },
    },
    codeModel: {
      get() {
        return this.getCodeValue();
      },
      set(value) {
        this.setCodeValue(value);
      },
    },
    customerCarNumbers() {
      return this.clientCars?.slice(0, 3);
    },
    isStateNumber() {
      const number = this.numberValue?.replace(/ /g, "");

      return isNumberValid(number) && number?.length === 6;
    },
    isStateCode() {
      return isCodeValid(this.codeValue?.replace(/ /g, ""));
    },
    numberAndCodeValue() {
      return this.numberValue?.replace(/ /g, "") + this.codeValue;
    },
    isValid() {
      if (this.isVisitedNumber === true && this.isVisitedCode === true) {
        return this.isStateNumber && this.isStateCode;
      }
      return null;
    },
    isDisabled() {
      return this.data?.disabled || this.data?.readonly || false;
    },
    valueComputed() {
      return this.value;
    },
  },
  methods: {
    getNumberValue() {
      const rawValue = this.valueComputed?.replace(/ /g, "") || "";
      const currentLength = this.numberValue?.replace(/ /g, "")?.length || 0;

      if (currentLength > 0) {
        return this.numberFormatter(rawValue.slice(0, currentLength));
      }

      if (AUTO_REG_NUMBER_LENGTHS.includes(rawValue.length)) {
        const formattedValue = this.numberFormatter(rawValue.slice(0, 6));
        this.numberValue = formattedValue;
        return formattedValue;
      }

      if (currentLength === 0) {
        return "";
      }

      return this.numberFormatter(rawValue.slice(0, 6));
    },

    setNumberValue(value) {
      const valueWithoutSpace = value?.replace(/ /g, "");
      const croppedValue = valueWithoutSpace?.slice(0, 6);

      if (this.copyPaste) {
        this.numberValue = this.numberFormatter(croppedValue);
      } else {
        this.numberValue = this.numberFormatter(valueWithoutSpace);
      }
      this.updateCardValue();

      if (this.isStateNumber && this.$refs.code) {
        this.$refs.code.focus();
      }
    },

    getCodeValue() {
      const value = this.valueComputed;
      const codeLength = this.codeValue?.length || 0;

      if (value === "N") {
        this.isWithoutCarNumber = true;
        this.regNumberDisabled = true;
        this.codeValue = "";
        this.numberValue = "";
        return "";
      }

      if (codeLength > 0) {
        return this.codeFormatter(value?.slice(-codeLength) || "");
      }

      if (value && AUTO_REG_NUMBER_LENGTHS.includes(value.length)) {
        const slicedValue = value.slice(6);
        this.codeValue = this.codeFormatter(slicedValue);
        return this.codeFormatter(slicedValue);
      }

      return "";
    },

    setCodeValue(value) {
      this.codeValue = this.codeFormatter(value);
      this.updateCardValue();

      if (!value && this.$refs.number) {
        this.$refs.number.focus();
      }
    },
    handlePaste(e) {
      this.copyPaste = true;
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData("text");

      if (AUTO_REG_NUMBER_LENGTHS.includes(pastedData?.length)) {
        this.codeValue = this.codeFormatter(pastedData?.slice(6));
        this.numberValue = this.numberFormatter(pastedData?.slice(0, 6));
      }
      this.updateCardValue();
    },

    handleBlur() {
      if (!this.isStateNumber) {
        this.numberModel = "";
      }
    },
    goWithoutCarNumber(val) {
      if (val) {
        this.isNotFound = false;
        this.regNumberDisabled = true;

        this.updateCardValue();

        return;
      }
      this.updateCardValue();
      this.regNumberDisabled = false;
      this.setInputsVisited(false);
    },
    setCarNumber(item, visited) {
      if (this.regNumberDisabled) {
        return;
      }
      if (this.valueComputed) {
        this.numberValue = "";
        this.codeValue = "";
      }
      this.numberValue = item === null ? null : this.numberFormatter(item?.slice(0, 6));

      this.codeValue = item === null ? null : this.codeFormatter(item?.slice(6));

      this.setWithoutCarNumber(false);
      this.setInputsVisited(typeof visited === "boolean" ? visited : true);
      this.updateCardValue();
    },
    setWithoutCarNumber(val) {
      this.isWithoutCarNumber = !!val;
    },
    numberFormatter(value) {
      const formatValue = value.toUpperCase();
      const withOutSpacesValue = formatValue?.replace(/ /g, "");
      if (this.copyPaste) {
        return !REGEXP_NUMBER.test(withOutSpacesValue) ? "" : withOutSpacesValue?.replace(REGEXP_ADD_SPACE, "$& ");
      }

      let findInvalidIndex = isValid(withOutSpacesValue);
      if (findInvalidIndex === -1) {
        return formatValue?.replace(REGEXP_ADD_SPACE, "$& ");
      }
      if (findInvalidIndex !== -1) {
        const croppedValue = formatValue.slice(0, this.selectStart + 1);

        findInvalidIndex = isValid(croppedValue);
        if (findInvalidIndex === -1) {
          return croppedValue?.replace(REGEXP_ADD_SPACE, "$& ");
        }
        if (withOutSpacesValue.length > 6) {
          return `${formatValue?.slice(0, this.selectStart)}${formatValue.slice(this.selectStart + 1)}`.replace(
            REGEXP_ADD_SPACE,
            "$& "
          );
        }
        return formatValue.slice(0, this.selectStart);
      }
    },
    codeFormatter(value) {
      if (/^\d+$/iu.test(value)) {
        if (value?.length > 3) {
          return value.substring(0, 3);
        }
        return value || "";
      }
      return "";
    },
    numberKeydown(e) {
      this.copyPaste = false;

      if (!NON_CONTROL_KEYS.includes(e.key)) {
        const input = this.$refs.number;
        const cursorPos = input.selectionStart;
        this.selectStart = input.value.substring(0, cursorPos).replace(/ /g, "").length;

        if (/^[0-9АаВвЕеКкМмНнОоРрСсТтУуХхABEHKMNOPCTYXabehkmnopctvyx]$/iu.test(e.key) === false) {
          e.preventDefault();
        }
      }
    },
    numberBlur() {
      this.isVisitedNumber = true;
      this.state = this.isStateNumber && this.isStateCode;
    },
    codeBlur() {
      this.isVisitedCode = true;
      this.state = this.isStateNumber && this.isStateCode;
    },
    updateCardValue() {
      const updateData = this.isWithoutCarNumber ? "N" : this.numberAndCodeValue || null;
      this.$emit("update", updateData);
    },
    setInputsVisited(val) {
      this.isVisitedNumber = !!val;
      this.state = this.isStateNumber && this.isStateCode;

      this.isVisitedCode = !!val;
      this.state = this.isStateNumber && this.isStateCode;
    },
  },
};
</script>
