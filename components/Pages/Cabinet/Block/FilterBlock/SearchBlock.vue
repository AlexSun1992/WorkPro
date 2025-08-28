<template>
  <div class="search_input">
    <b-form-input
      v-model="searchString"
      :placeholder="placeholder"
    />
    <button
      @click="clearFilter()"
      class="search-clear"
    ></button>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "@/utils/utils";

export default {
  name: "SearchBlock",

  props: {
    placeholder: {
      typeof: String,
      default: "Поиск по списку",
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

<style scoped>
.search_input {
  position: relative;
}
.search_input input {
  padding-left: 49px;
  padding-right: 49px;
  background: #fff url(/img/icon-search.svg) 15px 50% no-repeat;
}
.search_input button.search-clear {
  position: absolute;
  top: 50%;
  right: 25px;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  background: #fff url(/img/icon-search-clear.svg) 50% 50% no-repeat;
  border: 0;
}
</style>
