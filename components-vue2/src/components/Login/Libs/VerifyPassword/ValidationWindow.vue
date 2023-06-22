<template>
  <div v-if="featureFlag" class="validation">
    <div class="indicator">
      <div class="indicator_color" :style="{ width: goIndicator }"></div>
    </div>
    <ul>
      <li
        v-for="item in validationList"
        :key="item.errorText"
        :class="{ success: !item.isError }"
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
  props: { passwordValue: String },
  data() {
    return {};
  },
  computed: {
    goIndicator() {
      let indicator = 0;
      this.validationList.forEach((item) => {
        indicator += item.indicator;
      });
      return `${indicator}%`;
    },
    featureFlag() {
      if (process.client) {
        return new URL(
          window.location.href,
          "https://reso.ru"
        ).searchParams.has("LK2-882");
      }
      return null;
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
.validation {
  width: 350px !important;
  padding: 5px;
  border: 1px solid black;
}
.success {
  color: green;
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
