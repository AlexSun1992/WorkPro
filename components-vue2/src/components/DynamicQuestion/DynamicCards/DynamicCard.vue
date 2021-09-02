<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block :variant="text">
          {{ title }}
        </b-button>
      </b-card-header>
      <b-collapse :id="param" accordion="my-accordion" role="tabpanel">
        <div>
          <p>{{ answer }}</p>
        </div>
      </b-collapse>
    </b-card>
  </div>
</template>
<script>
import { BCollapse, BButton, BCard, BCardHeader } from "bootstrap-vue";
export default {
  props: ["param", "title", "headTitle", "answer"],
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
};
</script>
