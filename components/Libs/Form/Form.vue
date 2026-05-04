<template>
  <b-form-row>
    <b-tabs
      v-if="isTabs"
      content-class="mt-4"
    >
      <b-tab
        v-for="(tab, index) in captions"
        :key="index"
        :title="tab"
        :title-link-class="{ error: highlightTab(index) }"
      >
        <div class="row">
          <Control
            v-for="item in items(index)"
            :key="item.fieldId"
            :params="params"
            :data="item"
            :edit="edit"
            :cols="cols"
            :oneToManyData="oneToManyData"
            @blur="$emit('blur', $event)"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
          />
        </div>
      </b-tab>
    </b-tabs>
    <div
      v-else
      class="row"
    >
      <Control
        v-for="item in items()"
        :key="item.fieldId"
        :params="params"
        :data="item"
        :edit="edit"
        :cols="cols"
        :oneToManyData="oneToManyData"
        @blur="$emit('blur', $event)"
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
      />
    </div>
  </b-form-row>
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
    isTabs: {
      type: Boolean,
      required: false,
      default: () => false,
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
      const invalidFields = this.$store.getters["data_card/getForm"].filter((item) => item.state == false);
      const invalidField = invalidFields.find((item) => item.page == i);
      if (invalidField) return true;
    },
  },
};
</script>
