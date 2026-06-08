<template>
  <div class="box-options">
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
  name: "InsuredBoxField",
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
.box-options .box-label {
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.5rem;
  margin-top: 0;
  padding: 0;
}
.box-options .box-text {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.125rem;
  padding: 0;
}

.box-label::v-deep .tooltipster {
  height: 16px;
  width: 16px;
  top: 2px;
  filter: brightness(3);
}
.box-label::v-deep .tooltipster:hover {
  filter: brightness(1);
}

.box-options + .box-options {
  margin-top: 8px;
}
</style>
