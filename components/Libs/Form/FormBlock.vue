<template>
  <div>
    <div
      v-for="(tab, index) in captions"
      :key="index"
      class="mb-4 bg-six block-border-one block p-3"
    >
      <div class="row">
        <template v-if="items(index).length">
          <Control
            v-for="(item, i) in items(index)"
            :key="i"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
            :data="item"
            :edit="edit"
            :cols="cols"
          >
          </Control>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Control from "@/components/Libs/Controls/Control";

export default {
  name: "FormBlock",
  components: { Control },
  props: {
    data: {
      type: Array | null,
      required: true,
    },
    tabs: {
      type: Array,
      required: false,
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
      type: Array | null,
      required: false,
    },
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (this.captions) {
            if (index != item.page) return null;
          }
          if (!item.visible) return null;
          return this.edit || (!this.edit && item.value);
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
  computed: {
    captions: function () {
      return this.$store.getters["data_card/getCaptions"];
    },
  },
};
</script>

<style scoped></style>
