<template>
  <div v-if="offices">
    <div class="container">
      <FilterComponent class="my-4" :filters="filters" @update="setFilter" />
      <div v-if="offices" class="offices">
        <div v-for="(office, index) in offices" :key="index">
          <OfficeCard :office="office" />
        </div>
      </div>
      <Paginator
        @update="page = $event"
        :items-count="officesLength"
        :pages-count="pagesCount"
      />
    </div>
  </div>
</template>

<script>
import Paginator from "./Paginator.vue";
import OfficeCard from "./OfficeCard.vue";
import FilterComponent from "./FilterComponent.vue";
import { filters } from "../../../../utils/filters";
export default {
  name: "OfficesList",
  props: {
    pagesCount: {
      type: Number,
      default: 15,
    },
  },
  components: {
    Paginator,
    OfficeCard,
    FilterComponent,
  },
  data() {
    return {
      filter: null,
      page: 0,
      filters,
    };
  },
  methods: {
    setFilter(event) {
      this.filter = event;
    },
  },
  computed: {
    offices() {
      if (this.$store?.getters["map/getRegionOffices"]) {
        let data = [...this.$store.getters["map/getRegionOffices"]];
        let start = this.page * this.pagesCount;
        let end = start + this.pagesCount;
        return data.slice(start, end);
      }
    },
    region() {
      return this.$store?.getters["map/getSelectedRegion"];
    },
    officesLength() {
      return this.$store?.getters["map/getRegionOffices"]?.length;
    },
  },
  watch: {
    region: function (newVal) {
      this.page = "";
    },
  },
};
</script>

<style scoped>
.offices {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2vw;
}
</style>
