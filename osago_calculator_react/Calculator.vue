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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stitle_h1: "Калькулятор ОСАГО",
      stitle_h2: "Узнайте стоимость полиса за пару минут"
    };
  }
};
</script>
<style scoped>
@import url("./calculator.css");
</style>
