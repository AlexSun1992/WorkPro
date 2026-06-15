<template>
  <div>
    <button
      ref="buttonCollapse"
      :class="hideComponents ? 'btn-link btn-collapse' : 'btn-link btn-collapse collapsed'"
      @click="toggleComponent"
    >
      <span>{{ hideComponents ? label[0] : label[1] }}</span>
    </button>
  </div>
</template>

<script>
import { ref, computed, nextTick } from "vue";

export default {
  name: "ControlCollapse",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  emits: ["update"],

  setup(props, { emit }) {
    const buttonCollapse = ref(null);
    const hideComponents = ref(true);

    const isDataShouldBeShown = computed(() => Array.isArray(props.data.value) && props.data.value[0] === "Y");

    const label = computed(() => {
      if (props.data.label && props.data.label.split("/").length < 2) {
        return [props.data.label, props.data.label];
      }

      return ["Развернуть", "Свернуть"];
    });

    if (isDataShouldBeShown.value) {
      hideComponents.value = !hideComponents.value;

      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: props.data.value,
      });
    }

    async function toggleComponent() {
      hideComponents.value = !hideComponents.value;

      const copyVal = Array.isArray(props.data.value) ? props.data.value.filter((el) => el !== "Y") : [];

      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: copyVal,
      });

      if (hideComponents.value === true) {
        await nextTick();

        buttonCollapse.value?.scrollIntoView?.({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    return {
      hideComponents,
      label,
      toggleComponent,
    };
  },
};
</script>

<style scoped></style>
