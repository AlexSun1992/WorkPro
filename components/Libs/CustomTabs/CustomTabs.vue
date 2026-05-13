<template>
  <div class="tabs-wrapper">
    <div :class="['tabs-btn', tabsbtnclass]">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="setActive(index)"
      >
        {{ tab }}
      </button>
    </div>

    <div
      v-if="isSlotNeeded"
      class="tabs-content"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTabs",

  props: {
    tabs: { type: Array, default: () => [] },
    defaultIndex: { type: Number, default: 0 },
    tabsbtnclass: { type: String, default: "" },
    isSlotNeeded: { type: Boolean, default: true },
  },

  data() {
    return {
      nextIndex: 0,
      activeIndex: this.defaultIndex,
    };
  },

  methods: {
    registerTab() {
      return this.nextIndex++;
    },

    setActive(index) {
      this.activeIndex = index;
      this.$emit("change", index);
    },
  },
};
</script>

<style scoped>
.tabs-btn button {
  color: var(--black);
  text-decoration: none;
  position: relative;
  border: 0;
  background-color: transparent;
  padding: 0;
  line-height: 1rem;
  margin-right: 20px;
}
.tabs-btn button:before,
.tabs-btn button:after {
  content: "";
  width: 0;
  left: 50%;
  bottom: -5px;
  height: 3px;
  position: absolute;
  transition: 0.5s;
}
.tabs-btn button:last-child {
  margin-right: 0;
}
.tabs-btn button.active:after,
.tabs-btn button.active:hover:after,
.tabs-btn button.active:before,
.tabs-btn button.active:hover:before {
  background-color: var(--green);
  width: 50%;
}
.tabs-btn button.active:after,
.tabs-btn button:hover:after {
  left: 0;
}

.tabs-btn button:hover:after,
.tabs-btn button:hover:before {
  background-color: var(--grey_20);
  width: 50%;
}

.my-policy[data-id="1"] .tabs-btn button.active:after,
.my-policy[data-id="1"] .tabs-btn button.active:hover:after,
.my-policy[data-id="1"] .tabs-btn button.active:before,
.my-policy[data-id="1"] .tabs-btn button.active:hover:before,
.my-policy[data-id="8"] .tabs-btn button.active:after,
.my-policy[data-id="8"] .tabs-btn button.active:hover:after,
.my-policy[data-id="8"] .tabs-btn button.active:before,
.my-policy[data-id="8"] .tabs-btn button.active:hover:before,
.my-policy[data-id="10"] .tabs-btn button.active:after,
.my-policy[data-id="10"] .tabs-btn button.active:hover:after,
.my-policy[data-id="10"] .tabs-btn button.active:before,
.my-policy[data-id="10"] .tabs-btn button.active:hover:before,
.my-policy[data-id="1"] .tabs-btn button:hover:after,
.my-policy[data-id="1"] .tabs-btn button:hover:before,
.my-policy[data-id="8"] .tabs-btn button:hover:after,
.my-policy[data-id="8"] .tabs-btn button:hover:before,
.my-policy[data-id="10"] .tabs-btn button:hover:after,
.my-policy[data-id="10"] .tabs-btn button:hover:before {
  background-color: #3b86c8;
}

.my-policy[data-id="2"] .tabs-btn button.active:after,
.my-policy[data-id="2"] .tabs-btn button.active:hover:after,
.my-policy[data-id="2"] .tabs-btn button.active:before,
.my-policy[data-id="2"] .tabs-btn button.active:hover:before,
.my-policy[data-id="3"] .tabs-btn button.active:after,
.my-policy[data-id="3"] .tabs-btn button.active:hover:after,
.my-policy[data-id="3"] .tabs-btn button.active:before,
.my-policy[data-id="3"] .tabs-btn button.active:hover:before,
.my-policy[data-id="5"] .tabs-btn button.active:after,
.my-policy[data-id="5"] .tabs-btn button.active:hover:after,
.my-policy[data-id="5"] .tabs-btn button.active:before,
.my-policy[data-id="5"] .tabs-btn button.active:hover:before,
.my-policy[data-id="2"] .tabs-btn button:hover:after,
.my-policy[data-id="2"] .tabs-btn button:hover:before,
.my-policy[data-id="3"] .tabs-btn button:hover:after,
.my-policy[data-id="3"] .tabs-btn button:hover:before,
.my-policy[data-id="5"] .tabs-btn button:hover:after,
.my-policy[data-id="5"] .tabs-btn button:hover:before {
  background-color: var(--lgreen);
}

.my-policy[data-id="4"] .tabs-btn button.active:after,
.my-policy[data-id="4"] .tabs-btn button.active:hover:after,
.my-policy[data-id="4"] .tabs-btn button.active:before,
.my-policy[data-id="4"] .tabs-btn button.active:hover:before,
.my-policy[data-id="4"] .tabs-btn button:hover:after,
.my-policy[data-id="4"] .tabs-btn button:hover:before {
  background-color: #645da2;
}

.my-policy[data-id="6"] .tabs-btn button.active:after,
.my-policy[data-id="6"] .tabs-btn button.active:hover:after,
.my-policy[data-id="6"] .tabs-btn button.active:before,
.my-policy[data-id="6"] .tabs-btn button.active:hover:before,
.my-policy[data-id="7"] .tabs-btn button.active:after,
.my-policy[data-id="7"] .tabs-btn button.active:hover:after,
.my-policy[data-id="7"] .tabs-btn button.active:before,
.my-policy[data-id="7"] .tabs-btn button.active:hover:before,
.my-policy[data-id="6"] .tabs-btn button:hover:after,
.my-policy[data-id="6"] .tabs-btn button:hover:before,
.my-policy[data-id="7"] .tabs-btn button:hover:after,
.my-policy[data-id="7"] .tabs-btn button:hover:before {
  background-color: #fe8f5c;
}
.title-tabs button {
  font-size: 1.25rem;
}
.title-tabs button.active {
  font-weight: 700;
}
.tabs-btn.title-tabs button:before,
.tabs-btn.title-tabs button:after {
  bottom: -10px;
}

.filter-tabs.tabs-btn button:after,
.filter-tabs.tabs-btn button:before {
  display: none;
}
.filter-tabs.tabs-btn button {
  background-color: var(--lgreen_10);
  padding: 4px 12px;
  line-height: 30px;
  color: var(--black);
  font-size: 1.125rem;
  text-decoration: none;
  display: inline-block;
  border-radius: 100px;
  transition: 0.3s;
}
.filter-tabs.tabs-btn button:hover {
  background-color: var(--auto);
}

.filter-tabs.tabs-btn button.active {
  background-color: var(--green);
  color: var(--white);
}

@media (max-width: 992px) {
  .tabs-btn {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 24px;
    align-items: start;
  }
  .tabs-btn button {
    white-space: nowrap;
  }
  .tabs-btn.title-tabs {
    min-height: 26px;
  }
  .filter-tabs.tabs-btn {
    min-height: 38px;
  }
}
</style>
