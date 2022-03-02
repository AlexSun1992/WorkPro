<template>
  <div>
    <ul>
      <li v-for="item in options" :key="item.value">
        <input
          type="radio"
          :id="item.value"
          :value="item.value"
          name="ControlRadioButton"
          v-model="id"
          @change="update(id)"
          :checked="item.value === id"
          :disabled="data.readonly === true"
        />
        <label
          :for="item.value"
          :class="{
            active: item.value == id,
          }"
          >{{ item.text }}</label
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.data.value,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    update(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: String(value),
      });
    },
  },
  computed: {
    options() {
      return this.data.options;
    },
  },
};
</script>

<style lang="less" scoped></style>
