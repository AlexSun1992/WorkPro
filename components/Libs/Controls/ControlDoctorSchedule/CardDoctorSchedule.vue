<template>
  <div :class="['docs-searching-results mb-4', options.LSHORT ? 'vis-short' : '']">
    <div
      v-if="!options.LSHORT"
      class="mb-3 mb-lg-0"
    >
      <div class="doc-expert">
        {{ options.STITLE }}
      </div>
      <div class="doc-name">
        {{ options.SNAME }}
      </div>
      <div class="doc-location">
        {{ options.SDESCRIPTION }}
      </div>
      <div class="doc-adress">
        <i class="my-location" />
        {{ options.SADDRESS }}
        <br />
        <span
          v-for="station in options.SMETRO"
          :key="station.SNAME"
        >
          <span
            v-for="(line, index) in station.SUNDERLINE.sline || []"
            :key="index"
            :data-line="line"
            :class="`undeground-color_${station.SUNDERLINE.idline[index]}`"
          ></span>
          {{ station.SNAME }}
        </span>
      </div>
    </div>
    <DateDoctorShedule
      @updateActiveSchedule="updateActiveSchedule($event)"
      :selectedTime="activeTime"
      :selectedDate="schedule.DDATE"
      :allTimes="getTimesData"
      :allDate="getAllDate"
      :id="options.ID"
    />
    <div></div>
    <div class="mt-3 mt-lg-0">
      <button
        v-if="showButton"
        class="mt-3 btn-primary"
        @click="sendData"
      >
        Записаться
      </button>
    </div>
  </div>
</template>
<script>
import DateDoctorShedule from "./DateDoctorShedule";

export default {
  name: "CardDoctorShedule",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
    dataTimeToVisit: {
      type: Object,
      default: () => {},
    },
  },
  components: { DateDoctorShedule },

  data() {
    return {
      schedule: {},
      datesToShow: 4,
    };
  },
  methods: {
    updateActiveSchedule(schedule) {
      this.schedule = schedule;
      const createData = { ...this.options, ...schedule };
      delete createData.SDATETIMELIST;
      this.$emit("updateActiveSchedule", createData);
    },
    sendData() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: {
            ...this.dataTimeToVisit,
          },
        },
      });
    },
  },
  computed: {
    getActiveDate() {
      return this.schedule.DDATE || this.options.SDATETIMELIST[0].DDATE;
    },
    getTimesData() {
      return this.options.SDATETIMELIST?.find((el) => el.DDATE === this.getActiveDate)?.STIMELIST;
    },
    getAllDate() {
      return this.options.SDATETIMELIST?.map((el) => el.DDATE);
    },
    activeTime() {
      return this.options.ID === this.dataTimeToVisit.ID ? this.dataTimeToVisit.DFROM : "";
    },
    showButton() {
      return this.options.ID === this.dataTimeToVisit.ID && this.dataTimeToVisit.DDATE && this.dataTimeToVisit.DFROM;
    },
    currentWidth() {
      return window.innerWidth;
    },
  },
  watch: {
    options(oldVal, newVal) {
      if (oldVal.ID !== newVal.ID) {
        this.schedule.DDATE = "";
      }
    },
  },
};
</script>

<style scoped>
.doc-expert {
  grid-area: doc;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 1.25rem;
}

