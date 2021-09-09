<template>
  <DynamicQuestion
    :choosenData="distinctData"
    :varLength="distinctSGROUPNAME"
    :isGroup="isGroup"
    product-id
    isTop
  ></DynamicQuestion>
</template>

<script>
import DynamicQuestion from "./DynamicQuestion.vue";
export default {
  props: {
    productId: {
      type: Number,
      required: true,
      default: () => {},
    },
    isTop: {
      type: Boolean,
      required: true,
      default: () => {},
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: () => {},
    },
  },
  components: {
    DynamicQuestion,
  },

  data() {
    return {
      distinctData: [],
      distinctSGROUPNAME: [],
      mainData: [],
      objectHub: [],
    };
  },

  // computed: {
  //   revealChosenData: function () {
  //     if (this.isTop === true) {
  //       this.distinctData = this.mainData.filter((item) => {
  //         return item.IDRMPRODUCT === this.productId && item.LTOP === true;
  //       });
  //
  //     }
  //     if (this.isTop === false) {
  //       this.distinctData = this.mainData.filter((item) => {
  //         return item.IDRMPRODUCT === this.productId;
  //       });
  //
  //     }
  //   },
  // },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    this.mainData = data;
    const urlAddress = /\bhttps?:\/\/\S+/g;
    const phone =
      /\s(\+7|8)[-]*\(?[-]*(\d{3}[-]*\)?([-]*\d){7}|\d\d[-]*\d\d[-]*\)?([-]*\d){6})/g;
    const email = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

    // <------- сортировка по LTOP
    if (this.isTop === true && this.isGroup === false) {
      this.distinctData = this.mainData.filter((item) => {
        return item.IDRMPRODUCT === this.productId && item.LTOP === true;
      });
    }
    if (this.isTop === false) {
      this.distinctData = this.mainData.filter((item) => {
        return item.IDRMPRODUCT === this.productId;
      });
    }
    //<-------сортировка по LTOP

    //<--------сортировка по группам
    if (this.isGroup === true && this.isTop === false) {
      this.distinctData = this.mainData.filter((item) => {
        return item.SGROUPNAME !== undefined;
      });

      for (let i = 0; i < this.distinctData.length; i++) {
        if (
          !this.distinctSGROUPNAME.includes(this.distinctData[i].SGROUPNAME)
        ) {
          this.distinctSGROUPNAME.push(this.distinctData[i].SGROUPNAME);
        }
      }

      this.distinctSGROUPNAME.forEach((item) => {
        const obj = {};
        obj.name = item;
        obj.data = this.distinctData.filter((elem) => {
          return elem.SGROUPNAME === obj.name;
        });
        this.objectHub.push(obj);
      });

      // this.objectHub.forEach((item) => {
      //   item.data.unshift(item.name);
      //   delete item.name;
      // });

      console.log(this.objectHub);

      this.distinctData = this.objectHub;
      // console.log(this.distinctData);
      // console.log(this.distinctData);
    }

    if (this.isGroup === false && this.isTop === false) {
      this.distinctData = this.mainData.filter((item) => {
        return item.IDRMPRODUCT === this.productId;
      });
    }
    //<--------сортировка по группам

    //<---- внесение html интерпретации
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
  //<---- внесение html интепретации
};
</script>

<style scoped></style>
