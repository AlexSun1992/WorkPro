<template>
  <b-card no-body class="mb-1">
    <b-card-header
      header-tag="header"
      class="p-1"
      role="tab"
      v-b-toggle="parameter"
    >
      <b-button :variant="text">
        {{ title }}
      </b-button>
    </b-card-header>
    <b-collapse :id="param" accordion="my-accordion" role="tabpanel">
      <b-card-body>
        <b-card-text v-html="answer"></b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>
<script>
import {
  BCollapse,
  BButton,
  BCard,
  BCardHeader,
  BCardBody,
  BCardText,
} from "bootstrap-vue";
import { VBToggle } from "bootstrap-vue";
export default {
  props: {
    answer: {
      type: String,
      required: true,
      default: () => {},
    },
    param: {
      type: String,
      reqiured: true,
      default: () => {},
    },
    title: {
      type: String,
      required: true,
      default: () => {},
    },
    parameter: {
      type: String,
      required: true,
      default: () => {},
    },
  },

  name: "DynamicCard",
  components: {
    BCollapse,
    BButton,
    BCard,
    BCardHeader,
    BCardBody,
    BCardText,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      text: "info",
      active: false,
    };
  },

  methods: {},
  mounted() {
    // console.log(typeof Number(this.parameter));
    // console.log(typeof String(this.parameter));
    if (this.parameter === this.param) {
      // this.parameter = this.param = Math.random().toFixed(2);
      console.log(Math.random().toFixed(2));
    }
  },
};
</script>
