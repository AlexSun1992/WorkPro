<template>
  <div>
    <DynamicCard v-if="isGroup === false" :questions="questions"></DynamicCard>
    <template v-else-if="isGroup === true">
      <div v-for="item in questions">
        <h2>{{ item.groupName }}</h2>
        <DynamicCard :questions="item.questions"></DynamicCard>
      </div>
    </template>
  </div>
</template>

<script>
import DynamicCard from "./DynamicCards/DynamicCard.vue";

export default {
  props: {
    productId: {
      type: Number,
      required: false,
      default: () => null,
    },
    isTop: {
      type: Boolean,
      required: false,
      default: () => null,
    },
    isGroup: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  components: {
    DynamicCard,
  },
  data() {
    return {
      data: [],
    };
  },
  async created() {
    const url = "/free/v2/question";
    const response = await fetch(url);
    const data = await response.json();
    this.data = data;
  },
  computed: {
    questions() {
      return this.data
        .filter(
          (item) => item.IDRMPRODUCT === (this.productId || item.IDRMPRODUCT)
        )
        .filter((item) => {
          if (this.isTop === true) {
            return item.LTOP === true;
          }
          return item;
        })
        .sort((a, b) => {
          if (a.LTOP === true && b.LTOP === true) {
            if (a.NTOPSORT > b.NTOPSORT) {
              return 1;
            }
            if (a.NTOPSORT < b.NTOPSORT) {
              return -1;
            }
            return a.NTOPSORT - b.NTOPSORT;
          }
          return 0;
        })
        .reduce((acc, value) => {
          if (this.isGroup === false) {
            acc.push(value);
          }
          if (this.isGroup === true && value.SGROUPNAME) {
            let objectGroup;
            objectGroup = acc.find(
              (item) => item.groupName === value.SGROUPNAME
            );
            if (objectGroup === undefined) {
              objectGroup = { groupName: value.SGROUPNAME, questions: [] };
              objectGroup.questions.push(value);
              acc.push(objectGroup);
            } else {
              objectGroup.questions.push(value);
            }
          }
          return acc;
        }, []);
    },
  },
};
</script>

<style scoped></style>
