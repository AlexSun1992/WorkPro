<template>
  <div>
    <div
      v-if="data.label"
      v-html="data.label"
      class="mb-3"
    />
    <div :class="wrapClass">
      <div
        class="item"
        v-for="item in data.options"
        :key="item.ID"
      >
        <ControlMultiItem
          :item="item"
          :value="activeInputs.length > 0 ? activeInputs.find((el) => el === item.ID) : null"
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
    },
  },

  data() {
    return {
      createData: [],
    };
  },
  mounted() {
    this.createData = this.activeInputs.map((el) => ({ id: el, isActive: true }));
  },

  computed: {
    activeInputs() {
      if (typeof this.data?.value === "string") {
        return JSON.parse(this.data?.value);
      }
      if (typeof this.data?.value === "object") {
        return this.data?.value;
      }
      return [];
    },
    label() {
      return `${this.data.label}`;
    },
    relations() {
      return this.data.options.map((el) => el.RELATIONS[0]).filter((item) => item !== undefined && item !== null);
    },
    wrapClass() {
      return {
        position: true,
        readonly: this.data.readonly,
        [this.data.options[0].STYLE]: Boolean(this.data.options?.[0]?.STYLE),
      };
    },
  },
  methods: {
    updateValue(event) {
      const relationsIdList = this.relations.find((el) => el?.nvalue === event.id)?.relation_value || [];

      if (relationsIdList.length > 0) {
        this.createData = this.createData.filter((item) => !relationsIdList.includes(item.id) || item.id === event.id);
      }

      const index = this.createData.findIndex((item) => item.id === event.id);

      if (index !== -1 && !event.isActive) {
        this.createData.splice(index, 1);
      } else if (event.isActive) {
        const existingItem = this.createData.find((item) => item.id === event.id);
        if (existingItem) {
          Object.assign(existingItem, { isActive: event.isActive });
        } else {
          this.createData.push({ id: event.id, isActive: event.isActive });
        }
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
.position.vis-checkbox,
.position.vis2 {
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 20px;
}

.item {
  border-radius: 30px;
  background-color: #f2f4f5;
  padding: 16px;
  display: grid;
  align-items: center;
}
.vis-checkbox .item {
  padding: 0;
  background: transparent;
}
.vis2 .item {
  background-color: #f2f4f5;
  padding: 16px 24px;
}
a {
  color: red;
}

@media (max-width: 1240px) {
  .position {
    grid-template-columns: 100%;
  }
}
@media (max-width: 768px) {
  .vis2 .item {
    padding: 16px;
  }
}
</style>
