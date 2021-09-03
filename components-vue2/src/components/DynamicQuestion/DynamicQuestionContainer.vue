<template>
  <div class="DynamicQuestionContainer">
    <DynamicQuestion
      :choosenData="distinctData"
      :product-id="target"
    ></DynamicQuestion>
  </div>
</template>

<script>
import { isArray } from "util";
import DynamicQuestion from "./DynamicQuestion.vue";
export default {
  props: ["productId", "choosenData"],
  props: {
    productId: {
      type: Number,
      required: true,
      default: () => {},
    },
  },
  components: {
    DynamicQuestion,
  },

  data() {
    return {
      target: "",
      distinctData: [],
    };
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    const urlAddress = /\bhttps?:\/\/\S+/g;
    this.distinctData = data.filter((item) => {
      return item.IDRMPRODUCT === this.productId;
    });

    this.distinctData.forEach((item) => {
      if (item.SANSWER.match(urlAddress)) {
        if (item.SANSWER.match(urlAddress).length > 0) {
          for (let i = 0; i < item.SANSWER.match(urlAddress).length; i++) {
            item.SANSWER = item.SANSWER.replace(
              item.SANSWER.match(urlAddress)[i],
              `<a href="${item.SANSWER.match(urlAddress)[i]}">${
                item.SANSWER.match(urlAddress)[i]
              }</a>`
            );
          }
        }
      }
      if (item.SANSWER.includes("\n")) {
        item.SANSWER = item.SANSWER.replace(/\n/g, "<br />");
      }
    });
  },
};
</script>

<style scoped></style>
