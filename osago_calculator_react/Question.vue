<template>
  <div>
    <div className="calc-action-title">
      {{ question.name }}
    </div>
    <div className="calc-action">
      <div className="calc-select-label">
        {{ question.properties.sdop_info }}
      </div>
      <!-- {answers} -->
    </div>
  </div>
</template>
<script>
export default {
  props: ["question"]
};
</script>
