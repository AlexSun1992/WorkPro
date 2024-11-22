<template>
  <div>
    <button
      ref="buttonCollapse"
      :class="
        isHideComponents
          ? 'btn-link btn-collapse'
          : 'btn-link btn-collapse collapsed'
      "
      @click="toggleComponent()"
    >
      <span v-if="isHideComponents">Развернуть</span>
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
    return {};
  },
  mounted() {
    this.updateData();
    if (!this.isHideComponents) {
      this.updateData();
    }
  },
  computed: {
    isHideComponents() {
      return this.$store.getters["data_card/isHideComponents"](this.data.value);
    },
  },
  methods: {
    updateData() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
    toggleComponent() {
      this.updateData();
      if (this.isHideComponents) {
        this.$nextTick(() => {
          this.$refs.buttonCollapse.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
    },
  },
};
</script>

<style scoped></style>
