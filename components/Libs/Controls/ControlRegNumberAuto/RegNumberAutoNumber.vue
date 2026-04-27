<template>
  <div class="row align-items-center">
    <div class="col-12 col-lg-auto order-1 order-lg-1">
      <b-input-group
        v-if="placeholderNumber"
        class="gos-number"
        :class="{
          'is-invalid': isValid === false && regNumberDisabled === false,
          'is-valid': isValid,
        }"
      >
        <input
          @input="changeNumberModel"
          :value="numberModel"
          @paste="handlePaste"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          :disabled="regNumberDisabled"
          :placeholder="placeholderNumber"
          autocomplete="off"
          ref="number"
        />

        <input
          :value="codeModel"
          @input="changeCodeModel"
          @blur="codeBlur"
          :disabled="regNumberDisabled"
          placeholder="000"
          autocomplete="off"
          ref="code"
        />
      </b-input-group>
      <input
        v-else
        v-model="simpleField"
        :disabled="regNumberDisabled"
        autocomplete="off"
      />
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
      <div
        class="invalid-feedback"
        v-if="isValid === false && regNumberDisabled === false && placeholderNumber"
      >
        {{ "Пожалуйста, введите корректно госномер" }}
      </div>
    </div>
    <div class="col-12 order-3 order-lg-4">
      <div v-if="customerCarNumbers && customerCarNumbers.length">
        <button
          v-for="(item, index) in customerCarNumbers"
          :key="index"
          class="car-number-button btn-link ph4 px-0 text-decoration-none"
          @click="setCarNumber(item.SNAME)"
        >
          {{ index ? ",&nbsp;" : "" }}{{ item.SNAME }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isCodeValid, isNumberValid, isValid } from "../ControlRegNumber/helpers";
