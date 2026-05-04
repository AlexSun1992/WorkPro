<template>
  <div
    id="wizard-progress-bar"
    v-if="tabs.length > 0"
  >
    <div class="wzd mt-3 mb-4">
      <div class="wpb">
        <div
          class="wpb-p"
          :style="{ width: progressPosition }"
        />
      </div>
      <div class="row">
        <div class="col-6">
          <div class="wpb-label">Текущий этап</div>
        </div>
        <div class="col-6">
          <div
            v-if="nextStep.name"
            class="text-end wpb-label"
          >
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
            <b>{{ availableTabs[0].name }}</b>
          </span>
        </div>
        <div class="col-6">
          <div class="text-end">
            <div class="next-step-button">
              {{ nextStep.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ControlDropdown from "@/components/Libs/Controls/ControlDropdown/ControlDropdown";

export default {
  name: "WizardProgressBar",
  components: { ControlDropdown },
  props: {
    currentTab: {
      type: Object,
      default: null,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    qty: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      value: this.currentTab?.id ?? null,
    };
  },
  computed: {
    nextStep() {
      const currentTab = this.tabs.find((item) => item.id === this.value);
      const currentOrder = currentTab?.order;
      const orders = this.tabs.map((item) => item.order);
      const maxOrder = Math.max(...orders);
      const nextTab =
        currentTab &&
        currentOrder < maxOrder &&
        this.tabs?.filter((item) => item.order > currentOrder).sort((a, b) => a - b)[0];
      const result = { name: "", url: this.getURL(currentTab.idItem) };

      if (nextTab) {
        result.name = nextTab.name;
        result.url = this.getURL(nextTab.idItem);
      }
      return result;
    },
    currentTabComputed() {
      return (this.value && this.tabs && this.tabs.find((item) => item.id === this.value)) ?? null;
    },
    progressPosition() {
      const totalTabs = this.tabs?.length ?? 0;
      const currentOrderIndex = [...this.tabs]
        .sort((tabA, tabB) => tabA.order - tabB.order)
        .findIndex((item) => item.order === this.currentTabComputed.order);

      if (totalTabs - 1 === currentOrderIndex) {
        return "100%";
      }

      if (totalTabs === 1) {
        return "100%";
      }

      if (totalTabs > 0 && this.currentTabOrderPosition > 0) {
        return `${(100 / totalTabs) * currentOrderIndex}%`;
      }

      return "0%";
    },
    currentTabOrderPosition() {
      const sortedTabs = [...this.tabs].sort((a, b) => a.order - b.order);

      return sortedTabs.findIndex((item) => item.order === this.currentTab.order) + 1;
    },
    availableTabs() {
      const { tabs } = this;
      const currentTab = this.currentTabComputed;
      const dropDownTabs = tabs.filter((item) => item.order <= currentTab?.order);

      return dropDownTabs.map((item) => ({ invisible: item.order === currentTab.order, ...item }));
    },
    stepsList() {
      const reals = this.$store.getters["wizard/getWizardData"]?.REL ?? "";
      const result = [];
      const realIds = reals?.split ? reals.split("|").map((item) => item.replaceAll(" ", "")) : [];

      [...this.tabs]
        ?.sort((a, b) => a.order - b.order)
        ?.forEach((tab) => {
          result.push({
            cardId: tab.idItem.toString(),
            idReal: realIds[tab.order - 1] ?? null,
          });
        });

      return result;
    },
  },
  methods: {
    activeClass(item) {
      return item.order <= this.currentTab?.order ? "active" : "";
    },
    getURL(itemId = "") {
      const { params } = this.$route;
      const cardId = params.idCard ?? 0;
      const realId = this.getRelByCardId(itemId);

      return (
        Boolean(realId) &&
        Boolean(cardId) &&
        `/cabinet/wizard/${params.idWizard}/${params.idModule}/0/${itemId}/${cardId}/${realId}`
      );
    },
    goToTab() {
      const { params } = this.$route;
      const itemId = this.currentTabComputed?.idItem ?? params.idItem;
      const url = this.getURL(itemId);

      if (url && this.currentTabComputed?.idItem) {
        this.$router.push(url);
      }
    },
    getRelByCardId(id) {
      const { stepsList } = this;
      const idNum = Number.isNaN(id) ? 0 : Number(id);

      return stepsList.find((item) => idNum === Number(item.cardId))?.idReal ?? null;
    },
  },
};
</script>

<style scoped>
.next-step-button {
  text-decoration: none;
  color: inherit;
}
.wpb {
  background-color: #d9efd4;
  height: 8px;
  width: 100%;
  border-radius: 4px;
}
.wpb-p {
  background-color: #43b02a;
  border-radius: 4px;
  height: 8px;
}
.wpb-label {
  font-size: 0.875rem;
  color: #868686;
}
.dropdown-wrapper::v-deep .header span {
  font-weight: 700;
}
</style>
