<template>
  <div class="row">
    <div class="col-12 col-lg-6 col-xl-4">
      <b-input-group class="gos-number"
                     :class="{
                              'is-invalid': isValid === false && regNumberDisabled === false,
                              'is-valid': isValid,
                              }">
        <RegNumberInput v-model="numberValue"
                        @input="numberUpdateValue"
                        :formatter="numberFormatter"
                        @keydown="numberKeydown($event)"
                        @blur="numberBlur"
                        :disabled="regNumberDisabled"
                        placeholder="А 000 АА"
                        autocomplete="off"
                        ref="number"/>

        <RegNumberInput v-model="codeValue"
                        @input="codeUpdateValue"
                        :formatter="codeFormatter"
                        @blur="codeBlur"
                        :disabled="regNumberDisabled"
                        placeholder="000"
                        autocomplete="off"
                        ref="code"/>
      </b-input-group>

      <b-form-invalid-feedback
        v-if="isValid !== null && regNumberDisabled === false"
        :state="isValid"
      >{{
          "Пожалуйста, введите корректно госномер"
        }}
      </b-form-invalid-feedback>

      <!--      <b-form-invalid-feedback
              v-else-if="
                      (!this.isVisitedNumber || !this.isVisitedCode) && regNumberDisabled === false
                    "
              :state="data.state"
            >{{
                data.error ? data.error : "Пожалуйста, заполните это поле"
              }}
            </b-form-invalid-feedback
            >-->

      <!-- Список Рег номеров -->
      <b-row class="w-100">
        <b-col>

          <b-link
            v-for="(item, index) in customerCarNumbers"
            :key="index"
            class="lgreen text-decoration-none"
            @click="setCarNumber(item.SNAME)"
          >
            <small>{{ index ? ",&nbsp;" : "" }} {{ item.SNAME }}</small>
          </b-link>
        </b-col>
      </b-row>
    </div>

    <div class="col-12 col-lg-6 col-xl-4 pt-3">
      <b-checkbox class="checkbox-hide"
                  v-model="isWithoutCarNumber"
                  @change="goWithoutCarNumber($event)">
        Госномера ещё нет
        <br/>
        <span class="text-success">заполню данные вручную</span>
      </b-checkbox>
    </div>
  </div>
</template>

<script>
import { BCol, BRow } from "bootstrap-vue";
import RegNumberInput from "./RegNumberInput.vue";
import { isCodeValid, isNumberValid, isValid } from "../ControlRegNumber/helpers";

export default {
  name: 'RegNumberAutoByNumber',
  components: { RegNumberInput, BCol, BRow },
  props: {
    clientCars: [],
    value: {
      default: null
    },
    data: {
      default: null
    }
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
    }
  },
  computed: {
    customerCarNumbers() {
      return this.clientCars?.slice(0, 3);
    },
    stateNumber() {
      const number = this.numberValue?.replace(/ /g, "");

      return isNumberValid(number) && number.length === 6;
    },
    stateCode() {
      return isCodeValid(this.codeValue?.replace(/ /g, ""));
    },
    numberAndCodeValue() {
      return this.numberValue?.replace(/ /g, "") + this.codeValue;
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
    valueComputed() {
      return this.value === 'N' ? null : this.value;
    }
  },
  methods: {
    goWithoutCarNumber(val) {
      if (val) {
        this.isNotFound = false;
        this.numberValue = null;
        this.codeValue = null;
        this.selectedCar = null;
        this.regNumberDisabled = true;

        this.updateCardValue('N');

        return;
      }

      this.updateCardValue('');
      this.regNumberDisabled = false;
      this.setInputsVisited(false);
    },
    setCarNumber(item, visited) {
      if (this.regNumberDisabled) {
        return;
      }

      this.numberValue = item === null ? null : this.numberFormatter(item?.slice(0, 6));
      this.codeValue = item === null ? null : this.codeFormatter(item?.slice(6));

      this.setWithoutCarNumber(false);
      this.setInputsVisited(typeof (visited) === 'boolean' ? visited : true);
      this.updateCardValue();
    },
    setWithoutCarNumber(val) {
      this.isWithoutCarNumber = !!val;
    },

    numberUpdateValue() {
      // emit на каждый ввод символа, нужен для регуляции скрытия сообщения о несуществующем госномере
      this.updateCardValue('');

      if (isNumberValid(this.numberValue?.replace(/ /g, ""))) {
        this.$refs.code.$el.focus();

        if (this.stateNumber && this.stateCode) {
          this.isVisitedNumber = true;

          this.updateCardValue();
        }
      }
    },
    codeUpdateValue(value) {
      // emit на каждый ввод символа , нужен для регуляции скрытия сообщения о несуществующем госномере
      this.updateCardValue('');

      if (isCodeValid(value)) {
        if (this.stateNumber && this.stateCode) {
          this.isVisitedCode = true;

          this.updateCardValue();
        }
      }
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
    updateCardValue(value) {
      const val = value !== undefined ? value : this.numberAndCodeValue

      this.$emit("update", val);
    },
    setInputsVisited(val) {
      this.isVisitedNumber = !!val;
      this.state = this.stateNumber && this.stateCode;

      this.isVisitedCode = !!val;
      this.state = this.stateNumber && this.stateCode;
    }
  },
  watch: {
  },
  mounted() {
    this.value === "N" && (this.setWithoutCarNumber(true), this.goWithoutCarNumber(true));
    this.value !== "N" && this.setCarNumber(this.valueComputed, false);
  }
}
</script>

<style lang="scss" scoped>

</style>
