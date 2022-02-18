<template>
  <b-button @click="addDataToCalendar">{{ title }}</b-button>
</template>
<script>
import { ics } from "./AddToCalendarButton";

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
    language: {
      type: String,
      required: false,
      default: () => null,
    },
    id: {
      type: Number,
      required: true,
      default: () => null,
    },
    eventTitle: {
      type: String,
      required: false,
      default: () => null,
    },
    eventLocation: {
      type: String,
      required: false,
      default: () => null,
    },
    eventDescription: {
      type: String,
      required: false,
      defulat: () => null,
    },
    eventSpecialist: {
      type: String,
      required: false,
      defulat: () => null,
    },
    eventBeginDate: {
      type: String,
      required: true,
      defulat: () => null,
    },
    eventFinishDate: {
      type: String,
      required: false,
      defulat: () => null,
    },
    eventBeginTime: {
      type: String,
      required: false,
      defulat: () => null,
    },
    eventFinishTime: {
      type: String,
      required: false,
      defulat: () => null,
    },
    eventState: {
      type: String,
      required: false,
      default: () => null,
    },
    eventDuration: {
      type: Object,
      required: false,
      default: () => null,
    },
  },

  methods: {
    addDataToCalendar() {
      const event = {
        start: this.getEventStartData,
        title: this.eventTitle,
        description: this.eventDescription,
        location: this.eventLocation,
        duration: this.eventDuration,
        attendees: [
          {
            name: this.eventSpecialist,
            role: this.eventTitle,
          },
        ],
      };
      ics.createEvent(event, (error, value) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(value);
      });
    },
  },
  computed: {
    getEventStartData() {
      let data = this.eventBeginDate.split("-").map((item) => Number(item));
      this.eventBeginTime.split(":").forEach((item) => {
        if (item !== "") {
          item.trim();
          data.push(parseInt(item, 10));
        }
      });
      return data;
    },
  },
};
</script>
