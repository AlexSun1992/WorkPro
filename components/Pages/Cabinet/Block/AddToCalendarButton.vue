<template>
  <b-button @click="addDataToCalendar">{{ title }}</b-button>
</template>
<script>
import Vue from "vue";
import ICS from "vue-ics";
Vue.use(ICS);
export default {
  name: "AddToCalendarButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    title: {
      type: String,
      required: true,
      default: () => "",
    },
    id: {
      type: Number,
      required: true,
      default: () => null,
    },
  },

  methods: {
    addDataToCalendar() {
      for (let i = 0; i < this.data.list.items.length; i++) {
        if (this.data.list.items[i].ID === this.id) {
          this.$ics.addEvent(
            "RUS",
            `${this.data.list.items[i].ACTIVENAME}`,
            `${this.data.list.items[i].SFULLNAME}`,
            `${this.data.list.items[i].SLPU}`,
            `${this.data.list.items[i].DDATE}`,
            `${this.data.list.items[i].DDATE}`
          );
          const currentCulendar = this.$ics.calendar();
          this.$ics.download(currentCulendar);
        }
      }
    },
  },
};
</script>
