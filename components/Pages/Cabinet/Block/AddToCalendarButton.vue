<template>
  <button type="button" class="btn btn-secondary" @click="addDataToCalendar">
    {{ title }}
  </button>
</template>
<script>
import { createEvent } from "ics";

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
      default: () => "",
    },
    eventLocation: {
      type: String,
      required: false,
      default: () => "",
    },
    eventDescription: {
      type: String,
      required: false,
      default: () => "",
    },
    eventSpecialist: {
      type: String,
      required: false,
      default: () => "",
    },
    eventBeginDate: {
      type: String,
      required: true,
      default: () => "",
    },
    eventFinishDate: {
      type: String,
      required: false,
      default: () => "",
    },
    eventBeginTime: {
      type: String,
      required: false,
      default: () => "",
    },
    eventFinishTime: {
      type: String,
      required: false,
      default: () => "",
    },
    eventState: {
      type: String,
      required: false,
      default: () => "",
    },
    eventDuration: {
      type: Object,
      required: false,
      default: () => "",
    },
  },

  created() {
    if (
      this.eventBeginTime !== "" &&
      !/^\d\d:\d\d$/.test(this.eventBeginTime) &&
      !/^\d:\d\d$/.test(this.eventBeginTime)
    ) {
      throw new Error(
        `Неверный формат времени, необходимо использовать формат 00:00`
      );
    }
    if (
      this.eventBeginDate !== "" &&
      !/^\d\d\d\d-\d\d-\d\d$/.test(this.eventBeginDate)
    ) {
      throw new Error(
        `Неверный формат времени, необходимо использовать формат 2022-02-28`
      );
    }
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
      const icsObject = createEvent(event, (error, value) => {
        if (error) {
          console.log(error);
          return;
        }
        return value;
      });

      const url = window.URL.createObjectURL(
        new Blob([icsObject], {
          type: "text/calendar;charset=utf-8",
        })
      );

      this.downLoadIcsCalendar(url);
    },

    downLoadIcsCalendar(urlAddress) {
      const link = document.createElement("a");
      link.href = urlAddress;
      link.setAttribute("download", "recieptData");
      document.body.appendChild(link);
      link.click();
    },
  },
  computed: {
    getEventStartData() {
      const dateTime = [
        ...this.eventBeginDate.split("-").map((item) => Number(item)),
        ...(this.eventBeginTime.split(":").map((item) => Number(item)) ?? []),
      ];
      return dateTime;
    },
  },
};
</script>
