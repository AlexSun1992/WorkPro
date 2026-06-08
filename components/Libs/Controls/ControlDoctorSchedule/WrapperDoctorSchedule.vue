<template>
  <div class="position-relative">
    <div v-if="isRequestFinish === false">
      <span class="spinner-border text-success big-spinner"><span class="sr-only"></span></span>
      <h5 class="color-lgray text-center w-400">Загружаем расписание</h5>
    </div>

    <div v-if="isRequestFinish === true && options.length > 0">
      <div
        v-if="!getDataTimeToVisit.LSHORT"
        class="title-conf-block ps-1 ms-3 mb-4"
      >
        Результаты поиска
      </div>
      <div
        class="search_input mb-4"
        v-if="!getDataTimeToVisit.LSHORT"
      >
        <SearchInput
          v-model="searchString"
          :placeholder="placeholder"
          @clear="clearFilter"
        />
      </div>
      <div
        v-for="item in getMainFilteredItems"
        :key="item.id"
      >
        <CardDoctorSchedule
          @update="$emit('update', $event)"
          :options="item"
          :data="data"
          :data-time-to-visit="getDataTimeToVisit"
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
import CardDoctorSchedule from "./CardDoctorSchedule";
import SearchInput from "@/components/Libs/Controls/ControlSelectObjectFromMap/common/Input/SearchInput";

export default {
  name: "WrapperDoctorSchedule",
  component: {
    SearchInput,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      getDataTimeToVisit: {},
      placeholder: "Поиск",
      searchString: "",
      inProgress: false,
      datesToShow: { value: 4 },
    };
  },
  provide() {
    return {
      visibleDates: this.datesToShow,
    };
  },
  components: { SearchInput, CardDoctorSchedule },
  emits: ["update"],

  computed: {
    getMainFilteredItems() {
      this.setQueryURL();
      const normalizedSearchString = this.searchString.toLowerCase().trim();
      const metroStations = this.options?.map((el) => el?.SMETRO?.SNAME?.toLowerCase()) ?? [];
      return this.options.filter((el) => {
        if (
          el.SNAME?.toLowerCase().includes(normalizedSearchString) ||
          el.STITLE?.toLowerCase().includes(normalizedSearchString) ||
          el.SADDRESS?.toLowerCase().includes(normalizedSearchString) ||
          metroStations.includes(normalizedSearchString)
        ) {
          return el;
        }
        return false;
      });
    },
    dataContent() {
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic);
      if (block) {
        return block.data;
      }
      return {};
    },
    options() {
      return this.dataContent.items
        ? this.dataContent.items.map((doctor) => {
            const additionalID = doctor.IDLPU || doctor.IDEQDEP || 0;
            doctor.ID = doctor.IDPERSON ? doctor.IDPERSON + additionalID : additionalID;
            return doctor;
          })
        : [];
    },

    appointment() {
      if (this.$store.getters["data_card/getForm"]) {
        const appointmentObject = this.$store.getters["data_card/getForm"].find((item) => item.name === "DDATE");
        if (!appointmentObject.value && this.getMainFilteredItems.length) {
          return true;
        }
        if (appointmentObject.value) {
          if (appointmentObject.value && this.getMainFilteredItems.length) {
            const chosenRussianDate = appointmentObject.value;

            const chosenIsoDate = chosenRussianDate.split(".").reverse().join("-");

            const [appointment] = this.getMainFilteredItems;

            return chosenIsoDate === appointment.DDATE;
          }
        }
      }
      return false;
    },
    isRequestFinish() {
      return this.$store.getters["blocks/getRequestStatus"];
    },
    isSearchDataVisible() {
      const fields = ["FKIDSPECIALIST", "FKSPOLICY", "FKIDTOWN"];
      const state = this.$store.state.data_card?.form ?? null;

      if (!state) {
        return false;
      }

      for (const fieldName of fields) {
        if (state.find((field) => field.name === fieldName)?.value === null) {
          return false;
        }
      }

      return true;
    },
    _datesToShow() {
      return this.datesToShow;
    },
    scheduleSize() {
      return this.options[0]?.LSHORT
        ? [
            { min: 0, max: 400, size: 2 },
            { min: 401, max: 768, size: 3 },
            { min: 768, max: 992, size: 6 },
            { min: 993, max: Infinity, size: 8 },
          ]
        : [
            { min: 0, max: 400, size: 2 },
            { min: 401, max: 1219, size: 3 },
            { min: 1219, max: Infinity, size: 4 },
          ];
    },
  },

  watch: {
    options(newOptions, oldOptions) {
      if (oldOptions.length === 0 && newOptions[0]?.LSHORT) {
        this.setDatesToShow();
      }
    },
  },

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
  unmounted() {
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
      if (this.inProgress) {
        return;
      }

      const currentWidth = window.innerWidth;

      this.doUpdate(currentWidth, this.scheduleSize);
    },
    doUpdate(currentWidth, size) {
      this.inProgress = true;

      setTimeout(() => {
        this.inProgress = false;
      }, 50);
      for (const item of size) {
        if (item.max >= currentWidth && item.min <= currentWidth) {
          this.datesToShow.value = item.size;

          return;
        }
      }

      this.datesToShow.value = size.at(-1).size;
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
