<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button block :variant="text">
        <slot />
      </b-button>
    </b-card-header>
    <b-collapse :id="param" accordion="my-accordion" role="tabpanel">
      <b-card-body>
        <component :is="componentName"></component>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import DynamicOSAGO from "../DynamicComponents/DynamicOSAGO";
import DynamicKASKO from "../DynamicComponents/DynamicKASKO";
import DynamicGreenCard from "../DynamicComponents/DynamicGreenCard.vue";
import DynamicProperty from "../DynamicComponents/DynamicProperty.vue";
import DynamicTourists from "../DynamicComponents/DynamicTourists.vue";
import DynamicDMS from "../DynamicComponents/DynamicDMS.vue";
import DynamicAnother from "../DynamicComponents/DynamicAnother.vue";

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
  props: ["param", "componentName"],
  name: "DynamicCard",
  components: {
    DynamicOSAGO,
    DynamicKASKO,
    DynamicGreenCard,
    DynamicProperty,
    DynamicTourists,
    DynamicDMS,
    DynamicAnother,
    BCollapse,
    BButton,
    BCard,
    BCardText,
    BCardBody,
    BCardHeader,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      text: "info",
    };
  },
  created() {
    console.log(this.componentName);
  },
};
</script>
