<template>
  <div>
    <b-form-group :label="data.label">
      <multi-select
        :options="options"
        :isDisabled="!edit ? !edit : data.readonly"
        :isError="data.state === false"
        :selected-options="data.value"
        @select="onSelect"
        placeholder="Выберите из списка"
      >
      </multi-select>
      <span class="error" v-if="data.state === false">
        Обязательно для заполнения
      </span>
    </b-form-group>
  </div>
</template>

<script>
import { MultiSelect } from "vue-search-select";
import { BFormGroup } from "bootstrap-vue";
import select from "@/services/select";

export default {
  name: "ControlEnum",
  components: { MultiSelect, BFormGroup },
  data() {
    return {
      options: [],
      searchText: "", // If value is falsy, reset searchText & searchItem
      lastSelectItem: {},
    };
  },
  created() {
    this.initData();
  },
  methods: {
    onSelect(items, lastSelectItem) {
      this.data.value = items;
      this.lastSelectItem = lastSelectItem;
    },
    initData() {
      select.getData(this.data.dic).then((data) => {
        this.options = data;
      });
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
};
</script>

<style scoped>
.ui.disabled.dropdown[data-v-3a0c7bea],
.ui.dropdown .menu > .disabled.item[data-v-3a0c7bea] {
  cursor: default;
  pointer-events: none;
  opacity: 1;
}
.error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}
</style>
