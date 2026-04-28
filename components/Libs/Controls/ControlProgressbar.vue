<template>
  <div>
    <p>Заполните профиль</p>
  </div>
</template>

<script>
export default {
  name: "ControlProgressbar",
  props: ["profileFullness"],

  data() {
    return {
      value: 0,
      max: 100,
    };
  },

  methods: {
    randomValue() {
      this.value = Math.random() * this.max;
    },
  },

  computed: {
    percent() {
      if (this.profileFullness && this.profileFullness[0]) {
        return this.profileFullness[0]._data[0].NPROFILEFULLNESS;
      }
      return 0;
    },
  },

  mounted() {
    this.value = this.percent;
  },
};
</script>

<style scoped></style>