import {
  REGEXP_NUMBER,
  REGEXP_ADD_SPACE,
  AUTO_REG_NUMBER_LENGTHS,
  NON_CONTROL_KEYS,
  REGEXP_MOTO_NUMBER,
  REGEXP_MOTO_ADD_SPACE,
  MOTO_MASK_ID,
  AUTO_MASK_ID,
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
      simpleFieldValue: "",
      isVisitedNumber: false,
      isVisitedCode: false,
      state: null,
      copyPaste: false,
      selectStart: 0,
    };
  },

  watch: {
    fieldsRelationsValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.copyPaste = false;
        this.selectStart = 0;
      }

      const isValid = this.numberFormatter(this.value?.slice(0, 6) || "");

      const isValueChanged = newVal !== oldVal && !isValid;
      const isInvalidAndShort = isValid && this.numberModel.length < 6;
      const isSpecificValue = newVal === 3;

      if (isValueChanged || isInvalidAndShort || isSpecificValue) {
        this.resetFields();
      }
    },
  },
  computed: {
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](this.data.fieldRelation.split(";"));
      }
      return [];
    },
    fieldsRelationsValue() {
      return this.fieldsRelations[0]?.value || 1;
    },
    placeholderNumber() {
      if (this.fieldsRelationsValue === MOTO_MASK_ID) {
        return "0000 AA";
      }
      if (this.fieldsRelationsValue === AUTO_MASK_ID || !this.fieldsRelationsValue || !this.fieldsRelations.length) {
        return "А 000 АА";
      }
      return "";
    },
    numberDigits() {
      return this.placeholderNumber?.replace(/ /g, "")?.length || 0;
    },
    simpleField: {
      get() {
        return this.valueComputed === "N" ? "" : this.valueComputed;
      },
      set(value) {
        this.simpleFieldValue = value;
        this.updateCardValue();
      },
    },

    numberModel() {
      return this.getNumberValue();
    },
    codeModel() {
      return this.getCodeValue();
    },
    customerCarNumbers() {
      return this.clientCars?.slice(0, 3);
    },
    isStateNumber() {
      const number = this.numberValue?.replace(/ /g, "");
      return isNumberValid(number) && number?.length === this.numberDigits;
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
      if ((!this.isVisitedNumber || !this.isVisitedCode) && (this.isVisitedCode || this.isVisitedNumber)) {
        return this.isStateNumber && this.isStateCode;
      }
      return null;
    },
    valueComputed() {
      if (typeof this.value === "string" && this.value.length > 0 && this.value !== null && this.value !== "N") {
        this.isWithoutCarNumber = false;
        this.regNumberDisabled = false;
      }
      return this.value;
    },
  },
  methods: {
    changeNumberModel($event) {
      const { value } = $event.target;
      this.setNumberValue(value);
    },
    changeCodeModel($event) {
      const { value } = $event.target;
      this.setCodeValue(value);
    },
    resetFields() {
      this.isWithoutCarNumber = false;
      this.regNumberDisabled = false;
      this.simpleFieldValue = "";
      this.numberValue = "";
      this.codeValue = "";
      this.$emit("update", "");
    },

    getNumberValue() {
      const rawValue = this.valueComputed?.replace(/ /g, "") || "";
      const currentLength = this.numberValue?.replace(/ /g, "")?.length || 0;
      if (currentLength > 0) {
        if (currentLength > 6) {
          this.codeValue = "";
          this.numberValue = "";
          return this.numberFormatter(rawValue.slice(0, 6));
        }
        return this.numberFormatter(rawValue.slice(0, currentLength));
      }

      if (AUTO_REG_NUMBER_LENGTHS.includes(rawValue.length)) {
        const formattedValue = this.numberFormatter(rawValue.slice(0, this.numberDigits));
        this.numberValue = formattedValue;
        return formattedValue;
      }

      if (currentLength === 0) {
        return "";
      }
      return this.numberFormatter(rawValue.slice(0, this.numberDigits));
    },

    setNumberValue(value) {
      const valueWithoutSpace = value?.replace(/ /g, "");
      const croppedValue = valueWithoutSpace?.slice(0, this.numberDigits);

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
        this.simpleFieldValue = "";
        return "";
      }

      if (codeLength > 0) {
        return this.codeFormatter(value?.slice(-codeLength) || "");
      }

      if (value && AUTO_REG_NUMBER_LENGTHS.includes(value.length)) {
        const slicedValue = value.slice(this.numberDigits);
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

      if (AUTO_REG_NUMBER_LENGTHS.includes(pastedData?.length) && this.fieldsRelationsValue !== 3) {
        this.codeValue = this.codeFormatter(pastedData?.slice(this.numberDigits));
        this.numberValue = this.numberFormatter(pastedData?.slice(0, this.numberDigits));
      }
      this.updateCardValue();
    },

    handleBlur() {
      if (!this.isStateNumber) {
        this.setNumberValue("");
      }
    },
    goWithoutCarNumber(val) {
      if (val) {
        this.isWithoutCarNumber = true;
        this.regNumberDisabled = true;
        this.simpleFieldValue = "";
        this.updateCardValue();

        return;
      }
      this.updateCardValue();
      this.regNumberDisabled = false;
      this.isWithoutCarNumber = false;
    },
    setCarNumber(item, visited) {
      if (this.regNumberDisabled) {
        return;
      }
      if (this.valueComputed) {
        this.resetFields();
      }
      this.numberValue = item === null ? null : this.numberFormatter(item?.slice(0, this.numberDigits));
      this.codeValue = item === null ? null : this.codeFormatter(item?.slice(this.numberDigits));

      this.setWithoutCarNumber(false);
      this.setInputsVisited(typeof visited === "boolean" ? visited : true);
      this.updateCardValue();
    },
    setWithoutCarNumber(val) {
      this.isWithoutCarNumber = Boolean(val);
    },
    numberFormatter(value) {
      let regexp;
      let addSpaceRegexp;

      if (this.fieldsRelationsValue === MOTO_MASK_ID) {
        regexp = REGEXP_MOTO_NUMBER;
        addSpaceRegexp = REGEXP_MOTO_ADD_SPACE;
      } else if (this.fieldsRelationsValue === AUTO_MASK_ID) {
        regexp = REGEXP_NUMBER;
        addSpaceRegexp = REGEXP_ADD_SPACE;
      } else {
        return value;
      }

      const formattedValue = value.toUpperCase();
      const valueWithoutSpaces = formattedValue.replace(/ /g, "");
      if (this.copyPaste) {
        return this.handlePasteFormatting(valueWithoutSpaces, regexp, addSpaceRegexp);
      }
      return this.handleInputFormatting(formattedValue, valueWithoutSpaces, regexp, addSpaceRegexp);
    },

    handlePasteFormatting(value, regexp, addSpaceRegexp) {
      const isValid = regexp.test(value);
      return isValid ? value.replace(addSpaceRegexp, "$& ") : "";
    },

    handleInputFormatting(formattedValue, valueWithoutSpaces, regexp, addSpaceRegexp) {
      const invalidIndex = isValid(valueWithoutSpaces, this.fieldsRelationsValue, this.numberDigits);

      if (invalidIndex === -1) {
        return formattedValue.replace(addSpaceRegexp, "$& ");
      }
      return this.handleInvalidInput(formattedValue, valueWithoutSpaces, addSpaceRegexp);
    },

    handleInvalidInput(formattedValue, valueWithoutSpaces, addSpaceRegexp) {
      const croppedValue = formattedValue.slice(0, this.selectStart + 1);
      const croppedWithoutSpaces = croppedValue.replace(/ /g, "");
      const croppedInvalidIndex = isValid(croppedWithoutSpaces, this.fieldsRelationsValue, this.numberDigits);

      if (croppedInvalidIndex === -1) {
        return croppedValue.replace(addSpaceRegexp, "$& ");
      }
      if (valueWithoutSpaces.length > this.numberDigits) {
        return this.handleExcessLength(formattedValue, addSpaceRegexp);
      }
      return formattedValue.slice(0, this.selectStart);
    },

    handleExcessLength(formattedValue, addSpaceRegexp) {
      const correctedValue = `${formattedValue.slice(0, this.selectStart)}${formattedValue.slice(
        this.selectStart + 1
      )}`;
      return correctedValue.replace(addSpaceRegexp, "$& ");
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
      let updateData;
      if (this.isWithoutCarNumber) {
        updateData = "N";
      } else if (!this.placeholderNumber) {
        updateData = this.simpleFieldValue || null;
      } else {
        updateData = this.numberAndCodeValue || null;
      }

      this.$emit("update", updateData);
    },
    setInputsVisited(val) {
      this.isVisitedNumber = Boolean(val);
      this.state = this.isStateNumber && this.isStateCode;
      this.isVisitedCode = Boolean(val);
      this.state = this.isStateNumber && this.isStateCode;
    },
  },
};
</script>

<style></style>
