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
          placeholder="А000АА"
          autocomplete="off"
          ref="number"
        />
        <b-form-input
          v-model="codeValue"
          @update="codeUpdateValue"
          :formatter="codeFormatter"
          @blur="codeBlur"
          placeholder="000"
          autocomplete="off"
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
import { isValid, isCodeValid } from "./helpers";
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

  mounted() {
    this.$refs.number.$refs.input.onpaste = (e) => e.preventDefault();
    this.$refs.code.$refs.input.onpaste = (e) => e.preventDefault();
  },

  methods: {
    numberUpdateValue() {
      let setValue = null;
      // emit на каждый ввод символа, нужен для регуляции скрытия сообщения о несуществующем госномере
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.numberAndCodeValue,
        state: this.isValid,
      });

      if (this.numberValue.length === 6) {
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
          state: this.isValid,
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
        state: this.isValid,
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
          state: this.isValid,
        });
      }
    },
    numberFormatter(value) {
      const formatValue = value.toUpperCase();
      if (isValid(value)) {
        return formatValue;
      }
      return formatValue.slice(0, -1);
    },
    codeFormatter(value) {
      if (/^\d+$/iu.test(value)) {
        if (value.length > 3) {
          return value.substring(0, 3);
        }
        return value;
      }
      return value.substring(0, value.length - 1);
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
      this.state = this.stateNumber && this.stateCode;
    },
    codeBlur() {
      this.isVisitedCode = true;
      this.state = this.stateNumber && this.stateCode;
    },
  },
  computed: {
    stateNumber() {
      return isValid(this.numberValue);
    },
    stateCode() {
      return isCodeValid(this.codeValue);
    },
    numberAndCodeValue() {
      return this.numberValue.replace(/ /g, "") + this.codeValue;
    },
    isValid() {
      if (this.isVisitedNumber === true && this.isVisitedCode === true) {
        return this.numberValue.length === 6 && this.stateCode;
      }
      return null;
    },
    isDisabled() {
      return this.data.disabled || this.data.readonly;
    },
  },
  watch: {
    data(newVal, oldVal) {
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
