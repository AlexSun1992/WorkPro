<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button @click="sayHello" block v-b-toggle:accordion-1 :variant="text">
        <slot />
      </b-button>
    </b-card-header>
    <b-collapse :id="id" accordion="my-accordion" role="tabpanel">
      <b-card-body>
        <component :is="componentName"></component>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import DynamicOSAGO from "../DynamicComponents/DynamicOSAGO";
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
  props: [],
  name: "DynamicCard",
  components: {
    DynamicOSAGO,
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
      active: "OSAGO",
      text: "info",
      id: "accordion-1",
    };
  },
  methods: {
    sayHello() {
      this.$emit("action");
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
