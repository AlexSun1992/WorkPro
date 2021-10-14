<template>
  <div>
    <DynamicQuestion
      :choosenData="neededData"
      :varLength="distinctSGROUPNAME"
      :isGroup="isGroup"
      product-id
      isTop
    ></DynamicQuestion>
  </div>
</template>

<script>
import DynamicQuestion from "./DynamicQuestion.vue";
import { dataManager } from "./data-manager.links-wrapper";

export default {
  props: {
    productId: {
      type: Number,
      required: true,
      default: () => {},
    },
    isTop: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isGroup: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  components: {
    DynamicQuestion,
  },

  created() {
    console.log(this.productId);
    console.log(this.isTop);
    console.log(this.isGroup);
    // console.log();
  },

  data() {
    return {
      testData: [],
      distinctData: [],
      distinctNGROUPSORT: [],
      distinctSGROUPNAME: [],
      mainData: [],
      objectHub: [],
    };
  },

  computed: {
    neededData: function () {
      if (this.isGroup === false && this.isTop === false) {
        this.distinctData = this.mainData.filter((item) => {
          return item.IDRMPRODUCT === this.productId;
        });
        dataManager(this.distinctData);
        return this.distinctData;
      }
      if (this.isTop === true && this.isGroup === false) {
        this.distinctData = this.mainData.filter((item) => {
          return item.IDRMPRODUCT === this.productId && item.LTOP === true;
        });
        dataManager(this.distinctData);
        return this.distinctData;
      }
      if (
        (this.isGroup === true && this.isTop === false) ||
        (this.isGroup === true && this.isTop === true)
      ) {
        this.distinctData = this.mainData.filter((item) => {
          return item.SGROUPNAME !== undefined;
        });

        for (let i = 0; i < this.distinctData.length; i++) {
          if (
            !this.distinctSGROUPNAME.includes(this.distinctData[i].SGROUPNAME)
          ) {
            this.distinctSGROUPNAME.push(this.distinctData[i].SGROUPNAME);
          }
          if (this.distinctData[i].NGROUPSORT === undefined) {
            continue;
          }
          if (
            !this.distinctNGROUPSORT.includes(this.distinctData[i].NGROUPSORT)
          ) {
            this.distinctNGROUPSORT.push(this.distinctData[i].NGROUPSORT);
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
        for (let i = 0; i < this.distinctNGROUPSORT.length; i++) {
          this.objectHub[i].position = this.distinctNGROUPSORT[i];
        }
        this.distinctData = this.objectHub;

        this.distinctData.sort((a, b) => {
          return a.position - b.position;
        });

        this.distinctData.forEach((item) => {
          item.data.forEach((elem) => {
            this.testData.push(elem);
          });
        });

        dataManager(this.testData);

        return this.distinctData;
      }
    },
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    this.mainData = data;
  },
};
</script>

<style scoped></style>
