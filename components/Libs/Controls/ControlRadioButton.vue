<template>
  <div>
    <ul>
      <li v-for="item in getData.options" :key="item.value">
        <input
          type="radio"
          :id="item.value"
          :value="item.value"
          name="ControlRadioButton"
          v-model="id"
          @change="update(id, item.text)"
          :checked="item.text == 'Без ограничения'"
        />
        <label
          :for="item.value"
          :class="{
            active:
              item.value === id ||
              (item.text === 'Без ограничения' && activeClass === true),
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
      id: null,
      activeClass: true,
    };
  },
  mounted() {
    this.activeClass = true;
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
      this.activeClass = false;
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: String(value),
      });
    },
  },
  computed: {
    getData() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        this.data.fieldId
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
