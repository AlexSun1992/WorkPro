<template>
  <div class="DynamicQuestionContainer">
    <div class="accordion" role="tablist">
      <dynamic-card componentName="DynamicOSAGO" param="10" v-b-toggle:10
        >ОСАГО</dynamic-card
      >
      <dynamic-card componentName="DynamicKASKO" param="20" v-b-toggle:20
        >КАСКО</dynamic-card
      >
      <dynamic-card componentName="DynamicGreenCard" param="30" v-b-toggle:30
        >Зеленая карта</dynamic-card
      >
      <dynamic-card componentName="DynamicProperty" param="40" v-b-toggle:40
        >Имущество</dynamic-card
      >
      <dynamic-card componentName="DynamicTourists" param="50" v-b-toggle:50
        >Туризм</dynamic-card
      >
      <dynamic-card componentName="DynamicDMS" param="60" v-b-toggle:60
        >ДМС</dynamic-card
      >
      <dynamic-card componentName="DynamicAnother" param="70" v-b-toggle:70
        >ДРУГОЕ</dynamic-card
      >
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
      active: "KASKO",
    };
  },
  methods: {},
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
