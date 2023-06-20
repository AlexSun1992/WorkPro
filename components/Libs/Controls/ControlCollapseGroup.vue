<template>
  <div>
    <button type="button" @click="test()" class="button">Фильтры поиска</button>
  </div>
</template>

<script>
export default {
  name: "ControlCollapseGroup",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    groupNumber: {
      type: Number,
      required: false,
      default: () => 0,
    },
  },
  data() {
    return {
      clicked: true,
    };
  },
  methods: {
    test() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.clicked,
      });
    },
  },
};
</script>

<style>
.button {
  display: block;
}
</style>
