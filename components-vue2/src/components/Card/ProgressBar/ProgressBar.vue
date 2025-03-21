<template>
  <div>
    <h2>{{ name }}</h2>

    <div class="wzd mt-3 mb-4">
      <div
        style="
          background-color: #d9efd4;
          height: 8px;
          width: 100%;
          border-radius: 4px;
        "
      >
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
          <div class="text-end" style="font-size: 0.875rem; color: #868686">
            Следующий этап
          </div>
        </div>
        <div class="col-6">
          <ControlDropdown
            v-if="availableTabs.length > 1"
            :options="availableTabs"
            value-key="NITEM"
            :placeholder="name"
            @input="goToTab($event)"
            v-model="value"
            text-key="SNAME"
          />

          <span v-else>
            {{ name }}
          </span>
        </div>
        <div class="col-6">
          <div class="text-end" style="">
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
        style="
          max-width: 100%;
          overflow-x: auto;
          flex-wrap: nowrap;
          overflow-y: hidden;
        "
      >
        <div v-for="(item, index) in tabs" :key="index">
          <div
            class="col-1 text-center position-relative"
            :class="{ active: item.NORDER <= currentTab.NORDER }"
          >
            <div class="step" :data-step="item.NORDER" />
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
import ControlDropdown from "../../../../../components/Libs/Controls/ControlDropdown/ControlDropdown.vue";

export default {
  name: "ProgressBar",
  components: { ControlDropdown },
  props: {
    wizardRels: {
      type: Array,
      required: true,
    },
    wizardCursor: {
      type: [Array, undefined],
      required: true,
      default() {
        return [];
      },
    },
    wizardIDCARDS: {
      type: Array,
      required: false,
      default: null,
    },
    wizardNavigation: {
      type: Object,
      required: false,
      default() {},
    },
  },
  data() {
    return {
      value: 4526,
    };
  },
  computed: {
    tabs() {
      if (this.wizardIDCARDS?.length) {
        return this.wizardCursor.filter(item => this.wizardIDCARDS.includes(item.NITEM));
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
      const { currentTab } = this;
      const { nextTab } = this;
      const result = { name: "", url: "", order: nextTab?.NORDER ?? -1 };

      if (nextTab) {
        result.name = nextTab?.SNAME ?? "";
        result.url = "";
      }

      if (currentTab && this.currentTabOrder === this.maxOrder) {
        return currentTab;
      }

      return result;
    },
    maxOrder() {
      const orders = this.tabs.map((item) => item.NORDER);

      return Math.max(...orders);
    },
    nextTab() {
      if (this.currentTab && this.currentTabOrder < this.maxOrder) {
        const temp = this.tabs?.filter(
          (item) => item.NORDER > this.currentTabOrder
        )
          const temp2 = temp?.sort((a, b) => a - b)[0];

        return temp2;
      }

      return null;
    },
    progressPosition() {
      const totalTabs = this.tabs?.length ?? 0;
      const currentOrder = this.currentTabOrder ?? 0;

      if (totalTabs && currentOrder) {
        return `${(100 / totalTabs) * (currentOrder - 1)}%`;
      }

      return "0%";
    },
    currentTabOrder() {
      return (
        this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)
          ?.NORDER ?? 0
      );
    },
    currentTabName() {
      return (
        this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)
          ?.SNAME ?? ""
      );
    },
    availableTabs() {
      const { tabs } = this;
      const { currentTabOrder } = this;
      const dropDownTabs = tabs.filter(
        (item) => item.NORDER <= currentTabOrder
      );

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
