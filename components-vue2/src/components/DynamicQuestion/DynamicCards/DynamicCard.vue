<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button @click="action" block :variant="text">
        {{ title }}
      </b-button>
    </b-card-header>
    <b-collapse :id="param" accordion="my-accordion" role="tabpanel">
      <div>
        <slot></slot>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
import { BCollapse, BButton, BCard, BCardHeader } from "bootstrap-vue";

export default {
  props: ["param", "title"],
  name: "DynamicCard",
  components: {
    BCollapse,
    BButton,
    BCard,
    BCardHeader,
  },
  data() {
    return {
      text: "info",
      dataHub: [],
    };
  },

  methods: {
    action() {
      this.$emit("action");
    },
  },
};
</script>
