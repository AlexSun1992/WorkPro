<template>
  <div>
    <div class="box-label">
      {{ getOptionLabel }}
    </div>
    <div class="box-text">{{ getOptionText }} &#8381;</div>
  </div>
</template>

<script>
import { formattedNumber } from "./formattedNumber";

export default {
  name: "ControlInsuredBoxField",
  components: {},
  props: {
    policyOption: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    getOptionLabel() {
      const key = Object.keys(this.policyOption)[0];
      return key;
    },
    getOptionText() {
      const value = Object.values(this.policyOption)[0];
      return !isNaN(value) ? formattedNumber(Number(value)) : value;
    },
  },
  methods: {},
};
</script>
<style>
.box-label {
  margin-top: 1rem;
  padding: 0 19px;
  font-size: 0.875rem;
  line-height: 1.125rem;
}
.box-text {
  line-height: 1.25rem;
  font-weight: 700;
  padding: 0 19px;
}
</style>
