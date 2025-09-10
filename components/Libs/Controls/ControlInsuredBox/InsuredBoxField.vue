<template>
  <div>
    <div class="box-label">
      {{ getOptionLabel }}
      <span
        v-if="tooltip"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span>{{ tooltip }}</span></vue-easy-tooltip
          >
        </span>
      </span>
    </div>
    <div class="box-text">{{ getOptionText }} <span v-if="getOptionText"> &#8381;</span></div>
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
    tooltip: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    getOptionLabel() {
      const [key] = Object.keys(this.policyOption || {});
      return key && key !== "undefined" ? key : null;
    },
    getOptionText() {
      const value = Object.values(this.policyOption)[0];

      return !isNaN(value) ? formattedNumber(Number(value)) : value;
    },
  },
  methods: {},
};
</script>
<style scoped>
.box-label::v-deep .tooltipster {
  width: 16px;
  height: 21px;
}
</style>
