<template>
  <ControlDropdownBase
    :isOpen="isOpen"
    :isDisabled="isReadonlyAfterSelect"
    :loading="loading"
    @click-trigger="toggleDropdown"
    @toggle="toggleDropdown"
    @outside="closeDropdown"
  >
    <template #trigger>
      <div
        v-if="!selectedItem.value"
        class="placeholder"
      >
        {{ placeholder }}
      </div>
      <span
        v-else
        class="dw-result"
        >{{ selectedItem.text }}</span
      >
    </template>

    <template #menu>
      <li v-if="filteredList.length > 5 || searchValue">
        <SearchBox
          v-model="searchValue"
          @searchComplete="selectFirstMatch"
          @input="updateSearchValue"
        />
      </li>

      <li
        v-for="item in filteredList"
        :key="item.value"
        :class="{ 'selected-option': item.value === selectedItem.value }"
        @mousedown.prevent.stop="selectItem(item)"
      >
        <span>{{ item.text }}</span>
      </li>

      <li
        v-if="!filteredList.length"
        class="disabled"
      >
        Нет подходящих значений
      </li>
    </template>
  </ControlDropdownBase>
</template>

<script>
import ControlDropdownBase from "../Controls/ControlDropdownBase.vue";
import SearchBox from "../Controls/ControlTokenBox/SearchBox.vue";

export default {
  name: "Multiselect",
  components: { ControlDropdownBase, SearchBox },
  props: {
    list: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    isReadonlyAfterSelect: {
      type: Boolean,
      default: false,
    },
    isAutoSelectSingleRow: {
      type: Object,
      required: false,
    },
    isAutoOpen: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedItem: { value: "", text: "" },
      isOpen: false,
      searchValue: "",
    };
  },
  computed: {
    filteredList() {
      if (!this.searchValue) return this.list;
      return this.list.filter((item) => item.text.toLowerCase().includes(this.searchValue.toLowerCase()));
    },
  },
  watch: {
    selectedItem(val) {
      this.$emit("update", val);
    },
    list(val) {
      // заменяет this.$refs["select"].showMenu = true
      if (val.length > 1 && this.isAutoOpen) {
        this.isOpen = true;
      }
    },
    isAutoSelectSingleRow(val) {
      this.selectedItem = val;
    },
  },
  methods: {
    toggleDropdown(open) {
      if (this.isReadonlyAfterSelect) return;
      this.isOpen = open ?? !this.isOpen;
      if (!this.isOpen) this.searchValue = "";
    },
    closeDropdown() {
      this.isOpen = false;
      this.searchValue = "";
    },
    selectItem(item) {
      this.selectedItem = item;
      this.isOpen = false;
      this.searchValue = "";
    },
    selectFirstMatch() {
      if (this.filteredList.length === 1) {
        this.selectItem(this.filteredList[0]);
      }
    },
    updateSearchValue() {
      this.toggleDropdown(true);
    },
  },
};
</script>

<style scoped>
.dw-result {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 992px) {
  span.dw-result {
    white-space: normal;
    padding: 14px 0 14px 20px;
  }
}
</style>
