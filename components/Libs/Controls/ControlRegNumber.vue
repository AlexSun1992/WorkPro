<template>
  <div>
    <b-form-group
      :class="{ required: data.required }"
      :disabled="!edit ? !edit : data.readonly"
    >
      <b-input-group
        :class="{
          'gos-number': true,
          'is-invalid': isValid === false && isDisabled === false,
          'is-valid': isValid === true && isVisitedNumber === true,
          'is-disabled': data.readonly ? true : false,
        }"
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
      <b-form-invalid-feedback
        v-if="isValid !== null && isDisabled === false"
        :state="isValid"
        >{{
          data.error ? data.error : "Пожалуйста, введите корректно госномер"
        }}</b-form-invalid-feedback
      >
      <b-form-invalid-feedback
        v-else-if="
          (!this.isVisitedNumber || !this.isVisitedCode) && isDisabled === false
        "
        :state="data.state"
        >{{
          data.error ? data.error : "Пожалуйста, заполните это поле"
        }}</b-form-invalid-feedback
      >
    </b-form-group>
  </div>
</template>
<script>
const isNumberValid = function (value) {
  if (
    /^[АВЕКМНОРСТУХABEKMNOPCTYX]\d{3}(?<!000)[АВЕКМНОРСТУХABEKMNOPCTYX]{2}$/iu.test(
      value
    )
  ) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХABEKMNOPCTYX]{2}\d{3}(?<!000)$/iu.test(value)) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХABEKMNOPCTYX]{2}\d{4}(?<!0000)$/iu.test(value)) {
    return true;
  }
  if (/^\d{4}(?<!0000)[АВЕКМНОРСТУХABEKMNOPCTYX]{2}$/iu.test(value)) {
    return true;
  }
  if (
    /^[АВЕКМНОРСТУХABEKMNOPCTYX]{2}\d{3}(?<!000)[АВЕКМНОРСТУХABEKMNOPCTYX]$/iu.test(
      value
    )
  ) {
    return true;
  }
  if (/^Т[АВЕКМНОРСТУХABEKMNOPCTYX]{2}\d{3}(?<!000)$/iu.test(value)) {
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
    numberUpdateValue() {
      let setValue = null;
      // emit на каждый ввод символа, нужен для регуляции скрытия сообщения о несуществующем госномере
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.numberAndCodeValue,
      });

      if (isNumberValid(this.numberValue.replace(/ /g, ""))) {
        this.$refs.code.$el.focus();
        if (this.stateNumber && this.stateCode) {
          setValue = this.numberAndCodeValue;
          this.isVisitedNumber = true;
        }
      }
      if ((this.isVisitedNumber && this.isVisitedCode) || setValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: setValue,
        });
      }
    },
    codeUpdateValue(value) {
      let setValue = null;
      // emit на каждый ввод символа , нужен для регуляции скрытия сообщения о несуществующем госномере
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.numberAndCodeValue,
      });
      if (isCodeValid(value)) {
        if (this.stateNumber && this.stateCode) {
          setValue = this.numberAndCodeValue;
          this.isVisitedCode = true;
        }
      }
      if ((this.isVisitedNumber && this.isVisitedCode) || setValue) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: setValue,
        });
      }
    },
    numberFormatter(value) {
      let formatValue = value.toUpperCase();
      if (isNumberValid(value)) {
        formatValue = formatValue.replace(
          /[АВЕКМНОРСТУХABEKMNOPCTYX](?=\d)|\d(?=[АВЕКМНОРСТУХABEKMNOPCTYX])/gi,
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
        if (
          /^[0-9АаВвЕеКкМмНнОоРрСсТтУуХхABEKMNOPCTYXabekmnopctyx]$/iu.test(
            e.key
          ) === false
        ) {
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
    isDisabled() {
      return this.data.disabled || this.data.readonly;
    },
  },
  watch: {
    data: function (newVal, oldVal) {
      if (oldVal.value && !newVal.value) {
        this.numberValue = "";
        this.codeValue = "";
        this.isVisitedNumber = false;
        this.isVisitedCode = false;
      }
    },
  },
};
</script>

<style scoped></style>
