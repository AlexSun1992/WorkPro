<template>
  <ControlCustomComboboxJSON
    :edit="edit"
    :data="data"
    :isMap="true"
    @update="handleUpdate"
  >
  </ControlCustomComboboxJSON>
</template>

<script>
import ControlCustomComboboxJSON from "@/components/Libs/Controls/ControlCustomComboboxJSON/ControlCustomComboboxJSON";

export default {
  name: "ControlSelectObjectFromMap",
  components: {
    ControlCustomComboboxJSON,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleUpdate(selected) {
      this.$emit("update", selected);
    },
  },
};
</script>

<style scoped></style>
