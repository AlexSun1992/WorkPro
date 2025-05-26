<template>
  <div class="position-relative">
    <b-spinner
      v-if="isRequestFinish === false"
      class="big-spinner"
      style="width: 1.2rem; height: 1.2rem"
      variant="success"
      label="Загрузка..."
    />

    <div v-if="!appointment && options.length">
      <p>
        К сожалению, на выбранную дату свободных врачей не найдено
        <span>😔</span>
      </p>
      <p>Ниже список ближайших доступных дат</p>
    </div>

    <div v-if="isRequestFinish === true && options.length">
      <div
        v-for="item in options"
        :key="item.id"
        class="docs-searching-results mb-4"
      >
        <div class="doc-date">
          {{
            item.DDATE
              ? new Intl.DateTimeFormat("ru-RU").format(new Date(item.DDATE))
              : ""
          }}
        </div>
        <div class="doc-expert">
          {{ item.SSPECIALISTNAME }}
        </div>
        <div class="doc-name">
          {{ item.SPERSON }}
        </div>
        <div class="doc-location">
          {{ item.FKIDLPU }}
        </div>
        <div class="doc-adress">
          <i class="my-location" />{{ item.SADDRESS }}
        </div>
        <div class="recording time">
          <div v-for="elem in item.STIMELIST" :key="elem.id" class="doc-time">
            <button class="btn-doc-time" @click="chooseTimeToVisit(elem, item)">
              {{ elem.DFROM }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isRequestFinish" class="docs-searching-results mb-4">
      Записей нет
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
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  emits: ["update"],

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

    appointment: {
      get() {
        if (this.$store.getters["data_card/getForm"]) {
          const appointmentObject = this.$store.getters[
            "data_card/getForm"
          ].find((item) => item.name === "DDATE");
          if (!appointmentObject.value && this.options.length) return true;
          if (appointmentObject.value) {
            if (appointmentObject.value && this.options.length) {
              const choosenRussianDate = appointmentObject.value;

              const choosenIsoDate = choosenRussianDate
                .split(".")
                .reverse()
                .join("-");

              const [appointment] = this.options;

              return choosenIsoDate === appointment.DDATE;
            }
          }
        }
        return false;
      },
    },

    isRequestFinish: {
      get() {
        return this.$store.getters["blocks/getRequestStatus"];
      },
    },
  },

  async created() {
    this.$store.commit("data_card/setDisabled", true);
    this.$store.commit("blocks/clearBlockById", this.data.menudic);
    this.$store.commit("blocks/isRequestFinish", false);
    return this.$store
      .dispatch("blocks/fetchBlock", {
        id: this.data.menudic,
        query: this.$store.getters["data_card/getFiltersAllFields"],
      })
      .then((data) => {
        this.$store.commit("blocks/isRequestFinish", true);
        if (data?.status === 500) {
          this.$store.commit("data_card/setVisibleByName", {
            name: "GET_TIMETABLE",
            visible: true,
          });
          this.$store.commit("data_card/setVisibleByName", {
            name: "FKSSCHEDULE",
            visible: false,
          });
          this.$store.commit("data_card/setVisibleByName", {
            name: "SEARCH_RESULT_TITLE",
            visible: false,
          });
        }
      })
      .finally(() => {
        this.$store.commit("data_card/setDisabled", false);
        this.$store.commit("data_card/setDisabledByName", {
          name: "GET_TIMETABLE",
          disable: false,
        });
      });
  },

  methods: {
    chooseTimeToVisit(elem, item) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { value: { ...item, ...elem } },
      });
    },
  },
};
</script>

<style scoped>
.docs-searching-results {
  border: 1px solid #eff1f3;
  border-radius: 16px;
  padding: 24px 54px 24px 20px;
  display: grid;
  grid-template-areas:
    "doc date"
    "name name"
    "lpu lpu"
    "adress adress"
    "time time";
  grid-template-columns: auto 116px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  background: #fff;
}
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
  .doc-adress .my-location {
    position: absolute;
    top: 16px;
    left: -4px;
  }

  .doc-adress {
    font-size: 1rem;
    position: relative;
    padding-left: 20px;
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
}
</style>
