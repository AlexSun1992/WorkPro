<template>
  <div>
    <div v-for="item in options" :key="item.id" class="wrapper">
      <p>Врач: {{ item.SPERSON }}</p>
      <p>Время приема и специалист:{{ item.SNAME }}</p>
      <p>Время начала приема:{{ item.SDATETIME }}</p>
      <p>DDATE:{{ item.DDATE }}</p>
      <p>ЛПУ:{{ item.FKIDLPU }}</p>
      <div v-for="elem in item.STIMELIST" :key="elem.id">
        <button @click="test">C {{ elem.DFROM }}</button>
        <button @click="test">До {{ elem.DTO }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlDoctorSchedule",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  async created() {
    await this.$store.dispatch("blocks/fetchBlock", {
      id: this.data.menudic,
      query: this.$store.getters["data_card/getFiltersAllFields"],
    });
  },

  computed: {
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    options: {
      get() {
        return this.dataContent.items || [];
      },
    },
  },
  methods: {
    // async press() {
    //   await this.$store.dispatch("blocks/fetchBlock", {
    //     id: this.data.menudic,
    //     query: this.$store.getters["data_card/getFiltersAllFields"],
    //   });
    // },
    test() {
      console.log("test");
    },
  },
};
</script>

<style scoped>
.wrapper {
  box-shadow: 0 0 2px 2px black;
}
</style>
