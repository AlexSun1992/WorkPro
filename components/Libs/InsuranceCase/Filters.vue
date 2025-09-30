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
  name: "Filters",
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
  display: inline-block;
  color: #686868;
  font-size: 0.75rem;
  padding: 0px 25px;
  border-radius: 6px;
  font-weight: 600;
  line-height: 32px;
  margin: 0;
  cursor: pointer;
  border: 0;
}
.filter_btn.active {
  background-color: #fff;
  color: #009639;
}
@media (max-width: 992px) {
  .filter_btn {
    padding: 0px 12px;
  }
}
</style>
