<template>
  <div class="docs-searching-results mb-4">
    <div class="mb-3 mb-lg-0">
      <div class="doc-expert">
        {{ options.SSPECIALISTNAME }}
      </div>
      <div class="doc-name">
        {{ options.SPERSON }}
      </div>
      <div class="doc-location">
        {{ options.FKIDLPU }}
      </div>
      <div class="doc-adress">
        <i class="my-location" />
        {{ options.SADDRESS }}
        <br />
        <span
          :data-line="options.SUNDERGROUND"
          :class="'undeground-color_' + options.IDUNDERLINE"
        ></span
        >{{ options.SUNDERGROUND }}
      </div>
    </div>
    <DateDoctorShedule
      @updateActiveSchedule="updateActiveSchedule($event)"
      :datesToShow="4"
      :selectedTime="activeTime"
      :selectedDate="schedule.DDATE"
      :allTimes="getTimesData"
      :allDate="getAllDate"
      :idDoctor="options.ID"
    />
    <div></div>
    <div class="mt-3 mt-lg-0">
      <button
        v-if="isShowButton"
        class="mt-3 btn-primary"
        @click="sendData()"
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
      required: true,
      default: () => {},
    },
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
    dataTimeToVisit: {
      type: Object,
      required: true,
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
    isShowButton() {
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

span[class*="undeground-color"] {
  display: inline-block;
  width: 0px;
  height: 12px;
  position: relative;
}

span[class*="undeground-color"]:after {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  content: "";
  top: 50%;
  margin-top: -6px;
  left: -21px;
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
.undeground-color_15:after,
.undeground-color_1:after,
.undeground-color_20:after,
.undeground-color_22:after,
.undeground-color_24:after,
.undeground-color_27:after,
.undeground-color_35:after,
[data-line="Сокольническая"]:after {
  background-color: #e42313;
}

.undeground-color_17:after,
.undeground-color_2:after,
.undeground-color_23:after,
.undeground-color_26:after,
[data-line="Замоскворецкая"]:after {
  background-color: #4fb04f;
}

.undeground-color_16:after,
.undeground-color_3:after,
.undeground-color_21,
[data-line="Арбатско-Покровская"]:after {
  background-color: #0072ba;
}

.undeground-color_4:after,
[data-line="Филёвская"]:after {
  background-color: #1ebcef;
}

.undeground-color_5:after,
[data-line="Кольцевая"]:after {
  background-color: #915133;
}

.undeground-color_18:after,
.undeground-color_6:after,
[data-line="Калужско-Рижская"]:after {
  background-color: #f07e24;
}

.undeground-color_19:after,
.undeground-color_7:after,
[data-line="Таганско-Краснопресненская"]:after {
  background-color: #943e90;
}

.undeground-color_8:after,
[data-line="Солнцевская"]:after {
  background-color: #ffcd1c;
}

.undeground-color_10:after,
[data-line="Серпуховско-Тимирязевская"]:after {
  background-color: #adacac;
}

.undeground-color_11:after,
[data-line="Люблинско-Дмитровская"]:after {
  background-color: #bed12c;
}

.undeground-color_13:after,
[data-line="Бутовская"]:after {
  background-color: #bac8e8;
}

.undeground-color_31:after,
[data-line="МЦК"]:after {
  background-color: #faebf0;
}

.undeground-color_32:after,
[data-line="Большая кольцевая линия"]:after {
  background-color: #79cdcd;
}

.undeground-color_33:after,
[data-line="Некрасовская"]:after {
  background-color: #de64a1;
}

.undeground-color_34:after,
[data-line="Троицкая"]:after {
  background-color: #03795f;
}

.undeground-color_36:after,
[data-line="Белорусско-Савеловский"]:after {
  background-color: #f6a700;
}

.undeground-color_37:after,
[data-line="Курско-Рижский"]:after {
  background-color: #ea4083;
}

.undeground-color_38:after,
[data-line="Ленинградско-Казанский"]:after {
  background-color: #ea5b04;
}

.undeground-color_39:after,
[data-line="Калужско-Нижегородский"]:after {
  background-color: #3fb485;
}

.undeground-color_14:after,
[data-line="Монорельс"]:after {
  background-color: #006da8;
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

@media (max-width: 992px) {
  .docs-searching-results {
    grid-template-columns: 100%;
    grid-gap: 0;
  }
}
</style>
