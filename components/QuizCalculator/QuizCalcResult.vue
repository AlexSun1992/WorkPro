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
        <li class="col-4" v-if="issueLink">
          <a :href="issueLink">
            <img src="./img/price-action1.svg" />
            Оформить полис
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
const IS_PRODUCTION = false;
const DISABLE_CACHE = !IS_PRODUCTION;

function buildQuery(answers, questions, quizId, zone = "/free/v2") {
  const disableCache = DISABLE_CACHE ? `true${Math.random()}` : "";

  const url = new URL(`${zone}/quiz/result`, window.location.href);
  url.searchParams.append("idQUIZ", quizId);
  if (disableCache) {
    url.searchParams.append("disableCache", disableCache);
  }
  answers.forEach((answer) => {
    const question = questions.find(
      (item) => item.ID === Number(answer.IDCLIENT_QIUZ_ISSUE)
    );
    url.searchParams.append(question.SVALUE_NAME, answer.SVALUE_VALUE);
  });
  return url.toString();
}

export default {
  props: ["answers", "quizId", "questions", "issueLink"],
  data() {
    return {
      isLoading: true,
      premium: 0,
    };
  },
  created: function () {
    this.isLoading = true;
    const authUrl = buildQuery(
      this.answers,
      this.questions,
      this.quizId,
      "/main/v2"
    );
    this.$axios({
      url: authUrl,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 401,
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("401");
        }
        return res;
      })
      .catch((err) => {
        if (/401/.test(err.message)) {
          const url = buildQuery(this.answers, this.questions, this.quizId);
          return this.$axios(url);
        }
        throw err;
      })
      .then(({ data }) => {
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
