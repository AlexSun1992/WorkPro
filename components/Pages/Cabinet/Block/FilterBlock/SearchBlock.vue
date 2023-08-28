<template>
  <div class="search_input">
    <b-form-input v-model="searchString" placeholder="Поиск по списку" />
    <button @click="clearFilter()"></button>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "../../../../../utils/utils";

export default {
  name: "SearchBlock",

  props: {
    uniqueItems: {
      type: Array,
      required: false,
      default: () => null,
    },
    defaultValue: {
      type: String,
      required: false,
      default: () => null,
    },
    propertyName: {
      type: String | Array[String],
      required: true,
      default: () => null,
    },
    filterType: {
      type: String,
      required: false,
      default: () => "checkbox",
    },

    itemId: {
      required: true,
      default: () => null,
    },

    showButtonAll: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    allItemsButtonName: {
      type: String,
      required: false,
      default: () => "Все",
    },

    showFilteredItemsCount: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },

  data() {
    return {
      selected: "placeholder",
      searchString: "",
    };
  },
  created() {
    const currentFilter = this.$route.query.q;
    if (currentFilter) {
      this.searchString = currentFilter;
    }
  },

  watch: {
    searchString(str) {
      this.$store.commit("blocks/setSearchBlock", changeKeyboardLayout(str));
      this.setQueryURL();
    },
  },
  unmounted() {
    this.clearFilter();
  },

  methods: {
    clearFilter() {
      this.searchString = "";
      this.$store.commit("blocks/setSearchBlock", null);
    },

    setQueryURL() {
      const urlObject = new URL(window.location.href);
      if (this.searchString === "") {
        urlObject.searchParams.delete("q");
      } else {
        urlObject.searchParams.set("q", this.searchString);
      }

      window.history.replaceState(null, null, urlObject);
    },
  },
};
</script>

<style scoped lang="scss"></style>
<style></style>
