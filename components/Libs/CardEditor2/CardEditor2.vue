<template>
  <div>
    <FormAccordion :data="data" :edit="false" :store="store" />
  </div>
</template>

<script>
import FormAccordion from "@/components/Libs/Form/FormAccordion";
export default {
  name: "CardEditor2",
  components: { FormAccordion },
  props: {
    store: {
      type: String,
      required: false,
      default: () => {},
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>

<style scoped></style>
