<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div>
    <template>
      <Control
        v-if="getFilters"
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
        @remove="removeElement($event)"
        :params="params"
        :data="getFilters"
      >
      </Control>
    </template>
    <div
      v-for="(tab, index) in forms"
      :key="'block' + index"
      :class="{
        'mb-4': index < forms.length - 1,
        'd-block': isFiltersRendered && indexBlockShouldBeHide == index && forms.length > 1,
        'conf-block-zero': tab.length === 1 && [tab].type === 'Informer',
        'conf-block': tab.length > 1,
      }"
    >
      <div class="row">
        <template v-if="tab.length">
          <Control
            v-for="item in tab"
            :key="item.fieldId"
            v-if="!item.name.includes('COLLAPSE_GROUP')"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
            :params="params"
            :data="item"
            @goNext="$emit('goNext', $event)"
            @goBack="$emit('goBack', $event)"
            @saveCard="$emit('saveCard', $event)"
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
    currentTab: {
      required: false,
    },
    tabsWizard: {
      required: false,
    },
    qty: {
      required: false,
    },
    loading: {
      required: false,
    },
    data: {
      type: [Array, null],
      required: true,
    },
    tabs: {
      default: () => 1,
    },
    invalidFields: {
      type: [Array, null],
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
    isFiltersRendered() {
      const isFiltersVisible = this.$store.getters["data_card/getFiltersVisibleStatus"];
      return isFiltersVisible;
    },
    forms() {
      const pages = [...new Set(this.data.map((item) => item.page))];
      return pages
        .map((page) => [
          ...this.data.filter(
            (item) =>
              item.page === page && item.visible === true && !(item.page === 100 && item.type === "WizardButton")
          ),
        ])
        .filter((form) => form.length > 0);
    },
    isFilterInvisible() {
      return this.isFiltersInvisible;
    },
    getFilters() {
      const getIndex = this.forms.find((item) => item.find((elem) => elem.name === "COLLAPSE_GROUP"));

      const getFilter = getIndex?.find((item) => item.name.includes("COLLAPSE_GROUP"));
      return getFilter;
    },
  },

  methods: {
    removeElement(e) {
      this.isFiltersInvisible = e.value;

      const getIndex = this.forms.find((item) => item.find((elem) => elem.name === "COLLAPSE_GROUP"));
      const blockShouldBeHide = this.forms.indexOf(getIndex);

      this.indexBlockShouldBeHide = blockShouldBeHide;
    },
    highlightTab(i) {
      const invalidFields = this.$store.getters["data_card/getForm"].filter((item) => item.state == false);
      const invalidField = invalidFields.find((item) => item.page == i);
      if (invalidField) return true;
    },
  },
  beforeDestroy() {
    this.$store.commit("data_card/setFilterActive", null);
    this.$store.commit("data_card/setPreviousFormFieldValue", null);
  },
};
</script>

<style scoped></style>
