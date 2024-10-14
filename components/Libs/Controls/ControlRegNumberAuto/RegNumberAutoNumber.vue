<template>
  <div class="row">
    <div class="col-12 col-lg-6 col-xl-4">
      <b-input-group
        class="gos-number"
        :class="{
              'is-invalid': fullCarNumber !== null && !isFullNumberValid,
              'is-valid': isFullNumberValid,
            }"
      >
        <RegNumberInput
          v-model="carNumber"
          @input="numberUpdateValue"
          :formatter="numberFormatter"
          :disabled="regNumberDisabled"
          placeholder="А 000 АА"/>

        <RegNumberInput
          v-model="carRegion"
          :formatter="codeFormatter"
          :disabled="regNumberDisabled"
          @input="regionUpdateValue"
          ref="code"
          placeholder="000"/>
      </b-input-group>

      <b-form-invalid-feedback
        :state="fullCarNumber === null ? null : isFullNumberValid"
      >
        {{ "Пожалуйста, введите корректно госномер" }}
      </b-form-invalid-feedback>

      <!-- Список Рег номеров -->
      <b-row class="w-100">
        <b-col>
          <b-form-invalid-feedback
            v-if="isNotFound !== null"
            :state="!isNotFound">
            Госномер не найден, укажите данные ТС самостоятельно
          </b-form-invalid-feedback>

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
import helpers from "./helpers";

export default {
  name: 'RegNumberAutoByNumber',
  components: { RegNumberInput, BCol, BRow },
  props: {
    clientCars: [],
    value: {
      default: null
    },
    numberDisabled: {
      default: false
    }
  },
  data() {
    return {
      carNumber: null,
      carRegion: null,
      isWithoutCarNumber: this.value === 'N',
      isNotFound: false,
      regNumberDisabled: this.value === 'N',
    }
  },
  computed: {
    customerCarNumbers() {
      return this.clientCars?.slice(0, 3);
    },
    trimCarNumber() {
      return this.carNumber?.replaceAll(" ", "") ?? this.carNumber;
    },
    fullCarNumber() {
      return this.carNumber === null && this.carRegion === null
        ? null
        : `${ this.trimCarNumber ?? "" }${ this.carRegion ?? "" }`;
    },
    isFullNumberValid() {
      return helpers.isVehicleNumber(this.trimCarNumber, this.carRegion);
    },
    valueComputed() {
      if (this.value) {
        return this.value === 'N' ? null : this.value;
      }

      return null;
    }
  },
  methods: {
    numberFormatter(val) {
      return helpers.numberFormatter(val);
    },
    codeFormatter(val) {
      return helpers.codeFormatter(val);
    },
    regionUpdateValue() {
    },
    numberUpdateValue() {
      this.isNextButtonDisabled = false;
      this.isNotFound = false;

      helpers.isNumberValid(this.trimCarNumber) && this.$refs.code.$el.focus();
    },
    goWithoutCarNumber(val) {
      if (val) {
        this.isNotFound = false;
        this.carNumber = null;
        this.carRegion = null;
        this.selectedCar = null;
        this.regNumberDisabled = true;

        return;
      }

      this.regNumberDisabled = false;
    },
    setCarNumber(item) {
      if (this.regNumberDisabled) {
        return;
      }

      this.carNumber = item === null ? null : this.numberFormatter(item?.slice(0, 6));
      this.carRegion = item === null ? null : this.codeFormatter(item?.slice(6));

      this.setWithoutCarNumber(false);
    },
    setWithoutCarNumber(val) {
      this.isWithoutCarNumber = !!val;
    },
  },
  watch: {
    fullCarNumber(data) {
      let val = null;

      if (this.isFullNumberValid) {
        val = data;
      }

      if (!this.isFullNumberValid && !data) {
        val = '';
      }

      this.$emit('update', val);
    }
  },
  mounted() {
    this.setCarNumber(this.valueComputed);
  }
}
</script>

<style lang="scss" scoped>

</style>
