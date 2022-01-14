<template>
  <div>
    <ul>
      <li v-for="item in getData.options" :key="item.value">
        <input
          type="radio"
          :id="item.value"
          :value="item.value"
          name="ControlRadioButton"
          v-model="Id"
          @change="update(Id)"
        />
        <label :for="item.value" :class="{ active: item.value === Id }">{{
          item.text
        }}</label>
      </li>
    </ul>
    <div v-for="item in getData.options" :key="item.value">
      <div
        v-if="item.value === Id"
        :class="{ active: item.value === Id }"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Id: null,
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
    getData() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        this.data.fieldId
      );
    },
  },
};
</script>

<style lang="less" scoped>
.active {
}
</style>
