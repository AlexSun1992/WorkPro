<template>
  <span>{{ prettifiedTime }}</span>
</template>

<script>
export default {
  name: "VerifyTimer",
  props: {
    duration: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      isRunning: false,
      minutes: 0,
      secondes: 0,
      timer: null,
      time: null,
    };
  },
  computed: {
    prettyTime() {
      const time = this.time / 60;
      return Math.round(time * 60);
    },
    prettifiedTime() {
      const secondes = this.prettyTime;
      return secondes < 10 ? `0${secondes}` : secondes;
    },
  },
  watch: {
    duration(val) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.startTimer(val);
    },
  },
  created() {
    this.startTimer(this.duration);
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
};
</script>
