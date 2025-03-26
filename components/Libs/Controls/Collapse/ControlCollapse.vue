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
      <span>{{ isHideComponents ? nameToggle[0] : nameToggle[1] }}</span>
    </button>
  </div>
</template>

<script>
export default {
  //РазвернутьСвернуть
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
      hideComponents: true,
      nameToggle: [],
    };
  },
  created() {
    this.generateName();
  },
  computed: {
    hidedComponents() {
      return this.$store.getters["data_card/getHidedComponents"](
        this.data.value
      );
    },

    isHideComponents() {
      return this.hideComponents;
    },

    visibleComponents() {
      return this.$store.getters["data_card/getVisibleComponents"](
        this.data.value
      );
    },
  },
  methods: {
    generateName() {
      if (!this.data.label) {
        this.nameToggle = ["Развернуть", "Свернуть"];
        return;
      }
      this.nameToggle = this.data.label.split("/");
      if (this.nameToggle.length < 2) {
        this.nameToggle = [this.data.label, this.data.label];
      }
    },
    updateData() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
    toggleComponent() {
      this.updateData();
      this.hideComponents = !this.hideComponents;
      if (this.hideComponents === true) {
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
