<template>
  <div>
    <b-form-group :class="{ required: data.required }">
      <template #label>
        <span v-html="data.label" />
      </template>
      <b-input-group class="mb-2">
        <b-form-input
          v-model="numberValue"
          @update="numberUpdateValue"
          :formatter="numberFormatter"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          :state="isVisitedNumber === false ? null : stateNumber"
          ref="number"
        />
        <b-form-input
          v-model="codeValue"
          @update="codeUpdateValue"
          :formatter="codeFormatter"
          @blur="codeBlur"
          :state="isVisitedCode === false ? null : stateCode"
          ref="code"
        />
      </b-input-group>
      <b-form-invalid-feedback v-if="errorText !== null" :state="errorText">{{
        data.error ? data.error : "Пожалуйста, введите корректно госномер"
      }}</b-form-invalid-feedback>
      <b-form-invalid-feedback v-else :state="data.state">{{
        data.error ? data.error : "Обязательно для заполнения"
      }}</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>
<script>
const isNumberValid = function (value) {
  if (/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}$/iu.test(value)) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХ]{2}\d{3}(?<!000)$/iu.test(value)) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХ]{2}\d{4}(?<!0000)$/iu.test(value)) {
    return true;
  }
  if (/^\d{4}(?<!0000)[АВЕКМНОРСТУХ]{2}$/iu.test(value)) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХ]{2}\d{3}(?<!000)[АВЕКМНОРСТУХ]$/iu.test(value)) {
    return true;
  }
  if (/^Т[АВЕКМНОРСТУХ]{2}\d{3}(?<!000)$/iu.test(value)) {
    return true;
  }
  return false;
};
const isCodeValid = function (value) {
  if (/^\d+$/iu.test(value) && value.length > 1) {
    return true;
  }
  return false;
};
export default {
  name: "ControlRegNumber",
  data() {
    return {
      numberValue: "",
      codeValue: "",
      isVisitedNumber: false,
      isVisitedCode: false,
      state: null,
    };
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
      default: () => false,
    },
  },
  methods: {
    numberUpdateValue(value) {
      if (isNumberValid(value.replace(/ /g, ""))) {
        this.$refs.code.$el.focus();
        if (this.stateNumber && this.stateCode) {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            value: this.numberAndCodeValue,
          });
        }
      }
    },
    codeUpdateValue(value) {
      if (isCodeValid(value)) {
        if (this.stateNumber && this.stateCode) {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            value: this.numberAndCodeValue,
          });
        }
      }
    },
    numberFormatter(value) {
      let formatValue = value.toUpperCase();
      if (isNumberValid(value)) {
        formatValue = formatValue.replace(
          /[АВЕКМНОРСТУХ](?=\d)|\d(?=[АВЕКМНОРСТУХ])/gi,
          "$& "
        );
      } else {
        if (formatValue.replace(/ /g, "").length > 6) {
          return formatValue.substring(0, formatValue.length - 1);
        }
      }
      return formatValue;
    },
    codeFormatter(value) {
      if (/^\d+$/iu.test(value)) {
        if (value.length > 3) {
          return value.substring(0, 3);
        }
        return value;
      } else {
        return value.substring(0, value.length - 1);
      }
    },
    numberKeydown(e) {
      if (e.key !== "Backspace" && e.key !== "Delete") {
        if (/^[0-9АаВвЕеКкМмНнОоРрСсТтУуХх]$/iu.test(e.key) === false) {
          e.preventDefault();
        }
      }
    },
    numberBlur() {
      this.isVisitedNumber = true;
      this.state = this.stateNumber && this.stateCode;
    },
    codeBlur() {
      this.isVisitedCode = true;
      this.state = this.stateNumber && this.stateCode;
    },
  },
  computed: {
    stateNumber() {
      return isNumberValid(this.numberValue.replace(/ /g, ""));
    },
    stateCode() {
      return isCodeValid(this.codeValue);
    },
    numberAndCodeValue() {
      return this.numberValue.replace(/ /g, "") + this.codeValue;
    },
    errorText() {
      if (this.isVisitedNumber === true && this.isVisitedCode === true) {
        return this.stateNumber && this.stateCode;
      }
      if (this.isVisitedNumber === true && this.isVisitedCode === false) {
        return this.stateNumber;
      }
      if (this.isVisitedNumber === false && this.isVisitedCode === true) {
        return this.stateCode;
      }
      return null;
    },
  },
};
</script>

<style scoped></style>
