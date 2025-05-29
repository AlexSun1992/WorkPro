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
        <RegNumberInput
          v-model="numberValue"
          :formatter="numberFormatter"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          :disabled="regNumberDisabled"
          placeholder="А 000 АА"
          autocomplete="off"
          ref="number"
        />

        <RegNumberInput
          v-model="codeValue"
          :formatter="codeFormatter"
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
import RegNumberInput from "./RegNumberInput";
import {
  isCodeValid,
  isNumberValid,
  isValid,
} from "../ControlRegNumber/helpers";

export default {
  name: "RegNumberAutoNumber",
  components: { RegNumberInput, BCol, BRow },
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
    };
  },
  computed: {
    customerCarNumbers() {
      return this.clientCars?.slice(0, 3);
    },
    isStateNumber() {
      const number = this.numberValue?.replace(/ /g, "");

      return isNumberValid(number) && number.length === 6;
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
      return this.value === "N" || this.value === null ? null : this.value;
    },
  },
  methods: {
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
      this.numberValue =
        item === null ? null : this.numberFormatter(item?.slice(0, 6));

      this.codeValue =
        item === null ? null : this.codeFormatter(item?.slice(6));

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
      if (isValid(withOutSpacesValue) === true) {
        return formatValue?.replace(
          /[АВЕКМНОРСТУХABEHKMNOPCTYX](?=\d)|\d(?=[АВЕКМНОРСТУХABEHKMNOPCTYX])/gi,
          "$& "
        );
      }
      if (isValid(withOutSpacesValue) === false) {
        return formatValue.slice(0, -1);
      }
      return formatValue || "";
    },
    codeFormatter(value) {
      if (/^\d+$/iu.test(value)) {
        if (value.length > 3) {
          return value.substring(0, 3);
        }
        return value || "";
      }
      return value.substring(0, value.length - 1) || "";
    },
    numberKeydown(e) {
      if (e.key !== "Backspace" && e.key !== "Delete") {
        if (
          /^[0-9АаВвЕеКкМмНнОоРрСсТтУуХхABEHKMNOPCTYXabehkmnopctyx]$/iu.test(
            e.key
          ) === false
        ) {
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
      const updateData = this.isWithoutCarNumber
        ? "N"
        : this.numberAndCodeValue || null;
      this.$emit("update", updateData);
    },
    setInputsVisited(val) {
      this.isVisitedNumber = !!val;
      this.state = this.isStateNumber && this.isStateCode;

      this.isVisitedCode = !!val;
      this.state = this.isStateNumber && this.isStateCode;
    },
  },
  watch: {
    numberValue(oldvalue, newValue) {
      if (oldvalue !== newValue) {
        // emit на каждый ввод символа, нужен для регуляции скрытия сообщения о несуществующем госномере
        this.updateCardValue();
        if (this.isStateNumber) {
          this.$refs.code.$el.focus();
          if (this.isStateNumber && this.isStateCode) {
            this.isVisitedNumber = true;
            this.isVisitedCode = true;
          }
        }
      }
    },
    valueComputed(newVal) {
      if (!newVal) {
        this.codeValue = "";
        this.numberValue = "";
      }
      if (this.value === "N") {
        this.setCarNumber("", false);
      }
      if (this.value !== "N" && this.value) {
        this.isWithoutCarNumber = false;
        this.regNumberDisabled = false;
        this.numberValue =
          this.value === null
            ? null
            : this.numberFormatter(this.value?.slice(0, 6));

        this.codeValue =
          this.value === null ? null : this.codeFormatter(this.value?.slice(6));
      }
    },
    codeValue(oldvalue, newValue) {
      if (oldvalue !== newValue) {
        if (this.isStateCode) {
          this.isVisitedCode = true;
        }
        this.updateCardValue();
      }
    },
  },
  mounted() {
    this.value === "N" &&
      (this.setWithoutCarNumber(true), this.goWithoutCarNumber(true));
    this.value !== "N" && this.setCarNumber(this.valueComputed, false);
  },
};
</script>

<style lang="scss" scoped></style>
