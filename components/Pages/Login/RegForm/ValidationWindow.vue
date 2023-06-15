<template>
  <div v-if="toggleValidationWindow" class="validation">
    <div class="indicator">
      <div class="indicator_color" :style="{ width: goIndicator }"></div>
    </div>
    <ul>
      <li
        v-for="item in validationList"
        :key="item.id"
        :class="{ success: !item.isError }"
      >
        {{ item.errorText }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ValidationWindow",
  props: { validationList: Array },
  data() {
    return {
      indicator: 0,
      isValidationWindow: false,
    };
  },
  computed: {
    goIndicator() {
      let indicator = 0;
      this.validationList.forEach((item) => {
        indicator += item.indicator;
      });
      return `${indicator}%`;
    },
    toggleValidationWindow() {
      if (/_ym_debug=1/.test(window.location.href)) {
        return true;
      }
      return false;
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
