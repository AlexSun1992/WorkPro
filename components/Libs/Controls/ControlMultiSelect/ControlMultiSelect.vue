<template>
  <div>
    <span v-html="data.label" />
    <div class="position">
      <div class="item" v-for="item in data.options" :key="item.ID">
        <ControlMultiItem
          :item="item"
          :value="
            activeInputs.length > 1
              ? activeInputs.find((el) => el === item.ID)
              : null
          "
          @update="updateValue($event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ControlMultiItem from "./ControlMultiItem.vue";

export default {
  name: "ControlMultiSelect",
  components: { ControlMultiItem },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      createData: [],
    };
  },

  computed: {
    activeInputs() {
      if (typeof this.data?.value === "string") {
        return JSON.parse(this.data?.value);
      }
      if (typeof this.data?.value === "object") {
        return this.data?.value;
      }
      return {};
    },
    label() {
      return `${this.data.label}`;
    },
  },
  methods: {
    updateValue(e) {
      const index = this.createData.findIndex((item) => item.id === e.id);

      if (index !== -1 && !e.isActive) {
        this.createData.splice(index, 1);
      } else {
        this.createData.push({ id: e.id, isActive: e.isActive });
      }

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value: JSON.stringify(this.createData.map((el) => el.id)),
      });
    },
  },
};
</script>
<style scoped>
.position {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
.item {
  border-radius: 30px;
  background-color: #f2f4f5;
  padding: 16px;
  display: grid;
  align-items: center;
}
@media (max-width: 778px) {
  .position {
    grid-template-columns: 100%;
  }
}
</style>
