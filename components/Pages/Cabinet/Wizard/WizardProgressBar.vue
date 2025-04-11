<template>
  <div v-if="tabs.length > 1">
    <div class="wzd mt-3 mb-4">
      <div style="background-color:#D9EFD4; height:8px; width:100%; border-radius:4px;">
        <div style="background-color:#43B02A; border-radius:4px; height:8px;"
             :style="{width: progressPosition} "/>
      </div>
      <div class=row>
        <div class="col-6">
          <div style="font-size:0.875rem;color:#868686">Текущий этап</div>
        </div>
        <div class="col-6">
          <div v-if="nextStep.name"
            class="text-end"
               style="font-size:0.875rem; color:#868686">Следующий этап
          </div>
        </div>
        <div class="col-6">
          <ControlDropdown v-if="availableTabs.length > 1"
                           :options="availableTabs"
                           value-key="id"
                           placeholder="Текущий этап"
                           @input="goToTab($event)"
                           v-model="value"
                           text-key="name"/>

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
      <div class="d-none row mt-4 step-block osago"
           style="max-width: 100%;overflow-x: auto;   flex-wrap: nowrap;    overflow-y: hidden;">
        <template v-for="(item, index) in tabs">
          <div @click="$router.push(getURL(item, index))"
               class="col-1 text-center position-relative"
               :class="{ active: item.order <= currentTab.order }"
          >
            <div class="step"
                 :data-step="item.order"/>
            <span class="step-text">{{ item.name }}</span>
          </div>
          <div v-if="tabs.length !== index + 1"
               class="col-auto"
               :class="{ active: item.order < currentTab.order }">
            <div class="dotted"></div>
          </div>
        </template>

      </div>

      <div class="d-none">
        <h3>{{ currentTab.name }} - шаг {{ currentTab.order }} из {{ tabs.length }}</h3>
      </div>

    </div>
  </div>
</template>

<script>
import ControlDropdown from "../../../Libs/Controls/ControlDropdown/ControlDropdown.vue";

export default {
  name: 'WizardProgressBar',
  components: { ControlDropdown },
  props: {
    "currentTab": {
      default: null
    },
    "tabs": {
      default: []
    },
    "qty": {
      default: null
    },
    "loading": {
      default: null
    }
  },
  data() {
    return {
      value: this.currentTab?.id ?? null
    }
  },
  computed: {
    nextStep() {
      const currentTab = this.tabs.find(item => item.id === this.value);
      const currentOrder = currentTab?.order;
      const orders = this.tabs.map(item => item.order);
      const maxOrder = Math.max(...orders);
      const nextTab = currentTab && (currentOrder < maxOrder) &&
        this.tabs?.filter((item) => item.order > currentOrder).sort((a, b) => a - b)[0];
      const result = { name: '', url: this.getURL(currentTab.idItem) };

      if (nextTab) {
        result.name = nextTab.name;
        result.url = this.getURL(nextTab.idItem)
      }

      return result;
    },
    currentTabComputed() {
      return (this.value && this.tabs && this.tabs.find(item => item.id === this.value)) ?? null;
    },
    progressPosition() {
      const totalTabs = this.tabs?.length ?? 0;
      const currentOrder = this.currentTabOrderPosition;

      if (totalTabs === 1) {
        return "100%";
      }

      if (totalTabs > 0 && currentOrder > 0) {
        return `${ ((100 / totalTabs) * (currentOrder - 1)) }%`;
      }

      return '0%';
    },
    currentTabOrderPosition() {
      const sortedTabs = [...this.tabs].sort((a, b) => a.order - b.order);

      return sortedTabs.findIndex(item => item.order === this.currentTab.order) + 1;
    },
    availableTabs() {
      const { tabs } = this;
      const currentTab = this.currentTabComputed;
      let dropDownTabs = tabs.filter(item => item.order <= currentTab.order);

      dropDownTabs = dropDownTabs.map(item => ({ invisible: item.order === currentTab.order, ...item }));

      return dropDownTabs;
    },
    stepsList() {
      let tabs = this.$store.getters["wizard/getWizardPages"] ?? '';
      let reals = this.$store.getters["wizard/getWizardData"]?.REL ?? '';
      const result = [];

      tabs = tabs?.split ? tabs.split(';').map(item => item.replaceAll(' ', '')) : [];
      reals = reals?.split ? reals.split('|').map(item => item.replaceAll(' ', '')) : [];

      tabs.forEach((item, index) => {
        result.push({ cardId: item, idReal: reals[index] ?? null });
      });

      return result;
    }
  },
  methods: {
    getURL(itemId) {
      const { params } = this.$route;
      const _itemId = itemId ?? '';
      const cardId = params.idCard ?? 0;
      const realId = this.getRelByCardId(itemId);

      return !!realId && !!cardId && `/cabinet/wizard/${ params.idWizard }/${ params.idModule }/0/${ _itemId }/${ cardId }/${ realId }`;
    },
    goToTab() {
      const { params } = this.$route;
      const itemId = this.currentTabComputed?.idItem ?? params.idItem;
      const url = this.getURL(itemId);

      url && this.currentTabComputed?.idItem && this.$router.push(url);
    },
    getRelByCardId(id) {
      const { stepsList } = this;
      const _id = isNaN(+id) ? 0 : +id

      return stepsList.find(item => _id === +item.cardId)?.idReal ?? null;
    }
  }
}
</script>

<style lang="scss" scoped>
.next-step-button {
  text-decoration: none;
  color: inherit;
}
</style>
