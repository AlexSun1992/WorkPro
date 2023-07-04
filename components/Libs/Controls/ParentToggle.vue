<template>
  <div>
    <ControlToggle>Показать фильтры</ControlToggle>
    <ControlCollapse></ControlCollapse>
  </div>
</template>
<script>
import ControlToggle from "./ControlToggle.vue";
import ControlCollapse from "./ControlCollapse.vue";

export default {
  name: "ParentToggle",
  components: { ControlToggle, ControlCollapse },
};
</script>
