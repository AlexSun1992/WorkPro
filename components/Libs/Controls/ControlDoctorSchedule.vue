<template>
  <div>
    <div v-for="item in options" :key="item.id">
      <p>Врач: {{ item.SPERSON }}</p>
      <p>Время приема и специалист:{{ item.SNAME }}</p>
      <p>
        Время начала приема:
        {{ new Intl.DateTimeFormat("ru-RU").format(new Date(item.DDATE)) }}
      </p>
      <p>ADDRESS:{{ item.SADDRESS }}</p>
      <p>ЛПУ:{{ item.FKIDLPU }}</p>
      <div v-for="elem in item.STIMELIST" :key="elem.id">
        <b-button @click="chooseTimeToVisit(elem, item)">
          {{ elem.DFROM }}
        </b-button>
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

  async created() {
    await this.$store.dispatch("blocks/fetchBlock", {
      id: this.data.menudic,
      query: this.$store.getters["data_card/getFiltersAllFields"],
    });
  },

  methods: {
    chooseTimeToVisit(elem, item) {
      const copyValue = Object.assign({}, item, elem);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { value: copyValue },
      });
    },
  },
};
</script>

<style scoped></style>
