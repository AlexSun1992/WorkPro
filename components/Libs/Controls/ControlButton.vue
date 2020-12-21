<template>
  <b-button
    v-if="action"
    @click="$emit('update', action)"
    class="button"
    variant="secondary"
    >{{ action.SNAME }}</b-button
  >
</template>

<script>
export default {
  name: "ControlButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    action: {
      get: function () {
        const contractId = this.data.name.split("Item")[1];
        const actions = this.$store.getters["menu/getMenuById"](
          this.$route.params.idItem
        )?.ACTIONSCUR;
        if (!actions) return;
        return actions.find((item) => item.ID == contractId);
      },
    },
  },
};
</script>
