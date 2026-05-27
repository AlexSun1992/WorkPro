<template>
  <form-group
    :label="data.label"
    :label-for="data.name"
    class="mb-3"
  >
    <template #label><span v-html="data.label"></span></template>
    <div class="money-label-comp">
      <span style="font-size: 24px"
        ><b>{{ countMoneyOne }}</b></span
      ><span style="font-size: 16px; color: black">,{{ countMoneyTwo }}</span>
    </div>
  </form-group>
</template>

<script>
import { computed } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlLabelMoney",
  components: { FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  setup(props) {
    const countMoneyOne = computed(() => ("value" in props.data ? props.data?.value?.split(".")[0] : null));

    const countMoneyTwo = computed(() => ("value" in props.data ? props.data?.value?.split(".")[1] : null));

    return {
      countMoneyOne,
      countMoneyTwo,
    };
  },
};
</script>

<style scoped>
.money-label-comp {
  color: #0d441e;
}
</style>
