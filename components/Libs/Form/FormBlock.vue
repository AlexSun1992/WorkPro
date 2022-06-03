<template>
  <div>
    <div
      v-for="(tab, index) in captions"
      :key="index"
      class="conf-block"
      :class="{ 'mb-4': index < captions.length - 1 }"
    >
      <div class="row">
        <template v-if="items(index).length">
          <Control
            v-for="(item, i) in items(index)"
            :key="i"
            :params="params"
            :data="item"
            :edit="edit"
            :cols="cols"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Control from "../Controls/Control";

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
    params: {
      type: Object,
      required: false,
    },
  },
  computed: {
    captions() {
      return this.$store.getters["data_card/getCaptions"].filter(
        (_, idx) => this.items(idx).length > 0
      );
    },
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (index === item.page && item.visible === true) {
            return true;
          }
        });
      }
    },
    highlightTab(i) {
      const invalidFields = this.$store.getters["data_card/getForm"].filter(
        (item) => item.state == false
      );
      const invalidField = invalidFields.find((item) => item.page == i);
      if (invalidField) return true;
    },
  },
};
</script>

<style scoped></style>
