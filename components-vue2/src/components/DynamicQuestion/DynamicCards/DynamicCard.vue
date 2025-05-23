<template>
  <div class="accordion">
    <b-card
      v-for="question in questions"
      :key="question.ID"
      no-body
      class="mb-1"
    >
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
        v-b-toggle="question.ID.toString()"
      >
        {{ question.SQUESTION }}
      </b-card-header>
      <b-collapse
        :id="question.ID.toString()"
        accordion="my-accordion"
        role="tabpanel"
      >
        <b-card-body>
          <b-card-text v-html="textToMarkdown(question.SANSWER)" />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>
<script>
import {
  BCollapse,
  BCard,
  BCardHeader,
  BCardBody,
  BCardText,
  VBToggle
} from "bootstrap-vue";
import marked from "marked";

export default {
  props: {
    questions: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  name: "DynamicCard",
  components: {
    BCollapse,
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
  methods: {
    textToMarkdown(text) {
      return marked(text);
    },
  },
};
</script>
