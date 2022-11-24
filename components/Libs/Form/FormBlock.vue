<template>
  <div>
    <div
      v-for="(tab, index) in forms"
      :key="index"
      class="conf-block"
      :class="{ 'mb-4': index < forms.length - 1 }"
    >
      <div class="row">
        <template v-if="tab.length">
          <Control
            v-for="(item, i) in tab"
            :key="i"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
            :params="params"
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
    forms() {
      const pages = [...new Set(this.data.map((item) => item.page))];
      return pages
        .map((page) => [
          ...this.data.filter(
            (item) => item.page === page && item.visible === true
          ),
        ])
        .filter((form) => form.length > 0);
    },
  },
  methods: {
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
