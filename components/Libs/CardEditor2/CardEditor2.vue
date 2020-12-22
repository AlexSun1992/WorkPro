<template>
  <div>
    <FormAccordion :data="form" :captions="captions" />
  </div>
</template>

<script>
import FormAccordion from "@/components/Libs/Form/FormAccordion2";
export default {
  name: "CardEditor2",
  components: { FormAccordion },
  props: {
    store: {
      type: String,
      required: false,
      default: () => {},
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
