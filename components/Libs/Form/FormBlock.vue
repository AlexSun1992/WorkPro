<template>
  <div>
    <template>
      <Control
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
        @remove="removeElement($event)"
        :params="params"
        :data="getFilters"
        :edit="edit"
        :cols="cols"
        :class="CollapseGroup"
      >
      </Control>
    </template>

    <div
      v-for="(tab, index) in forms"
      :key="index"
      class="conf-block"
      :class="{
        'mb-4': index < forms.length - 1,
        'd-none':
          isFilterInvisible &&
          indexBlockShouldBeHide == index &&
          forms.length > 1,
      }"
    >
      <div class="row">
        <template v-if="tab.length">
          <Control
            v-for="(item, i) in tab"
            :key="i"
            v-if="!item.name.includes('COLLAPSE_GROUP')"
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

  data() {
    return {
      indexBlockShouldBeHide: null,
      isFiltersInvisible: false,
    };
  },

  computed: {
    forms() {
      const pages = [...new Set(this.data.map((item) => item.page))];
      return pages
        .map((page) => [
          ...this.data.filter(
            (item) =>
              item.page === page &&
              item.visible === true &&
              item.type !== "WizardButton"
          ),
        ])
        .filter((form) => form.length > 0);
    },
    isFilterInvisible() {
      return this.isFiltersInvisible;
    },
    getFilters() {
      const getIndex = this.forms.find((item) =>
        item.find((elem) => elem.name === "COLLAPSE_GROUP")
      );

      const getFilter = getIndex?.find((item) =>
        item.name.includes("COLLAPSE_GROUP")
      );
      return getFilter;
    },
  },
  methods: {
    removeElement(e) {
      this.isFiltersInvisible = e.value;

      const getIndex = this.forms.find((item) =>
        item.find((elem) => elem.name === "COLLAPSE_GROUP")
      );
      const blockShouldBeHide = this.forms.indexOf(getIndex);

      this.indexBlockShouldBeHide = blockShouldBeHide;
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
