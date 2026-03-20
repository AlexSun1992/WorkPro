<template>
  <b-form-group
    :label="data.label"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span
          class="tooltipster"
          v-click-outside="outSide"
          @click="toggleTooltipVisible(true)"
          @mouseenter="toggleTooltipVisible(true)"
          @mouseleave="toggleTooltipVisible(false)"
        >
          (?)<vue-easy-tooltip
            v-model="isTooltipVisible"
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <div v-html="data.value" />
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import ClickOutside from "vue-click-outside";

export default {
  name: "ControlLabel",
  components: { BFormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      isTooltipVisible: false,
    };
  },
  directives: {
    ClickOutside,
  },

  methods: {
    toggleTooltipVisible(value) {
      this.isTooltipVisible = value;
    },

    outSide() {
      this.toggleTooltipVisible(false);
    },
  },
};
</script>

<style scoped></style>
