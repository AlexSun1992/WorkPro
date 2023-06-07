<template>
  <div v-if="!isShowAsTemplate">
    <b-table
      sticky-header="400px"
      bordered
      empty-text="Нет данных"
      empty-filtered-text="Нет данных"
      show-empty
      :filter="filter"
      @filtered="onFiltered"
      :current-page="currentPage"
      :busy="isBusy"
      @row-clicked="selectItem"
      @row-dblclicked="showItem"
      striped
      hover
      :items="items"
      :fields="fields"
      small
      data-mobile-responsive="true"
    >
      <template slot="empty">
        <div v-if="!load" class="text-center">Нет данных</div>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template v-slot:cell(index)="data">
        <slot
          name="actions"
          v-bind:data="data"
          :index="data.index"
          :contextChanged="compareIndexes(data.index)"
          :update="update"
        ></slot>
      </template>
    </b-table>
    <b-form v-show="paging" inline>
      <b-form-select
        class="mb-2 mt-1 mr-sm-2 mb-sm-0"
        :width="'auto'"
        :plain="true"
        v-model="page"
        :options="options"
      />
      <b-pagination
        class="mb-2 mt-1 mr-sm-2 mb-sm-0"
        size="md"
        :total-rows="count"
        v-model="currentPage"
        :per-page="page"
      ></b-pagination>
    </b-form>
  </div>
</template>

<script>
import formatter from "../../../converters/list";
function getTypeByKey(fields, key) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].key === key) {
      return fields[i].type;
    }
  }
}
export default {
  name: "Grid",
  data() {
    return {
      currentPage: 1,
      page: 10,
      count: null,
      options: [
        { value: 10, text: "10" },
        { value: 20, text: "20" },
      ],
      selectedIndex: null,
    };
  },

  props: {
    action: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isShowAsTemplate: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    load: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    total: {
      type: Number,
      required: false,
      default: () => null,
    },
    selected: {
      type: Function,
      required: false,
      default: () => null,
    },
    dblClicked: {
      type: Function,
      required: false,
      default: () => null,
    },
    fields: {
      type: Array,
      required: false,
      default: () => [],
    },
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    filter: {
      type: String,
      required: false,
      default: () => null,
    },
  },
  methods: {
    update() {
      this.$emit("update");
    },
    selectItem(record, index) {
      this.selectedIndex = index;
      this.$emit("selected", record, index);
    },
    showItem(record, index) {
      this.$emit("action-clicked", record, index);
    },
    onFiltered(filteredItems) {
      this.count = filteredItems.length;
      this.currentPage = 1;
    },
    formatData(value, key) {
      return formatter.formatByType(getTypeByKey(this.fields, key), value);
    },
    compareIndexes(index) {
      return index == this.selectedIndex ? true : false;
    },
  },
  computed: {
    isBusy() {
      return this.load;
    },
    paging() {
      return this.count > this.page;
    },
  },
};
</script>

<style>
.text-col {
  white-space: wrap;
}
</style>
