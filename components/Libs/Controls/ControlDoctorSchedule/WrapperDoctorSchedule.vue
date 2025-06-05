<template>
  <div class="position-relative">
    <div v-if="isRequestFinish === false">
      <b-spinner
        class="big-spinner"
        variant="success"
        label="Загрузка..."
      />
      <h5 class="color-lgray text-center w-400">Ищем подходящих врачей</h5>
    </div>

    <div v-if="isRequestFinish === true && options.length > 0">
      <div class="title-conf-block ps-1 ms-3 mb-4">Результаты поиска</div>
      <div class="search_input mb-4">
        <b-form-input
          v-model="searchString"
          :placeholder="placeholder"
        />
        <button
          @click="clearFilter()"
          class="search-clear"
        ></button>
      </div>
      <div
        v-for="item in getMainFilteredItems"
        :key="item.id"
      >
        <CardDoctorSchedule
          @update="$emit('update', $event)"
          :options="item"
          :data="data"
          :dataTimeToVisit="getDataTimeToVisit"
          @updateActiveSchedule="updateActiveSchedule($event)"
        />
      </div>
      <div
        v-if="getMainFilteredItems.length === 0"
        class="docs-searching-results mb-4"
      >
        По результатам поиска '{{ searchString }}' ничего не найдено
      </div>
    </div>

    <div
      v-else-if="isRequestFinish"
      class="docs-searching-results mb-4"
    >
      К сожалению, по вашему запросу ничего не найдено 🙁
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import CardDoctorSchedule from "./CardDoctorSchedule";

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
  data() {
    return {
      getDataTimeToVisit: {},
      placeholder: "Поиск по ФИО врача, клинике или адресу",
      searchString: "",
      inProgress: false,
      datesToShow: Vue.observable({ value: 4 }),
    };
  },
  provide() {
    return {
      visibleDates: this._datesToShow,
    };
  },
  components: { CardDoctorSchedule },
  emits: ["update"],

  async created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener("resize", this.setDatesToShow);
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
  mounted() {
    this.setDatesToShow();
  },
  destroyed() {
    window.removeEventListener("resize", this.setDatesToShow);
  },
  methods: {
    updateActiveSchedule(schedule) {
      this.getDataTimeToVisit = schedule;
    },
    clearFilter() {
      this.searchString = "";
    },
    setQueryURL() {
      const urlObject = new URL(window.location.href);
      if (this.searchString === "") {
        urlObject.searchParams.delete("q");
      } else {
        urlObject.searchParams.set("q", this.searchString);
      }

      window.history.replaceState(null, null, urlObject);
    },
    setDatesToShow() {
      const currentWidth = window.innerWidth;
      const size = [
        { min: 0, max: 400, size: 2 },
        { min: 401, max: 1219, size: 3 },
        { min: 1219, max: Infinity, size: 4 },
      ];
      const doUpdate = () => {
        this.inProgress = true;

        setTimeout(() => {
          this.inProgress = false;
        }, 50);
        for (let item of size) {
          if (item.max >= currentWidth && item.min <= currentWidth) {
            this.datesToShow.value = item.size;

            return;
          }
        }

        this.datesToShow.value = size.at(-1).size;
      };

      if (this.inProgress) {
        return;
      }

      doUpdate();
    },
  },
  computed: {
    getMainFilteredItems() {
      this.setQueryURL();
      const filteredOptions = this.options.filter((el) => {
        if (
          el.SPERSON.toLowerCase().includes(this.searchString.toLowerCase().trim()) ||
          el.FKIDLPU.toLowerCase().includes(this.searchString.toLowerCase().trim()) ||
          el.SADDRESS.toLowerCase().includes(this.searchString.toLowerCase().trim()) ||
          el.SUNDERGROUND.toLowerCase().includes(this.searchString.toLowerCase().trim())
        ) {
          return el;
        }
      });
      return filteredOptions;
    },
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic);
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    options: {
      get() {
        return this.dataContent.items
          ? this.dataContent.items.map((doctor) => {
              doctor.ID = doctor.IDPERSON + doctor.IDLPU;
              return doctor;
            })
          : [];
      },
    },

    appointment: {
      get() {
        if (this.$store.getters["data_card/getForm"]) {
          const appointmentObject = this.$store.getters["data_card/getForm"].find((item) => item.name === "DDATE");
          if (!appointmentObject.value && this.getMainFilteredItems.length) return true;
          if (appointmentObject.value) {
            if (appointmentObject.value && this.getMainFilteredItems.length) {
              const choosenRussianDate = appointmentObject.value;

              const choosenIsoDate = choosenRussianDate.split(".").reverse().join("-");

              const [appointment] = this.getMainFilteredItems;

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
    isSearchDataVisible() {
      const fields = ["FKIDSPECIALIST", "FKSPOLICY", "FKIDTOWN"];
      const state = this.$store.state.data_card?.form ?? null;

      if (!state) {
        return false;
      }

      for (let fieldName of fields) {
        if (state.find((field) => field.name === fieldName)?.value === null) {
          return false;
        }
      }

      return true;
    },
    _datesToShow() {
      console.log(`_datesToShow = ${this.datesToShow}`);
      return this.datesToShow;
    },
  },
};
</script>

<style scoped>
.search_input {
  position: relative;
}
.search_input input {
  padding-left: 49px;
  padding-right: 49px;
  background: #fff url(/img/icon-search.svg) 15px 50% no-repeat;
}
.search_input button.search-clear {
  position: absolute;
  top: 50%;
  right: 25px;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  background: #fff url(/img/icon-search-clear.svg) 50% 50% no-repeat;
  border: 0;
}
</style>
