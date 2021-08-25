<template>
  <div class="DynamicQuestionContainer">
    <div class="accordion" role="tablist">
      <dynamic-card @action="sayHello">ОСАГО</dynamic-card>
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

    // DynamicOSAGO,
    // DynamicKASKO,
    // DynamicGreenCard,
    // DynamicProperty,
    // DynamicTourists,
    // DynamicDMS,
    // DynamicAnother,
  },
  directives: {
    "b-toggle": VBToggle,
  },

  data() {
    return {
      active: "OSAGO",
    };
  },
  methods: {
    sayHello() {
      console.log("Hello");
    },
  },
  computed: {
    componentName() {
      if (this.active === "OSAGO") {
        return "DynamicOSAGO";
      } else if (this.active === "KASKO") {
        return "DynamicKASKO";
      } else if (this.active === "GreenCard") {
        return "DynamicGreenCard";
      } else if (this.active === "Property") {
        return "DynamicProperty";
      } else if (this.active === "Tourists") {
        return "DynamicTourists";
      } else if (this.active === "DMS") {
        return "DynamicDMS";
      } else if (this.active === "Another") {
        return "DynamicAnother";
      }
    },
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
