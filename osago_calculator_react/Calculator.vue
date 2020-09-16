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

        <!-- {calcResult}-->
        <ul class="select-finish-items">
          <li v-for="answer in chosenAnswers" :key="answer.id">
            {{ answer.name }}
            <button class="select-finish-items-del"></button>
          </li>
        </ul>
        <Question
          :question="currentQuestion"
          :answers="currentAnswers"
          @choose-answer="chooseAnswer"
        />
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
      chosenAnswers: [],
      quizId: 1,
      firstQuestion: 2100,
      currentQuestionId: null,
      partnerId: -1,
      pageId: 1
    };
  },
  methods: {
    chooseAnswer: function(answer) {
      this.chosenAnswers.push(answer);
      this.currentQuestionId = Number(answer.properties.nnext_issue);
    }
  },
  computed: {
    currentQuestion() {
      return this.questions.find(
        item => item.id === (this.currentQuestionId || this.firstQuestion)
      );
    },
    currentAnswers() {
      return this.answers.filter(item => {
        return (
          String(item.properties.idclient_quiz_issue) ===
            String(this.currentQuestion.id) &&
          String(item.properties.lactive) === "1"
        );
      });
    }
  }
};
</script>
<style>
@import url("./calculator.css");
</style>
