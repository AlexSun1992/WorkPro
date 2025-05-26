<template>
  <div>
    <div v-for="(tab, index) in captions" :key="index" class="mb-1">
      <div
        style="border-color: #1eb869"
        class="block-border-one block p-1 mb-1 header"
      >
        <button
          type="button"
          class="btn btn-primary"
          v-bind:class="{ error: highlightTab(index) }"
          v-b-toggle="'acc_' + index"
        >
          {{ tab }}
        </button>
      </div>
      <b-collapse
        :visible="index == 0"
        accordion="my-accordion"
        :id="'acc_' + index"
        class="bg-six1 block-border-one block p-3"
        role="tabpanel"
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
      </b-collapse>
    </div>
  </div>
</template>
<script>
import Control from "~/components/Libs/Controls/Control";

export default {
  name: "FormAccordion",
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
  computed: {
    captions() {
      return this.$store.getters["data_card/getCaptions"];
    },
    cardId() {
      return this.$store.getters["data_card/getCardId"];
    },
    driverTab() {
      return this.tabs[0];
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #18a25b;
  cursor: pointer;
  text-align: center;
}
.error {
  background-color: #f5c6cb;
  cursor: pointer;
  text-align: center;
}
.btn {
  border: 0;
  cursor: pointer;
  padding: 0;
  width: 99%;
  background-color: #cbe0d7;
}
</style>
