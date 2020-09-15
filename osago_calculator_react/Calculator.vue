<template>
  <div class="container calculator" id="calculator">
    <div>
      <div class="calculator-bg-bg"></div>
      <div class="calculator-ppl-bg"></div>
      <div class="block-calc" id="calculator-item">
        <h2>
          {{ stitle_h1 }}
        </h2>
        <div class="calc-description ">
          {{ stitle_h2 }}
        </div>

        <!-- {calcResult}

          {chosenListAnswers}

          {questionEl} -->
        <Question :question="this.currentQuestion" />
      </div>
    </div>
  </div>
</template>
<script>
import questions from "./fixtures/questions";
import answers from "./fixtures/answers";

import Question from "./Question";

export default {
  components: { Question },
  data() {
    return {
      stitle_h1: "Калькулятор ОСАГО",
      stitle_h2: "Узнайте стоимость полиса за пару минут",
      questions,
      answers,
      quizId: 1,
      firstQuestion: 2100,
      partnerId: -1,
      pageId: 1
    };
  },
  computed: {
    currentQuestion() {
      return this.questions.find(item => item.id === this.firstQuestion);
    }
  }
};
</script>
<style scoped>
@import url("./calculator.css");
</style>
