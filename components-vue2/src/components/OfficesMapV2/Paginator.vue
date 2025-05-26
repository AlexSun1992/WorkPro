<template>
  <div class="office-pagination">
    <div v-if="totalCount > 1" class="pagination my-4">
      <button class="back mr-2" :disabled="disabledBack" @click="prevPage">
        Назад
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
        Вперед
      </button>
    </div>
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

<style scoped></style>
