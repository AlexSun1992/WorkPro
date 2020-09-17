<template>
  <div>
    <div class="finish-price mt-2">
      <img v-if="isLoading" src="./img/loader.gif" style="height: 24px;" />
      <!-- {this.state.isLoading ? preloader : fetchedResult} -->
      <div v-else>
        <span class="h1">
          {{ this.premiumRub }}
        </span>
        <span>.{{ this.premiumKop }} ₽</span>
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
  const url = new URL(
    "https://testclient.reso.ru/WarAgentResoRu/newClientResoRu/calculators"
  );
  url.searchParams.append("quizId", quizId);
  answers.forEach(answer => {
    const question = questions.find(
      item => item.id === Number(answer.properties.idclient_quiz_issue)
    );
    url.searchParams.append(
      question.properties.svalue_name,
      answer.properties.svalue_value
    );
  });
  return url.toString();
}

export default {
  props: ["answers", "quizId", "questions"],
  data() {
    return {
      isLoading: true,
      premium: 0
    };
  },
  created: function() {
    this.isLoading = true;
    const url = buildQuery(this.answers, this.questions, this.quizId);
    setTimeout(() => {
      this.premium = Math.ceil(Math.random() * 500000) / 100;
      this.isLoading = false;
    }, Math.random() * 10000 + 1000);
    // this.$axios(url).then(({ data }) => {
    //   console.log(data);
    // });
    console.log({ url });
  },
  computed: {
    premiumRub() {
      return Math.ceil(this.premium).toLocaleString();
    },
    premiumKop() {
      return String(this.premium * 100).slice(-2);
    }
  }
};
</script>
