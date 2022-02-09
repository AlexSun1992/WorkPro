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
      required: false,
      default: () => "",
    },
  },
  methods: {
    addDataToCalendar() {
      //   console.log(this.$ics);
      //   console.log(this.$ics.calendar());
      console.log(this.data.list.items);
      //   this.$ics.addEvent(
      //     "RUS",
      //     `${this.data.list.items[0].ACTIVENAME}`,
      //     `${this.data.list.items[0].SFULLNAME}`,
      //     `${this.data.list.items[0].SLPU}`,
      //     `${this.data.list.items[0].DDATE}`,
      //     `${this.data.list.items[0].DDATE}`
      //   );
      //   console.log(this.$ics.calendar());

      for (let i = 0; i < this.data.list.items.length; i++) {
        console.log(this.data.list.items[i]);
      }

      this.$ics.removeAllEvents();
    },
  },
};
</script>
