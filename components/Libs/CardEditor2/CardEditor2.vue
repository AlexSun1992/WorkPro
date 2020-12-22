<template>
  <div>
    <FormAccordion :data="data" :edit="true" :store="store" />
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
  computed: {
    form: function () {
      return this.$store.getters[`${this.store}/getForm`];
    },
    captions: function () {
      return this.$store.getters[`${this.store}/getCaptions`];
    },
    cardCaption: function () {
      return this.$store.getters[`${this.store}/getCardCaption`];
    },
  },
};
</script>

<style scoped></style>
