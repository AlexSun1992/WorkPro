<template>
  <div>
    <Control
      v-for="(item, i) in items()"
      :key="i"
      :params="params"
      :data="item"
      :edit="edit"
      :cols="cols"
      @update="$emit('update', $event)"
      @clear="$emit('clear', $event)"
      @open-card="$emit('open-card', $event)"
    />
  </div>
</template>

<script>
import Control from "../Controls/Control";
export default {
  name: "Form",
  components: { Control },
  props: {
    data: {
      type: Array || null,
      required: true,
    },
    tabs: {
      type: Array,
      required: false,
    },
    params: {
      type: Object,
      required: false,
    },
    isTabs: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1,
    },
    invalidFields: {
      type: Array || null,
      required: false,
    },
  },
  computed: {
    captions: function () {
      return this.$store.getters["data_card/getCaptions"];
    },
    cardId: function () {
      return this.$store.getters["data_card/getCardId"];
    },
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (this.isTabs && this.captions) {
            if (index != item.page) return;
          }
          if (!item.visible) return;
          return this.edit || !this.edit;
        });
      }
    },
    highlightTab(i) {
      let invalidFields = this.$store.getters["data_card/getForm"].filter(
        (item) => item.state == false
      );
      let invalidField = invalidFields.find((item) => item.page == i);
      if (invalidField) return true;
    },
  },
};
</script>

<style scoped></style>
