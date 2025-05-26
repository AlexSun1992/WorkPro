<template>
  <div>
    <h2>{{ name }}</h2>

    <div class="wzd mt-3 mb-4">
      <div style="background-color: #d9efd4; height: 8px; width: 100%; border-radius: 4px">
        <div
          style="background-color: #43b02a; border-radius: 4px; height: 8px"
          :style="{ width: progressPosition }"
        />
      </div>
      <div class="row">
        <div class="col-6">
          <div style="font-size: 0.875rem; color: #868686">Текущий этап</div>
        </div>
        <div class="col-6">
          <div
            v-if="nextStep.name"
            class="text-end"
            style="font-size: 0.875rem; color: #868686"
          >
            <template v-if="nextStep.order > -1">Следующий этап</template>
          </div>
        </div>
        <div class="col-6">
          <ControlDropdown
            v-if="availableTabs.length > 1"
            :options="availableTabs"
            value-key="NITEM"
            :placeholder="name"
            @input="goToTab($event)"
            :value="currentCardId"
            text-key="SNAME"
          />

          <span v-else>
            {{ name }}
          </span>
        </div>
        <div class="col-6">
          <div
            class="text-end"
            style=""
          >
            <div class="next-step-button">
              {{ nextStep.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tabs.length > 1">
      <div
        class="d-none row mt-4 step-block osago"
        style="max-width: 100%; overflow-x: auto; flex-wrap: nowrap; overflow-y: hidden"
      >
        <div
          v-for="(item, index) in tabs"
          :key="index"
        >
          <div
            class="col-1 text-center position-relative"
            :class="{ active: item.NORDER <= currentTab.NORDER }"
          >
            <div
              class="step"
              :data-step="item.NORDER"
            />
            <span class="step-text">{{ item.name }}</span>
          </div>
          <div
            v-if="tabs.length !== index + 1"
            class="col-auto"
            :class="{ active: item.NORDER < currentTab.NORDER }"
          >
            <div class="dotted"></div>
          </div>
        </div>
      </div>

      <div class="d-none">
        <h3>
          {{ currentTabName }} - шаг {{ currentTabOrder }} из
          {{ tabs.length }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import ControlDropdown from "../../../../../components/Libs/Controls/ControlDropdown/ControlDropdown";

export default {
  name: "ProgressBar",
  components: { ControlDropdown },
  props: {
    wizardRels: {
      type: Array,
      required: true,
    },
    wizardCursor: {
      type: Array,
      default: () => [],
    },
    wizardIDCARDS: {
      type: Array,
      default: null,
    },
    wizardNavigation: {
      type: Object,
      required: false,
      default() {},
    },
  },
  computed: {
    currentCardId() {
      return this.wizardNavigation?.current.IDCARD ?? -1;
    },
    tabs() {
      if (this.wizardIDCARDS?.length) {
        return this.wizardCursor.filter((item) => this.wizardIDCARDS.includes(item.NITEM));
      }

      return this.wizardCursor;
    },
    currentTab() {
      return this.wizardNavigation?.current ?? {};
    },
    currentId() {
      return this.currentTab?.IDCARD ?? -1;
    },
    currentStep() {
      return this.tabs.find((item) => item.NITEM === this.currentId);
    },
    name() {
      return this.currentStep?.SNAME ?? "";
    },
    nextStep() {
      const { nextTab } = this;
      const result = { name: "", url: "", order: -1 };

      if (nextTab) {
        result.name = nextTab?.SNAME ?? "";
        result.url = "";
        result.order = nextTab?.NORDER ?? -1;
      }

      return result;
    },
    maxOrder() {
      const orders = this.tabs.map((item) => item.NORDER);

      return Math.max(...orders);
    },
    nextTab() {
      if (this.currentTab && this.currentTabOrder < this.maxOrder) {
        return this.tabs?.filter((item) => item.NORDER > this.currentTabOrder).sort((a, b) => a - b)[0];
      }

      return null;
    },
    /**
     * @description Положение прогресс бара расчитывается не от значения order а от индекса в упорядоченном массиве текущего шага!
     * @return {string}
     */
    progressPosition() {
      const totalTabs = this.tabs?.length ?? 0;
      const currentOrderIndex = [...this.tabs]
        .sort((tabA, tabB) => tabA.NORDER - tabB.NORDER)
        .findIndex((item) => item.NORDER === this.currentTabOrder);

      if (totalTabs - 1 === currentOrderIndex) {
        return "100%";
      }

      if (totalTabs === 1) {
        return "100%";
      }

      if (totalTabs > 0 && this.currentTabOrderPosition > 0) {
        return `${(100 / totalTabs) * currentOrderIndex}%`;
      }

      return "0%";
    },
    currentTabOrderPosition() {
      const sortedTabs = [...this.tabs].sort((a, b) => a.NORDER - b.NORDER);

      return sortedTabs.findIndex((item) => item.NORDER === this.currentTabOrder) + 1;
    },
    currentTabOrder() {
      return this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)?.NORDER ?? 0;
    },
    currentTabName() {
      return this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)?.SNAME ?? "";
    },
    availableTabs() {
      const { tabs } = this;
      const { currentTabOrder } = this;
      const dropDownTabs = tabs.filter((item) => item.NORDER <= currentTabOrder);

      return dropDownTabs.map((item) => ({
        invisible: item.NORDER === currentTabOrder,
        ...item,
      }));
    },
  },

  methods: {
    goToTab(ev) {
      this.$emit("update", ev);
    },
  },
};
</script>

<style scoped>
.next-step-button {
  text-decoration: none;
  color: inherit;
}
</style>
