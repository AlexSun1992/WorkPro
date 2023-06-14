<template>
  <div class="validation">
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
