<template>
  <div>
    <b-table   bordered empty-text="Нет данных" empty-filtered-text="Нет данных" show-empty :filter="filter" @filtered="onFiltered" :perPage="page" :current-page="currentPage"  :busy.sync="load"  @row-clicked="selectItem"  @row-dblclicked="showItem"   responsive striped hover :items="items" :fields="fields" small>
      <template
        slot="empty">
        <pulse-loader class="text-center"  :loading="load" :margin="'10px'" :color="'#678898'" :size="'25px'"></pulse-loader>
        <div v-if="!load" class="text-center">
          Нет данных
        </div>
      </template>
      <template v-slot:cell(index)="data">
        <button v-on:click="showItem(data)" class="btn btn-success">Открыть</button>
      </template>
    </b-table>
    <b-form v-show="paging" inline>
      <b-form-select class="mb-2 mt-1 mr-sm-2 mb-sm-0" :width="'auto'" :plain="true" v-model="page" :options="options" />
      <b-pagination class="mb-2 mt-1 mr-sm-2 mb-sm-0"  size="md" :total-rows="count" v-model="currentPage" :per-page="page"></b-pagination>
    </b-form>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  name: 'Grid',
  data () {
    return {
      currentPage: 1,
      page: 10,
      count: null,
      options: [
        { value: 10, text: '10' },
        { value: 20, text: '20' }
      ]
    }
  },
  components: {
    PulseLoader
  },
  props: {
    load: {
      type: Boolean,
      required: false,
      default: () => false
    },
    total: {
      type: Number,
      required: false,
      default: () => null
    },
    selected: {
      type: Function,
      required: false,
      default: () => null
    },
    dblClicked: {
      type: Function,
      required: false,
      default: () => null
    },
    fields: {
      type: Array,
      required: false,
      default: () => []
    },
    items: {
      type: Array,
      required: false,
      default: () => []
    },
    filter: {
      type: String,
      required: false,
      default: () => null
    }
  },
  methods: {
    selectItem (record, index) {
      this.$emit('selected', record, index)
    },
    showItem (record, index) {
      this.$emit('action-clicked', record, index)
    },
    onFiltered (filteredItems) {
      this.count = filteredItems.length
      this.currentPage = 1
    }
  },
  computed: {
    paging () {
      return this.count > this.page
    }
  }
}
</script>

<style>
</style>
