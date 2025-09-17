<template>
  <div>
    <div class="box-label">
      {{ getOptionLabel }}
      <span
        v-if="tooltip"
        class="position-relative"
        >&nbsp;
        <span
          class="tooltipster"
          @click="toggleTooltip()"
          @mouseenter="showTooltip()"
          @mouseleave="hideTooltip()"
        >
          (?)<vue-easy-tooltip
            v-model="isShowTooltip"
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
    tooltipKey: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    isShowTooltip() {
      return (
        this.$store.getters["data_card/getToggleTooltip"]?.find((el) => el.tooltipKey === this.tooltipKey)?.isShow ||
        false
      );
    },
    getOptionLabel() {
      const [key] = Object.keys(this.policyOption || {});
      return key && key !== "undefined" ? key : null;
    },
    getOptionText() {
      const value = Object.values(this.policyOption)[0];

      return !isNaN(value) ? formattedNumber(Number(value)) : value;
    },
  },
  methods: {
    toggleTooltip() {
      this.showTooltip();
    },
    showTooltip() {
      this.$store.commit("data_card/setToggleTooltip", { tooltipKey: this.tooltipKey, isShow: true });
    },
    hideTooltip() {
      this.$store.commit("data_card/setToggleTooltip", { tooltipKey: this.tooltipKey, isShow: false });
    },
  },
};
</script>
<style scoped>
.box-label::v-deep .tooltipster {
  width: 16px;
  height: 21px;
}
</style>
