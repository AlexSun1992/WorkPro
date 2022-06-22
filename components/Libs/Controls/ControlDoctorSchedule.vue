<template>
  <div class="position-relative">
    <b-spinner
      v-if="isRequestFinish === false"
      class="big-spinner"
      style="width: 1.2rem; height: 1.2rem"
      variant="success"
      label="Загрузка..."
    />

    <div v-if="notFound && options.length">
      <p>К сожалению, на выбранную дату свободных врачей не найдено <span>&#128532</span></p>
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
        <div v-for="elem in item.STIMELIST" :key="elem.id" class="doc-time">
          <button class="btn-doc-time" @click="chooseTimeToVisit(elem, item)">
            {{ elem.DFROM }}
          </button>
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

  data() {
    return {
      notFound: false,
    };
  },

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
    isRequestFinish: {
      get() {
        return this.$store.getters["blocks/getRequestStatus"];
      },
    },
  },

  watch: {
    options() {
      if (this.$store.getters["data_card/getForm"]) {
       const [dd, mm, yyyy] = this.$store.getters["data_card/getForm"].find((item) => item.name === "DDATE").value.split(".")
       if (this.dataContent && this.dataContent.items) {
        const candidate = this.dataContent.items.find((item) => {
          const appointmentDate = new Date(item.DDATE);
          appointmentDate.setHours(appointmentDate.getHours() - 3);
          const chosenDate = new Date(yyyy, mm, dd);
          chosenDate.setMonth(chosenDate.getMonth() - 1);
          return +appointmentDate === +chosenDate;
        });
        if (!candidate) {
          this.notFound = true;
        }
      }
      }
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
      .then(() => {
        this.$store.commit("blocks/isRequestFinish", true);
      })
      .finally(() => {
        this.$store.commit("data_card/setDisabled", false);
      });
  },

  methods: {
    chooseTimeToVisit(elem, item) {
      const copyValue = { ...item, ...elem };
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { value: copyValue },
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
}
.doc-expert {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
}
.doc-name {
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-top: 10px;
}
.doc-date {
  font-family: "Raleway";
  float: right;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  font-feature-settings: "pnum" on, "lnum" on;
  color: #009639;
}
.doc-location {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  margin-top: 40px;
}
.doc-adress {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  color: #292929;
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
  font-size: 16px;
  line-height: 1;
  color: #009639;
  min-width: 84px;
  text-align: center;
}
</style>
