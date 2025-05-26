<template>
  <b-form-group
    :label="data.label"
    :label-for="data.name"
    class="mb-3"
  >
    <template v-slot:label><span v-html="data.label"></span></template>
    <div class="money-label-comp">
      <span style="font-size: 24px"
        ><b>{{ countMoneyOne }}</b></span
      ><span style="font-size: 16px; color: black">,{{ countMoneyTwo }}</span>
    </div>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlLabel",
  components: { BFormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    countMoneyOne() {
      return "value" in this.data ? this.data?.value?.split(".")[0] : null;
    },
    countMoneyTwo() {
      return "value" in this.data ? this.data?.value?.split(".")[1] : null;
    },
  },
};
</script>

<style scoped>
.money-label-comp {
  color: #0d441e;
}
</style>
