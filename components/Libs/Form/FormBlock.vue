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
        :params="settings"
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
            :params="settings"
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
    formId: {
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
      const isWizard = (it) => it.type === "WizardButton";

      const baseItems = this.data.filter((it) => it.visible === true && !(it.page === 100 && isWizard(it)));
      if (!baseItems.length) return [];

      const byPage = new Map();
      for (const it of baseItems) {
        if (!byPage.has(it.page)) byPage.set(it.page, []);
        byPage.get(it.page).push(it);
      }

      const pages = Array.from(byPage.keys()).sort((a, b) => a - b);

      const pagesWithNonWizard = pages.filter((p) => byPage.get(p).some((it) => !isWizard(it)));
      const lastNonWizardPage = pagesWithNonWizard.length
        ? pagesWithNonWizard[pagesWithNonWizard.length - 1]
        : undefined;

      if (lastNonWizardPage !== undefined) {
        while (pages.length) {
          const lastPage = pages[pages.length - 1];
          if (lastPage === lastNonWizardPage) break;

          const lastItems = byPage.get(lastPage) || [];
          const onlyWizard = lastItems.length > 0 && lastItems.every(isWizard);
          if (!onlyWizard) break;

          const moved = lastItems.map((btn) => ({ ...btn, page: lastNonWizardPage }));
          byPage.set(lastNonWizardPage, [...byPage.get(lastNonWizardPage), ...moved]);

          byPage.delete(lastPage);
          pages.pop();
        }
      }

      return pages.map((p) => byPage.get(p)).filter((arr) => Array.isArray(arr) && arr.length > 0);
    },
    isFilterInvisible() {
      return this.isFiltersInvisible;
    },
    getFilters() {
      const getIndex = this.forms.find((item) => item.find((elem) => elem.name === "COLLAPSE_GROUP"));

      const getFilter = getIndex?.find((item) => item.name.includes("COLLAPSE_GROUP"));
      return getFilter;
    },
    settings() {
      const params = this.formId || !this.$route ? { ...this.params } : { ...this.params, ...this.$route.params };

      return {
        ...params,
        ns: this.formId ? `data_card/forms/${this.formId}` : "data_card",
      };
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
