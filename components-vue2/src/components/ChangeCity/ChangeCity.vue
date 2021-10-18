<template>
  <div>
    <div>
      ваш город: Москва
      {{ data }}
    </div>
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
  async created() {
    const url = "https://new.reso.ru/am/free/v2/data/55/800/0/0";
    let response = await fetch(url);
    this.data = await response.json();
    // let data = await response.json();
    // this.data = data;
  },
};
</script>

<style lang="scss" scoped></style>
