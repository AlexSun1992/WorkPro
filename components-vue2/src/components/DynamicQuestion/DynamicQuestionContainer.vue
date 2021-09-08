<template>
  <DynamicQuestion
    :choosenData="distinctData"
    :product-id="target"
  ></DynamicQuestion>
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

    const urlAddress = /\bhttps?:\/\/\S+/g;
    const phone =
      /\s(\+7|8)[-]*\(?[-]*(\d{3}[-]*\)?([-]*\d){7}|\d\d[-]*\d\d[-]*\)?([-]*\d){6})/g;
    const email = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

    this.distinctData = data.filter((item) => {
      return item.IDRMPRODUCT === this.productId;
    });

    this.distinctData.forEach((item) => {
      if (item.SANSWER.match(urlAddress)) {
        if (item.SANSWER.match(urlAddress).length > 0) {
          for (let i = 0; i < item.SANSWER.match(urlAddress).length; i++) {
            item.SANSWER = item.SANSWER.replace(
              item.SANSWER.match(urlAddress)[i],
              `<a target="_blank" href="${item.SANSWER.match(urlAddress)[i]}">${
                item.SANSWER.match(urlAddress)[i]
              }</a>`
            );
          }
        } else
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(urlAddress),
            `<a target="_blank" href="${item.SANSWER.match(
              urlAddress
            )}">${item.SANSWER.match(urlAddress)}</a>`
          );
      }

      if (item.SANSWER.match(phone)) {
        if (item.SANSWER.match(phone).length > 1) {
          for (let i = 0; i < item.SANSWER.match(phone).length; i++) {
            item.SANSWER = item.SANSWER.replace(
              item.SANSWER.match(phone)[i],
              `<a target="_blank" href=tel:"${item.SANSWER.match(phone)[i]}">${
                item.SANSWER.match(phone)[i]
              }</a>`
            );
          }
        } else
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(phone),
            `<a target="_blank" href="tel:${item.SANSWER.match(
              phone
            )}">${item.SANSWER.match(phone)}</a>`
          );
      }

      if (item.SANSWER.match(email)) {
        if (item.SANSWER.match(email).length > 1) {
          for (let i = 0; i < item.SANSWER.match(email).length; i++) {
            item.SANSWER = item.SANSWER.replace(
              item.SANSWER.match(email)[i],
              `<a target="_blank" href=tel:"${item.SANSWER.match(email)[i]}">${
                item.SANSWER.match(phone)[i]
              }</a>`
            );
          }
        } else
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(email),
            `<a target="_blank" href="mailto:${item.SANSWER.match(
              email
            )}">${item.SANSWER.match(email)}</a>`
          );
      }

      if (item.SANSWER.includes("\n")) {
        item.SANSWER = item.SANSWER.replace(/\n/g, "<br />");
      }
    });
  },
};
</script>

<style scoped></style>
