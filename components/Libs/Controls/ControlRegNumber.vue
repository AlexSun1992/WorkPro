<template>
  <div>
    <b-form-group :class="{ required: data.required }">
      <template #label>
        <span v-html="data.label" />
      </template>
      <b-input-group
        class="gos-number mb-2"
        :class="isValid === true ? 'is-valid' : 'is-invalid'"
      >
        <b-form-input
          v-model="numberValue"
          @update="numberUpdateValue"
          :formatter="numberFormatter"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          placeholder="А 000 АА"
          ref="number"
        />
        <b-form-input
          v-model="codeValue"
          @update="codeUpdateValue"
          :formatter="codeFormatter"
          @blur="codeBlur"
          placeholder="000"
          ref="code"
        />
      </b-input-group>
      <b-form-text v-if="isValid === null && data.state === null"
        >Введите госномер, а мы заполним данные в калькуляторе</b-form-text
      >
      <b-form-invalid-feedback v-if="isValid !== null" :state="isValid">{{
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
      let setValue = null;
      if (isNumberValid(value.replace(/ /g, ""))) {
        this.$refs.code.$el.focus();
        if (this.stateNumber && this.stateCode) {
          setValue = this.numberAndCodeValue;
          this.isVisitedNumber = true;
        }
      }
      if ((this.isVisitedNumber && this.isVisitedCode) || setValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: setValue,
        });
      }
    },
    codeUpdateValue(value) {
      let setValue = null;
      if (isCodeValid(value)) {
        if (this.stateNumber && this.stateCode) {
          setValue = this.numberAndCodeValue;
          this.isVisitedCode = true;
        }
      }
      if ((this.isVisitedNumber && this.isVisitedCode) || setValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: setValue,
        });
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
    isValid() {
      if (this.isVisitedNumber === true && this.isVisitedCode === true) {
        return this.stateNumber && this.stateCode;
      }
      return null;
    },
  },
};
</script>

<style scoped></style>
