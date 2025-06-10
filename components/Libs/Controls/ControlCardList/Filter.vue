<template>
  <button
    :class="['filter_btn', active && 'active']"
    type="button"
    @click="$emit('click', label)"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "ControlFilterButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.filter_btn {
  background-color: #fff;
  border-radius: 28px;
  border: 1px solid #43b02a;
  padding: 4px 12px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 20px;
  letter-spacing: 0%;
  color: #434343;
  display: inline-block;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
}
.filter_btn.active {
  background-color: #43b02a;
  color: #fff;
}
</style>
