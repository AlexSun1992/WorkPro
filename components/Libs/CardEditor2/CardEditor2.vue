<template>
  <div>
    <FormAccordion
      :data="form"
      :captions="captions"
      @update="updateValue($event)"
    />
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
    data: {
      type: Array | null,
      required: true,
      default: () => [],
    },
  },
  mounted() {},
  destroyed() {},
  methods: {
    async updateValue(e) {
      console.log(e);
    },
  },
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
