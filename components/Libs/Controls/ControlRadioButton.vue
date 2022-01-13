<template>
  <div>
    <ul>
      <li v-for="item in getData.options" :key="item.value">
        <input
          type="radio"
          :id="item.value"
          :value="item.text"
          name="contact"
          v-model="driverType"
        />
        <label :for="item.value">{{ item.text }}</label>
      </li>
    </ul>
    <div v-for="item in getData.options" :key="item.value">
      <div
        v-if="item.text === driverType"
        :class="{ active: item.text === driverType }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      parametr: true,
      driverType: "",
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {},
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
  width: 300px;
  height: 150px;
  border: 1px solid black;
  text-align: center;
  line-height: 150px;
}
</style>
