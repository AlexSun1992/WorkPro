<template>
  <div v-if="featureFlag" class="validation">
    <div class="indicator">
      <div class="indicator_color" :style="{ width: goIndicator }"></div>
    </div>
    <ul>
      <li
        v-for="item in validationList"
        :key="item.errorText"
        :class="[
          passwordValue.length === 0 && v.$anyDirty === false
            ? 'defaulte'
            : item.isError
            ? 'error'
            : 'success',
        ]"
      >
        {{ item.errorText }}
      </li>
    </ul>
  </div>
</template>
<script>
import { passwordValidationWindow } from "../../RegForm/regform.helper";
export default {
  name: "ValidationWindow",
  props: { passwordValue: String, v: Object },
  computed: {
    goIndicator() {
      let indicator = 0;
      this.validationList.forEach((item) => {
        indicator += item.indicator;
      });
      return `${indicator}%`;
    },
    featureFlag() {
      return new URL(window.location.href, "https://reso.ru").searchParams.has(
        "LK2-882"
      );
    },
    validationList() {
      return Object.entries(passwordValidationWindow(this.passwordValue)).map(
        ([, item]) => item
      );
    },
  },
};
</script>
<style scoped>
.defaulte {
  color: orange;
}
.validation {
  position: absolute;
  bottom: 55%;
  left: 0;
  width: 350px !important;
  padding: 5px;
  border: 1px solid black;
  background-color: white;
}
.success {
  color: green;
}
.error {
  color: red;
}
.indicator {
  width: 300px;
  justify-content: center;
  border: 1px solid black;
}
.indicator_color {
  width: 0%;
  height: 4px;
  background-color: blueviolet;
}
</style>
