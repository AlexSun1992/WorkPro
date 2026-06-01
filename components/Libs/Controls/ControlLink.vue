<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary link-button"
      @click="clickLink"
    >
      {{ data.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlLink",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  emits: ["open-card"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $store, $route } = instance.proxy;

    function clickLink() {
      $store.commit("data_card/setListPath", $route.value.fullPath);
      emit("open-card", props.data);
    }

    return { clickLink };
  },
};
</script>

<style scoped></style>
