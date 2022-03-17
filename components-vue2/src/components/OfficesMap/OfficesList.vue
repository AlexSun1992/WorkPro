<template>
  <div class="container">
    <div v-if="offices && offices.length" class="offices">
      <div v-for="(office, index) in offices" :key="index">
        <OfficeCard @open="$emit('open', $event)" :office="office" />
      </div>
    </div>
    <div v-else>
      <div class="row search-result-row">
        <div class="col-md-12 col-12 search-results">
          <div class="search-no-result">
            <div class="search-no-result-img"></div>
            <div class="search-no-result-txt">
              По вашему запросу ничего не найдено
            </div>
          </div>
        </div>
      </div>
    </div>
    <Paginator
      v-if="data"
      @update="page = $event"
      :items-count="officesLength"
      :pages-count="pagesCount"
    />
  </div>
</template>

<script>
import Paginator from "./Paginator.vue";
import OfficeCard from "./OfficeCard.vue";
export default {
  name: "OfficesList",
  props: {
    data: {
      type: Array,
    },
    pagesCount: {
      type: Number,
      default: 15,
    },
    filterApplied: {
      type: Object,
    },
  },
  components: {
    OfficeCard,
    Paginator,
  },
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    officesLength() {
      return this.data?.length;
    },
    offices() {
      if (this.data) {
        let start = this.page * this.pagesCount;
        let end = start + this.pagesCount;
        this.page = null;
        return this.data.slice(start, end);
      }
    },
  },
  watch: {
    page: function (val) {
      this.$emit("update", val);
    },
  },
};
</script>

<style scoped>
.empty {
  display: flex;
  justify-content: center;
}
</style>
