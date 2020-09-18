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
          <li v-for="answer in chosenAnswers" :key="answer.ID">
            {{ answer.STITLE }}
            <button
              class="select-finish-items-del"
              @click="deleteAnswer(answer)"
            ></button>
          </li>
        </ul>
        <Question
          v-if="currentQuestion"
          :question="currentQuestion"
          :answers="currentAnswers"
          @choose-answer="chooseAnswer"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Question from "./Question";
import CalcResult from "./CalcResult";

export default {
  components: { Question, CalcResult },
  data() {
    return {
      stitle_h1: "Калькулятор",
      stitle_h2: "",
      questions: [],
      answers: [],
      chosenAnswers: [],
      quizId: 1,
      firstQuestion: null,
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
      return lastAnswer ? Number(lastAnswer.NNEXT_ISSUE) : this.firstQuestion;
    },
    currentQuestion() {
      return this.questions.find(item => item.ID === this.currentQuestionId);
    },
    currentAnswers() {
      return this.answers.filter(item => {
        return (
          String(item.IDCLIENT_QIUZ_ISSUE) ===
            String(this.currentQuestion.ID) && item.LACTIVE === 1
        );
      });
    },
    isCalcStage() {
      return (
        this.currentQuestion && this.currentQuestion.SSHOW_TYPE === "SYSTEM_END"
      );
    }
  },
  created: async function() {
    const [[quizInfo], questions, answers] = await Promise.all([
      this.$axios(`/free/v2/quiz/info?idQUIZ=${this.quizId}&ttt`).then(
        ({ data }) => data
      ),
      this.$axios(`/free/v2/quiz/question?idQUIZ=${this.quizId}`).then(
        ({ data }) => data
      ),
      this.$axios(`/free/v2/quiz/answer?idQUIZ=${this.quizId}`).then(
        ({ data }) => data
      )
    ]);
    this.questions = questions;
    this.answers = answers;
    this.firstQuestion = quizInfo.NSTART_ISSUE;
    this.stitle_h1 = quizInfo.STITLE_H1;
    this.stitle_h2 = quizInfo.STITLE_H2;
  }
};
</script>
<style>
@import url("./calculator.css");
</style>
