<template>
  <div>
    <div class="calc-action-title">
      {{ question.SNAME_ISSUE }}
    </div>
    <div class="calc-action">
      <div class="calc-select-label">
        {{ question.SDOP_INFO }}
      </div>
      <ul v-if="question.SSHOW_TYPE === 'choice'" class="select-items">
        <li
          v-for="item in answers"
          :value="item.ID"
          :key="item.ID"
          @click="$emit('choose-answer', item)"
          :style="item.SLI_CSS_CLASS"
        >
          {{ item.STITLE }}
        </li>
      </ul>
      <div v-else-if="question.SSHOW_TYPE === 'select'">
        <b-form-select
          v-model="selected"
          :options="selectOptions"
          @change="onSelectChange"
          size="sm"
          class="mt-3"
        ></b-form-select>
      </div>
      <form
        v-else-if="question.SSHOW_TYPE === 'STRING'"
        @submit.prevent="onSubmitValue"
      >
        <input autoFocus type="text" v-model="inputValue" />
        <a class="next-button" @click="onSubmitValue"> Далее </a>
      </form>
      <form
        v-else-if="question.SSHOW_TYPE === 'NUMBER'"
        @submit.prevent="onSubmitValue"
      >
        <input autoFocus type="number" v-model="inputValue" />
        <a class="next-button" @click="onSubmitValue"> Далее </a>
      </form>
      <div v-else-if="question.SSHOW_TYPE === 'SYSTEM_END'" />
      <div v-else>
        Отображения вопроса SSHOW_TYPE = "{{ question.SSHOW_TYPE }}" не
        реализовано
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["question", "answers"],
  data() {
    return {
      inputValue: "",
      selected: null,
    };
  },
  computed: {
    selectOptions() {
      return this.answers.map(({ ID: value, STITLE: text }) => ({
        value,
        text,
      }));
    },
  },
  methods: {
    onSelectChange(id) {
      const answer = this.answers.find((item) => item.ID === id);
      this.$emit("choose-answer", answer);
    },
    onSubmitValue() {
      const answer = this.answers[0];
      answer.STITLE = this.inputValue;
      answer.SVALUE_VALUE = this.inputValue;
      this.$emit("choose-answer", answer);
    },
  },
  created() {
    this.inputValue = "";
  },
};
</script>
<style scoped>
@import url("./calculator.css");
</style>
