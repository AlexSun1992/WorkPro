<template>
  <b-card no-body class="mb-1">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button @click="action" block :variant="text">
        {{ title }}
      </b-button>
    </b-card-header>
    <b-collapse :id="param" accordion="my-accordion" role="tabpanel">
      <div>
        <!-- <b-card-body>
          <div>{{ message }}</div>
        </b-card-body> -->
        <slot></slot>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
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
  props: ["param", "title", "message"],
  name: "DynamicCard",
  components: {
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
      dataHub: [],
    };
  },

  methods: {
    action() {
      // console.log(this.title);
      this.$emit("action");
    },
  },
  async created() {},
};
</script>
