<template>
  <div>
    <div v-if="data">
      <div v-if="pageCount > 1" class="pagination my-4">
        <button class="back mr-2" :disabled="disabledBack" @click="prevPage">
          &laquo;
        </button>
        <div
          @click="changePageNumber(index)"
          class="number"
          :class="{ active: pageNumber == index }"
          v-for="(n, index) in pageCount"
          :key="index"
        >
          {{ n }}
        </div>
        <button class="next ml-2" :disabled="disabledNext" @click="nextPage">
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Paginator",
  props: ["data", "size"],
  data() {
    return {
      pageNumber: 0,
    };
  },
  methods: {
    nextPage() {
      this.pageNumber++;
      this.paginateData();
    },
    prevPage() {
      this.pageNumber--;
      this.paginateData();
    },
    changePageNumber(index) {
      this.pageNumber = index;
      this.paginateData();
    },
    paginateData() {
      let data = [...this.data];
      let start = this.pageNumber * this.size;
      let end = start + this.size;
      let slicedData = data.slice(start, end);
      this.$emit("update", slicedData);
    },
  },
  computed: {
    pageCount() {
      this.paginateData();
      return Math.ceil(this.data.length / this.size);
    },
    disabledBack() {
      return this.pageNumber == 0;
    },
    disabledNext() {
      return this.pageNumber >= this.pageCount - 1;
    },
  },
  watch: {
    data: function (newVal) {
      this.pageNumber = 0;
    },
  },
};
</script>

<style scoped>
.active {
  background-color: #4caf50;
  color: white;
}
.pagination {
  display: flex;
  justify-content: center;
}
.number {
  display: block;
  padding: 8px 16px;
  cursor: pointer;
}
.back,
.next {
  cursor: pointer;
}
</style>
