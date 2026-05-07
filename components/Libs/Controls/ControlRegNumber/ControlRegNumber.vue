<template>
  <div>
    <form-group :class="{ required: data.required }">
      <b-input-group
        :class="{
          'gos-number': true,
          'is-invalid': isValid === false && isDisabled === false,
          'is-valid': isValid === true && isVisitedNumber === true,
          'is-disabled': data.readonly ? true : false,
        }"
        :disabled="!edit ? !edit : data.readonly"
      >
        <b-form-input
          v-model="numberValue"
          @update="numberUpdateValue"
          :formatter="numberFormatter"
          @keydown="numberKeydown($event)"
          @blur="numberBlur"
          placeholder="А 000 АА"
          autocomplete="off"
          ref="number"
          id="field_regnumb_osago"
        />
        <b-form-input
          v-model="codeValue"
          @update="codeUpdateValue"
          :formatter="codeFormatter"
          @blur="codeBlur"
          placeholder="000"
          autocomplete="off"
          ref="code"
          id="field_region_osago"
        />
      </b-input-group>
      <div
        class="invalid-feedback"
        v-if="isValid === false && isDisabled === false"
      >
        {{ data.error ? data.error : "Пожалуйста, введите корректно госномер" }}
      </div>
      <div
        class="invalid-feedback"
        v-else-if="(!this.isVisitedNumber || !this.isVisitedCode) && isDisabled === false && data.state === false"
      >
        {{ data.error ? data.error : "Пожалуйста, заполните это поле" }}
      </div>
    </form-group>
  </div>
</template>

<script>
import { isValid, isNumberValid } from "./helpers";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

const isCodeValid = (value) => /^\d+$/iu.test(value) && value.length > 1;
export default {
  name: "ControlRegNumber",
  components: { FormGroup },
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
        state: this.isValid,
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
      const withOutSpacesValue = formatValue.replace(/ /g, "");
      if (isValid(withOutSpacesValue) === true) {
        return formatValue.replace(/[АВЕКМНОРСТУХABEHKMNOPCTYX](?=\d)|\d(?=[АВЕКМНОРСТУХABEHKMNOPCTYX])/gi, "$& ");
      }
      if (isValid(withOutSpacesValue) === false) {
        return formatValue.slice(0, -1);
      }
      return formatValue;
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
        if (/^[0-9АаВвЕеКкМмНнОоРрСсТтУуХхABEHKMNOPCTYXabehkmnopctyx]$/iu.test(e.key) === false) {
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
