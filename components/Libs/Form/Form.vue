<template>
  <div class="row">
    <Control
      v-for="item in items"
      :key="item.fieldId"
      :params="params"
      :data="item"
      :edit="edit"
      :cols="cols"
      :one-to-many-data="oneToManyData"
      @blur="$emit('blur', $event)"
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
      default: () => [],
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: true,
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1,
    },
    invalidFields: {
      type: Array,
      default: () => [],
    },
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    captions() {
      return this.$store.getters["data_card/getCaptions"];
    },
    cardId() {
      return this.$store.getters["data_card/getCardId"];
    },
    items() {
      if (this.data) {
        return this.data.filter((item) => {
          if (!item.visible) return;
          return this.edit || !this.edit;
        });
      }
      return [];
    },
  },
};
</script>
