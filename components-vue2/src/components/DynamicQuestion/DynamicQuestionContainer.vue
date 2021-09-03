<template>
  <div class="DynamicQuestionContainer">
    <DynamicQuestion
      :choosenData="distinctData"
      :product-id="target"
    ></DynamicQuestion>
  </div>
</template>

<script>
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
    const urlAddress = /\bhttps?:\/\/\S+/;
    this.distinctData = data.filter((item) => {
      return item.IDRMPRODUCT === this.productId;
    });

    this.distinctData.forEach((item) => {
      if (item.SANSWER.includes("\n")) {
        item.SANSWER = item.SANSWER.replace(/\n/g, "<br />");
      }
      if (item.SANSWER.match(urlAddress)) {
        // item.SANSWER = item.SANSWER.replace(urlAddress, `<a>${urlAddress}</a>`);
        // console.log(item.SANSWER.match(urlAddress)[0]);
        // item.SANSWER = item.SANSWER.replace(
        //   "a",
        //   `<a href="#">${item.SANSWER.match(urlAddress)[0]}</a>`
        // );
        // item.SANSWER = item.SANSWER.replace(
        //   item.SANSWER.match(urlAddress)[0],
        //   `<a href="#">${item.SANSWER.match(urlAddress)[0]}</a>`
        // );

        console.log(item.SANSWER.match(urlAddress));
      }
    });
  },
};
</script>

<style scoped></style>
