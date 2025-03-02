<template>
  <div>
    <h2>{{ name }}</h2>

    <div class="wzd mt-3 mb-4">
      <div
        style="
          background-color: #d9efd4;
          height: 8px;
          width: 100%;
          border-radius: 4px;
        "
      >
        <div
          style="background-color: #43b02a; border-radius: 4px; height: 8px"
          :style="{ width: progressPosition }"
        />
      </div>
      <div class="row">
        <div class="col-6">
          <div style="font-size: 0.875rem; color: #868686">Текущий этап</div>
        </div>
        <div class="col-6">
          <div class="text-end" style="font-size: 0.875rem; color: #868686">
            Следующий этап
          </div>
        </div>
        <div class="col-6">
          <ControlDropdown
            v-if="availableTabs.length > 1"
            :options="availableTabs"
            value-key="ID"
            placeholder="Текущий этап"
            @input="goToTab($event)"
            v-model="value"
            text-key="SNAME"
          />

          <span v-else>
            {{ availableTabs[0].name }}
          </span>
        </div>
        <div class="col-6">
          <div class="text-end" style="">
            <div class="next-step-button">
              {{ nextStep.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tabs.length > 1">
      <div
        class="d-none row mt-4 step-block osago"
        style="
          max-width: 100%;
          overflow-x: auto;
          flex-wrap: nowrap;
          overflow-y: hidden;
        "
      >
        <div v-for="(item, index) in tabs" :key="index">
          <div
            @click="$router.push(getURL(item, index))"
            class="col-1 text-center position-relative"
            :class="{ active: item.NORDER <= currentTab.NORDER }"
          >
            <div class="step" :data-step="item.NORDER" />
            <span class="step-text">{{ item.name }}</span>
          </div>
          <div
            v-if="tabs.length !== index + 1"
            class="col-auto"
            :class="{ active: item.NORDER < currentTab.NORDER }"
          >
            <div class="dotted"></div>
          </div>
        </div>
      </div>

      <div class="d-none">
        <h3>
          {{ currentTabName }} - шаг {{ currentTabOrder }} из
          {{ tabs.length }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import ControlDropdown from "../../../../components/Libs/Controls/ControlDropdown/ControlDropdown.vue";

export default {
  name: "ProgressBar",
  components: { ControlDropdown },
  props: {
    wizardRels: {
      type: Array,
      required: true,
    },
    wizardCursor: {
      type: Array || undefined,
      required: true,
    },
    wizardIDCARDS: {
      type: Array,
      required: false,
      default: null,
    },
    wizardNavigation: {
      type: Object,
      required: false,
      default: null,
    },
    /* currentTab: {
      default() {
        return {
          name: "Расчет",
          idItem: 1040,
          id: 4526,
          list: false,
          NORDER: 3,
        };
      },
      type: Object,
    }, */
    /*    tabs: {
          default() {
            return [
              {
                name: "Тип расчета",
                idItem: 1037,
                id: 4528,
                list: false,
                NORDER: 1,
              },
              {
                name: "Данные об авто",
                idItem: 1039,
                id: 4530,
                list: false,
                NORDER: 2,
              },
              {
                name: "Расчет",
                idItem: 1040,
                id: 4526,
                list: false,
                NORDER: 3,
              },
              {
                name: "Личные данные",
                idItem: 1041,
                id: 4529,
                list: false,
                NORDER: 4,
              },
              {
                name: "Сведения о ТС",
                idItem: 1064,
                id: 4527,
                list: false,
                NORDER: 5,
              },
              {
                name: "Доп сведения о ТС",
                idItem: 1065,
                id: 4538,
                list: false,
                NORDER: 6,
              },
              {
                name: "Документы ТС",
                idItem: 1066,
                id: 4531,
                list: false,
                NORDER: 7,
              },
              {
                name: "Водители",
                idItem: 1068,
                id: 4532,
                list: false,
                NORDER: 8,
              },
              {
                name: "Параметры полиса",
                idItem: 1069,
                id: 4533,
                list: false,
                NORDER: 9,
              },
              {
                name: "Точный расчет",
                idItem: 1070,
                id: 4534,
                list: false,
                NORDER: 10,
              },
              {
                name: "Сканы документов",
                idItem: 1048,
                id: 4535,
                list: false,
                NORDER: 11,
              },
              {
                name: "Осмотр",
                idItem: 1049,
                id: 4536,
                list: false,
                NORDER: 12,
              },
              { name: "Оплата", idItem: 1085, id: 4537, list: false, NORDER: 13 },
            ];
          },
          type: Array,
        }, */
    qty: {
      default: 13,
      type: Number,
    },
  },
  data() {
    return {
      value: 4526,
    };
  },
  computed: {
    tabs() {
      return this.wizardCursor;
    },
    currentTab() {
      return this.wizardNavigation;
    },
    currentId() {
      return this.wizardNavigation?.IDCARD;
    },
    step() {
      return this.wizardCursor.find((item) => item.NITEM === this.currentId);
    },
    name() {
      return this.step?.SNAME;
    },
    nextStep() {
      debugger;
      const { currentTab } = this;
      const currentOrder = this.currentTabOrder;
      const orders = this.tabs.map((item) => item.NORDER);
      const maxOrder = Math.max(...orders);
      const nextTab =
        currentTab &&
        currentOrder < maxOrder &&
        this.tabs.find((item) => item.NORDER === currentOrder + 1);
      const result = { name: "", url: "" };

      if (nextTab) {
        result.name = nextTab.SNAME;
        result.url = "";
      }

      if (currentTab && currentOrder === maxOrder) {
        return currentTab;
      }

      return result;
    },
    currentTabComputed() {
      return (
        (this.value &&
          this.tabs &&
          this.tabs.find((item) => item.id === this.value)) ??
        null
      );
    },
    progressPosition() {
      const totalTabs = this.tabs?.length ?? 0;
      const currentOrder = this.currentTabOrder ?? 0;

      if (totalTabs && currentOrder) {
        return `${(100 / totalTabs) * (currentOrder - 1)}%`;
      }

      return "0%";
    },
    currentTabOrder() {
      return (
        this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)
          ?.NORDER ?? 0
      );
    },
    currentTabName() {
      return (
        this.tabs.find((item) => item.NITEM === this.currentTab.IDCARD)
          ?.SNAME ?? ""
      );
    },
    availableTabs() {
      const { tabs } = this;
      const { currentTabOrder } = this;
      const dropDownTabs = tabs.filter(
        (item) => item.NORDER <= currentTabOrder
      );

      return dropDownTabs.map((item) => ({
        invisible: item.NORDER === currentTabOrder,
        ...item,
      }));
    },
  },

  methods: {
    getURL(itemId) {
      return "";
      /* const { params } = this.$route;
      const _itemId = itemId ?? "";
      const cardId = params.idCard ?? 0;
      const realId = this.getRelByCardId(itemId);

      return (
        !!realId &&
        !!cardId &&
        `/cabinet/wizard/${params.idWizard}/${params.idModule}/0/${_itemId}/${cardId}/${realId}`
      ); */
    },
    goToTab() {
      const { params } = this.$route;
      const idItem = this.currentTabComputed?.idItem ?? params.idItem;

      this.$emit("update", { idItem });
    },
    getRelByCardId(id) {
      const { stepsList } = this;
      const _id = isNaN(+id) ? 0 : +id;

      return stepsList.find((item) => _id === +item.cardId)?.idReal ?? null;
    },
  },
};
</script>

<style scoped>
.next-step-button {
  text-decoration: none;
  color: inherit;
}
</style>
