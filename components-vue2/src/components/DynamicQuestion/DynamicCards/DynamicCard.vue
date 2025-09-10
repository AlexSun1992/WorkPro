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
        @click="toggleAccordion(question.ID)"
        v-b-toggle="question.ID.toString()"
      >
        {{ question.SQUESTION }}
      </b-card-header>
      <div
        :id="question.ID.toString()"
        v-if="isQuestionActive(question.ID)"
        accordion="my-accordion"
        role="tabpanel"
      >
        <b-card-body>
          <b-card-text> <span v-html="textToMarkdown(question.SANSWER)"></span></b-card-text>
        </b-card-body>
      </div>
    </b-card>
  </div>
</template>
<script>
import { BCard, BCardHeader, BCardBody, BCardText, VBToggle } from "bootstrap-vue";
import marked from "marked";

export default {
  props: {
    questions: {
      type: Array,
      default: () => [],
    },
  },
  name: "DynamicCard",
  components: {
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
      activeQuestionsId: [],
    };
  },
  methods: {
    isQuestionActive(id) {
      return this.activeQuestionsId.includes(id);
    },
    textToMarkdown(text) {
      return marked(text);
    },
    toggleAccordion(id) {
      const idExists = this.activeQuestionsId.findIndex((el) => el === id);
      idExists === -1 ? this.activeQuestionsId.push(id) : this.activeQuestionsId.splice(idExists, 1);
    },
  },
};
</script>
