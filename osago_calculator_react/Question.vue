<template>
  <div>
    <div class="calc-action-title">
      {{ question.name }}
    </div>
    <div class="calc-action">
      <div class="calc-select-label">
        {{ question.properties.sdop_info }}
      </div>
      <ul
        v-if="question.properties.sshow_type === 'choice'"
        class="select-items"
      >
        <li
          v-for="item in answers"
          :value="item.id"
          :key="item.id"
          @click="$emit('choose-answer', item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div v-else-if="question.properties.sshow_type === 'select'">
        <b-form-select
          v-model="selected"
          :options="selectOptions"
          @change="onSelectChange"
          size="sm"
          class="mt-3"
        ></b-form-select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["question", "answers"],
  computed: {
    selectOptions() {
      return this.answers.map(({ id: value, name: text }) => ({ value, text }));
    }
  },
  methods: {
    onSelectChange(id) {
      const answer = this.answers.find(item => item.id === id);
      this.$emit("choose-answer", answer);
    }
  },
  data() {
    return {
      selected: null
    };
  }
};
</script>
