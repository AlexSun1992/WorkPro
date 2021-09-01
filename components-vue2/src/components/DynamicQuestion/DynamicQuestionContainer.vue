<template>
  <div class="DynamicQuestionContainer">
    <div class="accordion" role="tablist">
      <dynamic-card
        v-for="(item, idx) in distinctTitlesData"
        :key="idx"
        :param="`${idx}`"
        v-b-toggle="`${idx}`"
        :title="item"
        @action="ChooseItem(idx)"
      >
        <div v-for="(item, id) in selectData" :key="id">
          <h4>{{ item.SQUESTION }}</h4>
          <p>{{ item.SANSWER }}</p>
        </div>
      </dynamic-card>
    </div>
  </div>
</template>

<script>
import DynamicCard from "./DynamicCards/DynamicCard";

import {
  BCollapse,
  BButton,
  BCard,
  BCardText,
  BCardBody,
  BCardHeader,
  VBToggle,
} from "bootstrap-vue";

export default {
  name: "DynamicQuestionContainer",
  components: {
    BCollapse,
    BButton,
    BCard,
    BCardText,
    BCardBody,
    BCardHeader,
    DynamicCard,
  },
  directives: {
    "b-toggle": VBToggle,
  },

  data() {
    return {
      fullTitlesData: [],
      distinctTitlesData: [],
      fullData: [],
      selectData: [],
    };
  },
  methods: {
    ChooseItem(idx) {
      this.selectData = this.fullData.filter((item) => {
        return item.FKIDRMPRODUCT === this.distinctTitlesData[idx];
      });
    },
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    this.fullData = data;
    data.forEach((item) => {
      this.fullTitlesData.push(item.FKIDRMPRODUCT);
    });

    for (let str of this.fullTitlesData) {
      if (!this.distinctTitlesData.includes(str)) {
        this.distinctTitlesData.push(str);
      }
    }
  },
};
</script>

<style>
.container {
  width: 600px;
  margin: auto;
  height: 300px;
  box-shadow: 0px 0px 14px 1px black;
}
</style>
