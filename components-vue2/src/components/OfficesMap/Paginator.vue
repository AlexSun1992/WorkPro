<template>
  <div>
    <!-- <div v-if="data"> -->
    <div v-if="totalCount > 1" class="pagination my-4">
      <button class="back mr-2" :disabled="disabledBack" @click="prevPage">
        &laquo;
      </button>
      <div
        @click="changePageNumber(index)"
        class="number"
        :class="{ active: number == index }"
        v-for="(n, index) in totalCount"
        :key="index"
      >
        {{ n }}
      </div>
      <button class="next ml-2" :disabled="disabledNext" @click="nextPage">
        &raquo;
      </button>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "Paginator",
  props: {
    itemsCount: {
      type: Number,
    },
    pagesCount: {
      type: Number,
    },
  },
  data() {
    return {
      number: 0,
    };
  },
  methods: {
    nextPage() {
      this.number++;
      this.update();
    },
    prevPage() {
      this.number--;
      this.update();
    },
    changePageNumber(index) {
      this.number = index;
      this.update();
    },
    update() {
      this.$emit("update", this.number);
    },
  },
  computed: {
    totalCount() {
      this.number = 0;
      return Math.ceil(this.itemsCount / this.pagesCount);
    },
    disabledBack() {
      return this.number == 0;
    },
    disabledNext() {
      return this.number >= this.totalCount - 1;
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
