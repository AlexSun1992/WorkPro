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
            value-key="id"
            placeholder="Текущий этап"
            @input="goToTab($event)"
            v-model="value"
            text-key="name"
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
            :class="{ active: item.order <= currentTab.order }"
          >
            <div class="step" :data-step="item.order" />
            <span class="step-text">{{ item.name }}</span>
          </div>
          <div
            v-if="tabs.length !== index + 1"
            class="col-auto"
            :class="{ active: item.order < currentTab.order }"
          >
            <div class="dotted"></div>
          </div>
        </div>
      </div>

      <div class="d-none">
        <h3>
          {{ currentTab.name }} - шаг {{ currentTab.order }} из
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
    currentTab: {
      default() {
        return {
          name: "Расчет",
          idItem: 1040,
          id: 4526,
          list: false,
          order: 3,
        };
      },
      type: Object,
    },
    tabs: {
      default() {
        return [
          {
            name: "Тип расчета",
            idItem: 1037,
            id: 4528,
            list: false,
            order: 1,
          },
          {
            name: "Данные об авто",
            idItem: 1039,
            id: 4530,
            list: false,
            order: 2,
          },
          {
            name: "Расчет",
            idItem: 1040,
            id: 4526,
            list: false,
            order: 3,
          },
          {
            name: "Личные данные",
            idItem: 1041,
            id: 4529,
            list: false,
            order: 4,
          },
          {
            name: "Сведения о ТС",
            idItem: 1064,
            id: 4527,
            list: false,
            order: 5,
          },
          {
            name: "Доп сведения о ТС",
            idItem: 1065,
            id: 4538,
            list: false,
            order: 6,
          },
          {
            name: "Документы ТС",
            idItem: 1066,
            id: 4531,
            list: false,
            order: 7,
          },
          {
            name: "Водители",
            idItem: 1068,
            id: 4532,
            list: false,
            order: 8,
          },
          {
            name: "Параметры полиса",
            idItem: 1069,
            id: 4533,
            list: false,
            order: 9,
          },
          {
            name: "Точный расчет",
            idItem: 1070,
            id: 4534,
            list: false,
            order: 10,
          },
          {
            name: "Сканы документов",
            idItem: 1048,
            id: 4535,
            list: false,
            order: 11,
          },
          {
            name: "Осмотр",
            idItem: 1049,
            id: 4536,
            list: false,
            order: 12,
          },
          { name: "Оплата", idItem: 1085, id: 4537, list: false, order: 13 },
        ];
      },
      type: Array,
    },
    qty: {
      default: 13,
      type: Number
    },
    loading: {
      default: null,
    },
  },
  computed: {
    currentId() {
      return this.wizardNavigation.current?.IDCARD;
    },
    step() {
      return this.wizardCursor.find((item) => item.NITEM === this.currentId);
    },
    name() {
      return this.step?.SNAME;
    },
    nextStep() {
      const currentTab = this.tabs.find((item) => item.id === this.value);
      const currentOrder = currentTab?.order;
      const orders = this.tabs.map((item) => item.order);
      const maxOrder = Math.max(...orders);
      const nextTab =
        currentTab &&
        currentOrder < maxOrder &&
        this.tabs.find((item) => item.order === currentOrder + 1);
      const result = { name: "", url: this.getURL(currentTab.idItem) };

      if (nextTab) {
        result.name = nextTab.name;
        result.url = this.getURL(nextTab.idItem);
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
      const currentOrder = this.currentTabComputed?.order ?? 0;

      if (totalTabs && currentOrder) {
        return `${(100 / totalTabs) * (currentOrder - 1)}%`;
      }

      return "0%";
    },
    availableTabs() {
      const { tabs } = this;
      const currentTab = this.currentTabComputed;
      let dropDownTabs = tabs.filter((item) => item.order <= currentTab.order);

      dropDownTabs = dropDownTabs.map((item) => ({
        invisible: item.order === currentTab.order,
        ...item,
      }));

      return dropDownTabs;
    },
    stepsList() {
      let tabs = this.$store.getters["wizard/getWizardPages"] ?? "";
      let reals = this.$store.getters["wizard/getWizardData"]?.REL ?? "";
      const result = [];

      tabs = tabs?.split
        ? tabs.split(";").map((item) => item.replaceAll(" ", ""))
        : [];
      reals = reals?.split
        ? reals.split("|").map((item) => item.replaceAll(" ", ""))
        : [];

      tabs.forEach((item, index) => {
        result.push({ cardId: item, idReal: reals[index] ?? null });
      });

      return result;
    },
  },
  methods: {
    getURL(itemId) {
      const { params } = this.$route;
      const _itemId = itemId ?? "";
      const cardId = params.idCard ?? 0;
      const realId = this.getRelByCardId(itemId);

      return (
        !!realId &&
        !!cardId &&
        `/cabinet/wizard/${params.idWizard}/${params.idModule}/0/${_itemId}/${cardId}/${realId}`
      );
    },
    goToTab() {
      const { params } = this.$route;
      const itemId = this.currentTabComputed?.idItem ?? params.idItem;
      const url = this.getURL(itemId);

      url && this.currentTabComputed?.idItem && this.$router.push(url);
    },
    getRelByCardId(id) {
      const { stepsList } = this;
      const _id = isNaN(+id) ? 0 : +id;

      return stepsList.find((item) => _id === +item.cardId)?.idReal ?? null;
    },
  },
};
</script>

<style scoped></style>
