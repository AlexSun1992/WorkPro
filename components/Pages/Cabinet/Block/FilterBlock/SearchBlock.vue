<template>
  <div>
    <div>
      <button @click="clearFilter()">X</button>
    </div>
    <div class="search">
      <b-form-input v-model="searchString" placeholder="Поиск по списку" />
    </div>
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

<style scoped lang="scss">
.filterblock > .button:hover,
.filterblock > button:hover,
.filterblock > .button,
.filterblock > button {
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 100px;
  position: relative;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
  color: #43b02a;
  border: 0;
  padding: 0px 12px;
  margin-right: 8px;
  text-decoration: none;
  line-height: 36px;
  height: 38px;
  &:disabled {
    background: #a4a4a4;
    color: #dfe3e5;
    &:after {
      display: none;
    }
  }
  &[data-activeitems]:after {
    content: attr(data-activeitems);
    min-width: 25px;
    text-align: center;
    height: 23px;
    border-radius: 23px;
    background: #edf8ea;
    color: #43b02a;
    display: initial;
    padding: 4px 8px;
    font-weight: 700;
    font-size: 14px;
    margin-left: 5px;
  }
  &.filter-checked {
    background: #009639;
    color: #fff;
    &:after {
      color: #292929;
    }
  }
  &.y-btn {
    background-color: #f7b801;
    color: #292929;
  }
}
@media (max-width: 992px) {
  .filter-mob-flex .filterblock {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .filter-mob-flex .filterblock > button {
    white-space: nowrap;
    width: auto;
    overflow: visible;
  }
}
</style>
<style>
.cabinet .btn.btn-secondary .btn-filter-checked {
  background-color: #009639;
  color: white;
}

.search {
  width: 20vw;
}
</style>
