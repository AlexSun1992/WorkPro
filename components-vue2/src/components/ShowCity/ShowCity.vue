<template>
  <div>
    <span v-model="data">
      {{ changedCity() }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ChangeCity",
  data() {
    return {
      data: [],
    };
  },
  methods: {
    async changedCity() {
      const url = "/am/free/v2/data/55/800/0/0";
      let response = await fetch(url);
      let data = await response.json();
      let currentCity = data[0]._data[0].TOWN;
      this.data = currentCity;
      console.log();
      return this.data;
    },
    async cityesList() {},
  },
};
</script>

<style lang="scss" scoped></style>
