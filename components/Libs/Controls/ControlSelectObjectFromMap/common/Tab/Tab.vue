<template>
  <div :class="`tab-${id}`">
    <button
      :class="activeClass"
      @click="handleClick"
    >
      {{ label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Tab",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    activeTab: {
      type: String,
      required: true,
    },
  },
  computed: {
    activeClass() {
      return this.id === this.activeTab ? "active" : "";
    },
  },
  methods: {
    handleClick() {
      this.$emit("tab-change", this.id);
    },
  },
};
</script>

<style scoped>
button {
  border: 0;
  border-radius: 6px;
  color: #686868;
  cursor: pointer;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 32px;
  margin: 0;
  padding: 0 25px;
}
.active {
  background-color: #fff;
  color: #009639;
}
</style>