.doc-name {
  grid-area: name;
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 24px;
  margin-top: 10px;
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

.doc-location {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 32px;
  margin-top: 40px;
  grid-area: lpu;
}

.doc-adress {
  grid-area: adress;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 32px;
  color: #292929;
  position: relative;
  padding-left: 24px;
}

.recording.time {
  grid-area: time;
}

.doc-time {
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
}

.btn-doc-time {
  background: #edf8ea;
  border-radius: 15px;
  padding: 22px 20px;
  border: 0;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  color: #009639;
  min-width: 84px;
  text-align: center;
}

.doc-adress .my-location {
  position: absolute;
  top: 22px;
  left: -3px;
}

span[data-line],
span[class*="undeground-color"] {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
}
span[data-line]:after,
span[class*="undeground-color"]:after {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  content: "";
  top: 50%;
  margin-top: -6px;
  left: 0;
}

.undeground-color_36:after,
[data-line="Солнцевская линия"]:after {
  background-color: #ffcd1c;
}
.undeground-color_25:after,
[data-line="Люблинско-Дмитровская линия"]:after {
  background-color: #bed12c;
}

.undeground-color_37:after,
[data-line="Некрасовская линия"]:after {
  background-color: #cc0066;
}
.undeground-color_33:after,
[data-line="Кожуховская линия"]:after {
  background-color: #cc0066;
}

.undeground-color_26:after,
[data-line="Кольцевая линия"]:after {
  background-color: #915133;
}
.undeground-color_18:after,
[data-line="Калужско-Рижская линия"]:after {
  background-color: #ff7f00;
}
.undeground-color_24:after,
[data-line="Таганско-Краснопресненская линия"]:after {
  background-color: #92007b;
}
.undeground-color_43:after,
[data-line="МЦД-3"]:after {
  background-color: #ea5b04;
}
.undeground-color_44:after,
[data-line="МЦД-4"]:after {
  background-color: #00cc66;
}
.undeground-color_45:after,
[data-line="Троицкая линия"]:after {
  background-color: #03795f;
}
.undeground-color_42:after,
[data-line="МЦД-2"]:after {
  background-color: #ff009f;
}
.undeground-color_35:after,
[data-line="Большая кольцевая линия"]:after {
  background-color: #ffa8af;
}
.undeground-color_40:after,
[data-line="МЦК"]:after {
  background-color: #f9bcd1;
}
.undeground-color_41:after,
[data-line="МЦД-1"]:after {
  background-color: #ff6000;
}
.undeground-color_17:after,
[data-line="Серпуховско-Тимирязевская линия"]:after {
  background-color: #a2a5b4;
}
.undeground-color_13:after,
[data-line="Каховская линия"]:after {
  background-color: #29b1a6;
}
.undeground-color_21:after,
[data-line="Замоскворецкая линия"]:after {
  background-color: #0a6f20;
}
.undeground-color_10:after,
[data-line="Калининская линия"]:after {
  background-color: #ffdd03;
}
.undeground-color_9:after,
[data-line="Бутовская линия"]:after {
  background-color: #b2dae7;
}
.undeground-color_27:after,
[data-line="Сокольническая линия"]:after {
  background-color: #cc0000;
}
.undeground-color_15:after,
[data-line="Филевская линия"]:after {
  background-color: #0099cc;
}
.undeground-color_19:after,
[data-line="Арбатско-Покровская линия"]:after {
  background-color: #003399;
}
.undeground-color_11:after,
[data-line="Кировско-Выборгская линия"]:after {
  background-color: #cc0000;
}
.undeground-color_22:after,
[data-line="Невско-Василеостровская линия"]:after {
  background-color: #038f53;
}
.undeground-color_20:after,
[data-line="Фрунзенско-Приморская линия"]:after {
  background-color: #73057d;
}
.undeground-color_20:after,
[data-line="Фрунзенско-Приморская линия"]:after {
  background-color: #73057d;
}

.undeground-color_12:after,
[data-line="Правобережная линия"]:after {
  background-color: #ff7f00;
}

.undeground-color_16:after,
[data-line="Московско-Петроградская линия"]:after {
  background-color: #0099cc;
}
.undeground-color_28:after,
[data-line="Центральная линия"]:after {
  background-color: #ff0000;
}

.undeground-color_29:after,
[data-line="Автозаводская линия"]:after {
  background-color: #ff0000;
}
.undeground-color_30:after,
[data-line="Сормовская линия"]:after {
  background-color: #0000ff;
}

.undeground-color_31:after,
[data-line="Дзержинская линия"]:after {
  background-color: #008000;
}

.undeground-color_32:after,
[data-line="Ленинская линия"]:after {
  background-color: #c00000;
}

.undeground-color_38:after,
[data-line="Первая линия"]:after {
  background-color: #ffa8af;
}
.undeground-color_39:after {
  background-color: #007a3d;
}

@media (max-width: 992px) {
  .docs-searching-results {
    padding: 16px;
    grid-template-areas:
      "doc" "date"
      "name"
      "lpu"
      "adress"
      "time";
    grid-template-columns: 100%;
  }

  .doc-expert {
    font-weight: 600;
    font-size: 1rem;
  }

  .doc-name {
    font-weight: 400;
    font-size: 0.875rem;
    color: #686868;
    line-height: 1.2;
  }

  .doc-date {
    text-align: left;
    font-weight: 700;
    font-size: 0.875rem;
    color: #292929;
  }

  .doc-location {
    font-weight: 700;
    font-size: 0.875rem;
    margin-top: 20px;
    line-height: 1.2;
  }

  .doc-adress {
    font-size: 1rem;
    line-height: 1.2;
    margin-top: 10px;
  }

  .recording.time {
    grid-area: time;
  }

  .doc-time {
    display: inline-block;
    margin-right: 16px;
    margin-top: 16px;
  }

  .btn-doc-time {
    background: #edf8ea;
    border-radius: 15px;
    padding: 15px 12px;
    font-size: 0.875rem;
    min-width: 62px;
  }

  .doc-adress .my-location {
    top: 15px;
  }

  span[class*="undeground-color"] {
    height: 20px;
  }

  span[class*="undeground-color"]:after {
    margin-top: -1px;
  }
}

.docs-searching-results {
  border: 1px solid #eff1f3;
  border-radius: 16px;
  padding: 24px 20px;
  display: grid;
  grid-template-columns: 45% 53%;
  grid-column-gap: 2%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  background: #fff;
}

.vis-short {
  grid-template-columns: 100%;
}

@media (max-width: 992px) {
  .docs-searching-results {
    grid-template-columns: 100%;
    grid-gap: 0;
  }
}
</style>
