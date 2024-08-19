<template>
  <div>
    <div class="recording-date">
      <button
        @click="prewElement()"
        class="prev-date-recording"
        :class="{ active: isPrewButtonActive }"
      ></button>

      <div v-for="item in getGroupDate" :key="item">
        <div
          class="doc-date"
          :class="{ active: getActiveDate === item }"
          @click="openListRegistrationTimes(item)"
        >
          {{ formattedDate(item) }}
        </div>
      </div>
      <button
        @click="nextElement()"
        class="next-date-recording"
        :class="{ active: isNextButtonActive }"
      ></button>
    </div>
    <div class="recording_blk">
      <div class="recording time">
        <div v-for="elem in allTimes" :key="elem.id" class="doc-time">
          <button
            class="btn-doc-time"
            :class="{ active: selectedTime === elem.DFROM }"
            @click="chooseTimeToVisit(elem)"
          >
            {{ elem.DFROM }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formattedDate } from "./DoctorSchedule.helpers";

export default {
  name: "DateDoctorShedule",
  props: {
    allDate: {
      type: Array,
      required: true,
      default: () => [],
    },
    allTimes: {
      type: Array,
      required: true,
      default: () => [],
    },
    datesToShow: {
      type: Number,
      required: true,
      default: 3,
    },
    selectedTime: {
      type: String,
      required: true,
      default: "",
    },

    selectedDate: {
      type: String,
      required: true,
      default: "",
    },
    idDoctor: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      activeDate: "",
      isShowPrewButton: false,
      isShowNextButton: false,
      firstIndex: 0,
      lastIndex: 0,
      indexDate: 0,
    };
  },
  emits: ["update"],
  mounted() {
    this.firstIndex = 0;
    this.lastIndex = this.datesToShow - 1;
    this.isShowNextButton = true;

    this.chooseTimeToVisit(null);
  },
  computed: {
    isNextButtonActive() {
      let isShowNext = this.isShowNextButton;
      if (this.allDate.length <= this.datesToShow) {
        isShowNext = false;
      }
      return isShowNext;
    },
    isPrewButtonActive() {
      let isShowPrew = this.isShowPrewButton;
      if (this.allDate.length <= this.datesToShow) {
        isShowPrew = false;
      }
      return isShowPrew;
    },
    getActiveDate() {
      return this.selectedDate || this.getGroupDate[0];
    },
    getLastIndex() {
      let lastInd = this.lastIndex;
      if (lastInd > this.allDate.length - 1) {
        lastInd = this.allDate.length - 1;
      }
      return lastInd;
    },
    getFirstIndex() {
      let firstInd = this.firstIndex;
      if (firstInd > this.allDate.length - 1) {
        firstInd = this.getLastIndex - (this.datesToShow - 1);
      }
      return firstInd;
    },
    getGroupDate() {
      const subarray = this.allDate.filter(
        (date, index) =>
          index >= this.getFirstIndex && index <= this.getLastIndex
      );
      return subarray;
    },
  },
  methods: {
    prewElement() {
      this.firstIndex -= this.datesToShow;
      this.lastIndex -= this.datesToShow;

      if (this.firstIndex < 0) {
        this.firstIndex = 0;
        this.isShowNextButton = true;
        this.isShowPrewButton = false;
      }
      if (this.lastIndex - this.firstIndex !== this.datesToShow) {
        this.lastIndex = this.firstIndex + (this.datesToShow - 1);
      }
      if (this.lastIndex !== this.allDate.length - 1) {
        this.isShowNextButton = true;
      }
      if (this.firstIndex === 0) {
        this.isShowPrewButton = false;
      }
      this.activeDate = this.getGroupDate[this.indexDate];
      this.chooseTimeToVisit(null);
    },
    nextElement() {
      this.activeIndex += 1;
      this.firstIndex += this.datesToShow;
      this.lastIndex += this.firstIndex;

      if (this.lastIndex > this.allDate.length - 1) {
        this.lastIndex = this.allDate.length - 1;
        this.isShowNextButton = false;
        this.isShowPrewButton = true;
      }
      if (this.lastIndex - this.firstIndex !== this.datesToShow - 1) {
        this.firstIndex = this.lastIndex - (this.datesToShow - 1);
      }
      if (this.firstIndex !== 0) {
        this.isShowPrewButton = true;
      }
      if (this.lastIndex === this.allDate.length - 1) {
        this.isShowNextButton = false;
      }

      this.activeDate = this.getGroupDate[this.indexDate];
      this.chooseTimeToVisit(null);
    },

    openListRegistrationTimes(data) {
      this.activeDate = data;

      this.chooseTimeToVisit(null);
    },

    formattedDate(dateString) {
      return formattedDate(dateString);
    },
    chooseTimeToVisit(time) {
      const createData = {
        DDATE: this.activeDate || this.getGroupDate[0],
        ...time,
        ID: this.idDoctor,
      };
      this.$emit("updateActiveSchedule", createData);
    },
  },
  watch: {
    idDoctor(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.firstIndex = 0;
        this.lastIndex = this.datesToShow - 1;
        this.isShowPrewButton = false;
        this.isShowNextButton = true;
      }
    },
  },
};
</script>

<style scoped>
.slider-show {
  display: block;
}
.slider-hide {
  display: none;
}

.doc-date {
  text-align: right;
  font-family: "Raleway";
  grid-area: date;
  font-style: normal;
  font-weight: 700;
  font-size: 1.25rem;
  font-feature-settings: "pnum" on, "lnum" on;
  color: #009639;
}

.doc-date.active {
  color: #686868;
}

.recording_blk {
  height: calc(100% - 43px);
  background: #f2f4f5;
  border-radius: 0 0 20px 20px;
  padding: 16px 10px;
}
.recording.time {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
  grid-template-rows: 40px;
}
.doc-time {
}
.btn-doc-time {
  background: #edf8ea;
  border: 1px solid #009639;
  border-radius: 15px;
  padding: 11px 0px;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  color: #009639;
  width: 100%;
  display: block;
  text-align: center;
}

.doc-date {
  border-radius: 20px 20px 0 0;
  padding: 8px 10px;
  text-align: center;
  color: #000000;
  font-weight: 500;
  font-size: 1.125rem;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.recording-date > * {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.doc-date:hover,
.doc-date.active {
  background: #f2f4f5;
  color: #009639;
}

.recording-date {
  display: grid;
  grid-template-columns: 20px 1fr 1fr 1fr 1fr 15px;
  grid-gap: 10px;
  position: relative;
}
.btn-doc-time.active,
.btn-doc-time:hover {
  background: #009639;
  color: #fff;
}
.prev-date-recording,
.next-date-recording {
  border: 0;
  background: transparent;
  position: relative;
  font-size: 0;
  pointer-events: none;
}
.next-date-recording {
  position: absolute;
  width: 20px;
  height: 37px;
  right: -3px;
}
.prev-date-recording.active,
.next-date-recording.active {
  cursor: pointer;
  pointer-events: painted;
}
.prev-date-recording:after,
.next-date-recording:after {
  width: 12px;
  height: 12px;
  border-top: 3px solid #aaa;
  border-left: 3px solid #aaa;
  position: absolute;
  top: 17px;
  left: 0;
  content: "";
  transform: rotate(135deg);
  pointer-events: none;
}
.prev-date-recording:after {
  transform: rotate(-45deg);
  left: 7px;
}
.prev-date-recording.active:after,
.next-date-recording.active:after {
  border-top: 3px solid #000;
  border-left: 3px solid #000;
}
</style>
