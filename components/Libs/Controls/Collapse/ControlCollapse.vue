<template>
  <div>
    <button
      ref="conversations"
      :class="
        hideComponents
          ? 'btn-link btn-collapse'
          : 'btn-link btn-collapse collapsed'
      "
      @click="toggleComponent()"
    >
      <span v-if="hideComponents">Развернуть</span>
      <span v-else>Свернуть</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlCollapse",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      hideComponents: false,
    };
  },
  mounted() {
    this.updateData();
  },
  methods: {
    updateData() {
      this.hideComponents = !this.hideComponents;

      this.$store.commit("data_card/toggleComponents", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.hideComponents,
        components: this.data.value,
      });

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
    toggleComponent() {
      this.updateData();
      if (this.hideComponents) {
        this.$nextTick(() => {
          const scrollHeight = this.$refs.conversations;
          window.scrollTo(0, scrollHeight);
        });
      }
    },
  },
};
</script>

<style scoped></style>
