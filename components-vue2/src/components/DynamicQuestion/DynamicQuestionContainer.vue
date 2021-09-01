<template>
  <div class="DynamicQuestionContainer">
    <div class="accordion" role="tablist">
      <dynamic-card
        v-for="(item, idx) in targetData"
        :key="idx"
        :param="`${idx}`"
        v-b-toggle="`${idx}`"
        :title="item"
        @action="hello(idx)"
      >
        <dynamic-question-body
          :content="linkData"
          v-for="(item, id) in linkData"
          :key="id"
        >
          <h2>{{ item.SANSWER }}</h2>
        </dynamic-question-body>
      </dynamic-card>
    </div>
  </div>
</template>

<script>
import DynamicCard from "./DynamicCards/DynamicCard";
import DynamicQuestionBody from "./DynamicQuestionBody/DynamicQuestionBody";

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
    DynamicQuestionBody,
  },
  directives: {
    "b-toggle": VBToggle,
  },

  data() {
    return {
      dataHub: [],
      targetData: [],
      linkData: null,
    };
  },
  methods: {
    async hello(idx) {
      const url = "/free/v2/question";
      let response = await fetch(url);
      let data = await response.json();
      console.log(this.targetData[idx]);
      let hub = data.filter((item) => {
        return item.FKIDRMPRODUCT === this.targetData[idx];
      });
      this.linkData = hub;
      console.log(this.linkData);
    },
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    data.forEach((item) => {
      this.dataHub.push(item.FKIDRMPRODUCT);
    });
    for (let str of this.dataHub) {
      if (!this.targetData.includes(str)) {
        this.targetData.push(str);
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
