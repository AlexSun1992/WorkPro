<template>
  <div>
    <div class="finish-price mt-2">
      <img v-if="isLoading" src="./img/loader.gif" style="height: 24px" />
      <!-- {this.state.isLoading ? preloader : fetchedResult} -->
      <div v-else>
        <span class="h1">{{ this.premiumRub }}</span
        ><!--
        --><span>.{{ this.premiumKop }} ₽</span>
        <span class="finish-price-text">
          &nbsp;— предварительная стоимость полиса
        </span>
      </div>
    </div>
    <p class="fsz-18 mt-3"></p>
    <div class="finish-price-action conteiner-fluid">
      <ul class="row">
        <li class="col-4">
          <a
            href="https://testclient.reso.ru/WarAgentResoRu/newClientResoRu/auth/login.xhtml?welcome_id=wlc1799"
          >
            <img src="./img/price-action1.svg" />
            Оформить ОСАГО
          </a>
        </li>
        <li class="col-4">
          <a href="#" @click.prevent="$emit('reset-quiz')">
            <img src="./img/price-action3.svg" />
            Сделать новый расчет
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
function buildQuery(answers, questions, quizId) {
  const url = new URL("/free/v2/quiz/result", window.location.href);
  url.searchParams.append("idQUIZ", quizId);
  answers.forEach((answer) => {
    const question = questions.find(
      (item) => item.ID === Number(answer.IDCLIENT_QIUZ_ISSUE)
    );
    url.searchParams.append(question.SVALUE_NAME, answer.SVALUE_VALUE);
  });
  return url.toString();
}

export default {
  props: ["answers", "quizId", "questions"],
  data() {
    return {
      isLoading: true,
      premium: 0,
    };
  },
  created() {
    this.isLoading = true;
    const url = buildQuery(this.answers, this.questions, this.quizId);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.premium = data[0].PREMIUM;
        this.isLoading = false;
      });
  },
  computed: {
    premiumRub() {
      return Math.floor(this.premium).toLocaleString();
    },
    premiumKop() {
      return String(this.premium * 100).slice(-2);
    },
  },
};
</script>
<style scoped>
@import url("./calculator.css");
</style>
