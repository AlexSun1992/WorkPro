<template>
  <div class="container calculator" id="calculator">
    <div>
      <div class="calculator-bg-bg"></div>
      <div class="calculator-ppl-bg"></div>
      <div class="block-calc" id="calculator-item">
        <h2>
          {{ stitle_h1 }}
        </h2>
        <div class="calc-description">
          {{ stitle_h2 }}
        </div>
        <CalcResult
          v-if="isCalcStage"
          :questions="questions"
          :answers="chosenAnswers"
          :quizId="quizIdValue"
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
import Question from "./QuizQuestion";
import CalcResult from "./QuizCalcResult";

export default {
  components: { Question, CalcResult },
  props: ["quizId"],
  data() {
    return {
      stitle_h1: "Калькулятор",
      stitle_h2: "",
      startIssue: null,
      questions: [],
      answers: [],
      chosenAnswers: [],
      quizIdValue: 1,
      partnerId: -1,
      pageId: 1,
    };
  },
  methods: {
    chooseAnswer(answer) {
      this.chosenAnswers.push(answer);
    },
    deleteAnswer(answer) {
      const answerId = this.chosenAnswers.indexOf(answer);
      this.chosenAnswers.splice(answerId);
    },
    resetQuiz() {
      this.chosenAnswers = [];
    },
  },
  computed: {
    firstQuestion() {
      return this.questions.find((item) => item.ID === this.startIssue)
        ? this.startIssue
        : this.questions[0] && this.questions[0].ID;
    },
    currentQuestionId() {
      const lastAnswer = this.chosenAnswers.slice().pop();
      return lastAnswer ? Number(lastAnswer.NNEXT_ISSUE) : this.firstQuestion;
    },
    currentQuestion() {
      return this.questions.find((item) => item.ID === this.currentQuestionId);
    },
    currentAnswers() {
      return this.answers.filter((item) => {
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
    },
  },
  async created() {
    if (this.quizId) {
      this.quizIdValue = this.quizId;
    }
    if (process.browser) {
      const params = new URLSearchParams(window.location.search);
      const quizIdValue = params.get("quizId");
      if (quizIdValue) {
        this.quizIdValue = quizIdValue;
      }
    }
    const [[quizInfo], questions, answers] = await Promise.all([
      fetch(`/free/v2/quiz/info?idQUIZ=${this.quizIdValue}`)
        .then((res) => res.json())
        .then((data) => data),
      fetch(`/free/v2/quiz/question?idQUIZ=${this.quizIdValue}`)
        .then((res) => res.json())
        .then((data) => data),
      fetch(`/free/v2/quiz/answer?idQUIZ=${this.quizIdValue}`)
        .then((res) => res.json())
        .then((data) => data),
    ]);
    this.questions = questions;
    this.answers = answers;
    this.startIssue = quizInfo.NSTART_ISSUE;
    this.stitle_h1 = quizInfo.STITLE_H1;
    this.stitle_h2 = quizInfo.STITLE_H2;
  },
};
</script>
<style scoped>
@import url("./calculator.css");
</style>
