x``
<template>
  <div class="tab-group">
    <Tab
      v-for="{ id, label } in tabs"
      :id="id"
      :key="id"
      :label="label"
      :active-tab="effectiveActiveTab"
      @tab-change="selectTab"
    />
  </div>
</template>

<script>
import Tab from "./Tab";

export default {
  name: "TabGroup",
  components: { Tab },
  props: {
    activeTab: {
      type: String,
      default: "",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    internalActiveTab() {
      return this.tabs.length ? this.tabs[0] : "";
    },

    effectiveActiveTab() {
      return this.activeTab || this.internalActiveTab;
    },
  },
  methods: {
    selectTab(newId) {
      const oldTab = this.effectiveActiveTab;
      if (newId === oldTab) {
        return;
      }

      if (this.activeTab === undefined) {
        this.internalActiveTab = newId;
      }

      this.$emit("change", newId);
    },
  },
};
</script>

<style scoped>
.tab-group {
  background-color: #f2f4f5;
  border-radius: 8px;
  display: inline-block;
  padding: 2px;
  width: fit-content;
  height: 36px;
}
.tab-group > * {
  display: table-cell;
}
</style>
