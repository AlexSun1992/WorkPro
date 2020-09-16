<template>
  <div>
    <div class="calc-action-title">
      {{ question.name }}
    </div>
    <div class="calc-action">
      <div class="calc-select-label">
        {{ question.properties.sdop_info }}
      </div>
      <ul class="select-items">
        <li
          v-for="item in answers"
          :value="item.id"
          :key="item.id"
          @click="$emit('choose-answer', item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <!-- {answers} -->
    </div>
  </div>
</template>
<script>
export default {
  props: ["question", "answers"]
};
</script>
