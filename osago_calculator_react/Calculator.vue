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
        <CalcResult
          v-if="isCalcStage"
          :questions="questions"
          :answers="chosenAnswers"
          :quizId="quizId"
          @reset-quiz="resetQuiz"
        />
        <ul v-else class="select-finish-items">
          <li v-for="answer in chosenAnswers" :key="answer.id">
            {{ answer.name }}
            <button
              class="select-finish-items-del"
              @click="deleteAnswer(answer)"
            ></button>
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
import CalcResult from "./CalcResult";

export default {
  components: { Question, CalcResult },
  data() {
    return {
      stitle_h1: "Калькулятор ОСАГО",
      stitle_h2: "Узнайте стоимость полиса за пару минут",
      questions,
      answers,
      chosenAnswers: [],
      quizId: 1,
      firstQuestion: 2100,
      partnerId: -1,
      pageId: 1
    };
  },
  methods: {
    chooseAnswer: function(answer) {
      this.chosenAnswers.push(answer);
    },
    deleteAnswer: function(answer) {
      const answerId = this.chosenAnswers.indexOf(answer);
      this.chosenAnswers.splice(answerId);
    },
    resetQuiz: function() {
      this.chosenAnswers = [];
    }
  },
  computed: {
    currentQuestionId() {
      const lastAnswer = this.chosenAnswers.slice().pop();
      return lastAnswer
        ? Number(lastAnswer.properties.nnext_issue)
        : this.firstQuestion;
    },
    currentQuestion() {
      return this.questions.find(item => item.id === this.currentQuestionId);
    },
    currentAnswers() {
      return this.answers.filter(item => {
        return (
          String(item.properties.idclient_quiz_issue) ===
            String(this.currentQuestion.id) &&
          String(item.properties.lactive) === "1"
        );
      });
    },
    isCalcStage() {
      return (
        this.currentQuestion &&
        this.currentQuestion.properties.sshow_type === "SYSTEM_END"
      );
    }
  }
};
</script>
<style>
@import url("./calculator.css");
</style>
