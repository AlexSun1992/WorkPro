<template>
  <div>
    <button
      ref="buttonCollapse"
      :class="isHideComponents ? 'btn-link btn-collapse' : 'btn-link btn-collapse collapsed'"
      @click="toggleComponent()"
    >
      <span>{{ isHideComponents ? label[0] : label[1] }}</span>
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
      hideComponents: true,
      nameToggle: [],
      isInitialized: false,
    };
  },

  computed: {
    isHideComponents() {
      return this.hideComponents;
    },

    isDataShouldBeShown() {
      if ("value" in this.data) {
        const [openCollapse] = this.data.value;

        if (openCollapse === "Y") {
          return true;
        }
        return false;
      }

      return false;
    },
    label() {
      if (this.data.label) {
        if (this.data.label.split("/").length < 2) {
          return [this.data.label, this.data.label];
        }
      }
      return ["Развернуть", "Свернуть"];
    },
  },

  created() {
    if (this.isDataShouldBeShown) {
      this.hideComponents = !this.hideComponents;
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    }
  },

  methods: {
    toggleComponent() {
      this.hideComponents = !this.hideComponents;
      const copyVal = this.data.value.filter((el) => el !== "Y");
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: copyVal,
      });

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
