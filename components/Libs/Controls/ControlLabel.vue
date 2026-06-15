<template>
  <form-group
    :label="data.label"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
      >
        &nbsp;
        <span
          v-click-outside="outSide"
          class="tooltipster"
          @click="toggleTooltipVisible(true)"
          @mouseenter="toggleTooltipVisible(true)"
          @mouseleave="toggleTooltipVisible(false)"
        >
          (?)
          <vue-easy-tooltip
            v-model="isTooltipVisible"
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" />
          </vue-easy-tooltip>
        </span>
      </span>
    </template>
    <div v-html="data.value" />
  </form-group>
</template>

<script>
import { ref } from "vue";
import ClickOutside from "vue-click-outside";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlLabel",
  components: { FormGroup },
  directives: {
    ClickOutside,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const isTooltipVisible = ref(false);

    function toggleTooltipVisible(value) {
      isTooltipVisible.value = value;
    }

    function outSide() {
      toggleTooltipVisible(false);
    }

    return {
      isTooltipVisible,
      toggleTooltipVisible,
      outSide,
    };
  },
};
</script>

<style scoped></style>
