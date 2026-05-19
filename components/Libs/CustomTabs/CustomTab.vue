<template>
  <div
    v-show="isActive"
    class="tab-panel"
  >
    <div
      v-if="html"
      v-html="html"
    ></div>
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: "CustomTab",

  props: {
    html: { type: String, default: "" },
    active: { type: Boolean, default: false },
  },

  data() {
    return {
      index: null,
      tabsRoot: null,
    };
  },

  computed: {
    isActive() {
      return this.tabsRoot && this.tabsRoot.activeIndex === this.index;
    },
  },

  mounted() {
    let parent = this.$parent;

    while (parent.$options.name !== "CustomTabs") {
      parent = parent.$parent;
    }

    if (!parent) {
      console.warn("[CustomTab] должен быть внутри <CustomTabs>");
      return;
    }

    this.tabsRoot = parent;
    this.index = parent.registerTab();

    this.activateSelf();
  },
  methods: {
    activateSelf() {
      if (this.active) {
        this.tabsRoot.activeIndex = this.index;
      }
    },
  },
};
</script>
