<template>
  <span>{{ prettyTime | prettify }}</span>
</template>
<script>
export default {
  name: "VerifyTimer",
  data: function () {
    return {
      isRunning: false,
      minutes: 0,
      secondes: 0,
      timer: null,
      time: null,
    };
  },
  props: {
    duration: {
      type: Number,
      required: false,
      default: () => 10,
    },
  },
  methods: {
    startTimer(duration) {
      this.time = duration;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          clearInterval(this.timer);
          this.$emit("onFinish");
        }
      }, 1000);
    },
  },
  filters: {
    prettify: function (value) {
      let secondes = value;
      if (secondes < 10) {
        secondes = `0${  secondes}`;
      }
      return secondes;
    },
  },
  watch: {
    duration: function (val) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.startTimer(val);
    },
  },
  computed: {
    prettyTime() {
      const time = this.time / 60;
      const secondes = Math.round(time * 60);
      return secondes;
    },
  },
  created() {
    this.startTimer(this.duration);
  },
};
</script>
