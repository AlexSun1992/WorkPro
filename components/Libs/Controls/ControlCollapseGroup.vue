<template>
  <div>
    <button
      type="button"
      class="collapsegroup"
      :class="{ active: isFiltersRendered }"
      @click="toggleFilterVisibility"
    >
      Фильтры поиска
    </button>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from "vue";

export default {
  name: "ControlCollapseGroup",
  emits: ["update", "remove"],
  props: {
    data: {
      type: Object,
      required: true,
    },
    groupNumber: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  setup(props, { emit, root }) {
    const instance = getCurrentInstance();
    const { $store } = instance.proxy;

    const isFilterVisible = ref(false);

    const isFiltersRendered = computed(() => $store.getters["data_card/getFiltersVisibleStatus"]);

    function toggleFilterVisibility() {
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: isFiltersRendered.value,
      });

      emit("remove", {
        value: isFilterVisible.value,
        name: props.data.name,
      });

      const filterVisibleStatus = !isFiltersRendered.value;

      $store.commit("data_card/toggleFilterVisible", filterVisibleStatus);
    }

    return {
      isFiltersRendered,
      toggleFilterVisibility,
    };
  },
};
</script>

<style scoped></style>
