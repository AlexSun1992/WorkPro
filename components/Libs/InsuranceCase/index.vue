<template>
  <div>
    <div
      v-if="currentFilter.length > 1"
      class="card-filters"
    >
      <FilterButton
        v-for="item in currentFilter"
        :key="item"
        :label="item"
        :active="item === currentFilter[selectedTab]"
        @click="select"
      />
    </div>

    <div v-if="currentFilter[selectedTab] === 'Информация'">
      <div
        v-if="parsedData.CLAIMSTATUS"
        :class="informerMsgVisible"
      >
        {{ parsedData.CLAIMSTATUS }}
      </div>
      <div
        v-for="(informerInfo, index) in parsedData.SINFORMERS"
        :key="index"
      >
        <ControlInformer
          class="mb-2"
          :data="{ value: informerInfo.text, name: informerInfo.style }"
        />
      </div>

      <InfoCard :data="parsedData.SJSON" />
      <div
        class="my-policy-actions row"
        :data-id="parsedData.IDPRODUCT"
      >
        <div
          v-for="(action, index) in parsedActions"
          :key="action.id"
          :class="numberCol(index)"
        >
          <ActionButton
            :id="action.id"
            :action-id="action['action-id']"
            :params="params"
            class="action"
          >
            <span><img :src="`/img/iconbtn/${action.class}.svg`" /></span>
            <div v-html="action.sname"></div>
          </ActionButton>
        </div>
      </div>
    </div>
    <DownloadDocs
      v-if="currentFilter[selectedTab] === 'Документы'"
      :data="parsedData.SDOCS"
    />
    <StepBlock
      v-if="currentFilter[selectedTab] === 'История'"
      :data="parsedData.SHISTORY"
    />
  </div>
</template>

<script>
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import FilterButton from "./Filters";
import InfoCard from "./InfoCard";
import DownloadDocs from "./DownloadDocs.vue";
import StepBlock from "./StepBlock.vue";
import ActionButton from "@/components/Pages/Cabinet/Block/ActionButton";

export default {
  name: "InsuranceCase",
  components: {
    InfoCard,
    FilterButton,
    DownloadDocs,
    StepBlock,
    ControlInformer,
    ActionButton,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedTab: 0,
      informerMsg: {},
      info: [],
      newDocs: [],
      newHistory: [],
    };
  },

  computed: {
    params() {
      return this.$route.params;
    },
    parsedData() {
      const reducedData = this.data.reduce((result, user) => ({
        ...result,
        [user.name]: user.value,
      }));
      this.informerMsg = { value: reducedData.SSTATUSEUU, name: "SHELP_INFO" };
      return reducedData;
    },
    parsedActions() {
      let parsed = [];
      try {
        parsed = JSON.parse(this.parsedData.SACTIONS);
      } catch (err) {
        console.error(err);
      }
      return parsed;
    },
    currentFilter() {
      const massFilter = ["Информация"];
      if (this.parsedData.SDOCS?.length > 0) {
        massFilter.push("Документы");
      }
      if (this.parsedData.SHISTORY?.length > 0) {
        massFilter.push("История");
      }
      return massFilter;
    },
    informerMsgVisible() {
      return ["settlement", this.informerMsg.value?.length > 0 ? "mb-2r" : "mb-2"];
    },
  },
  methods: {
    numberCol(index) {
      if (this.parsedActions.length === 2) {
        return "col-12 col-lg-6";
      }
      const len = this.parsedActions.length;

      if (len === 5) {
        return index <= 3 ? "col-12 col-lg-4" : "col-12 col-lg-6";
      }

      const cols = { 2: 6, 3: 4, 4: 3, 6: 4 }[len];
      return cols ? `col-12 col-lg-${cols}` : "col-12";
    },
    select(data) {
      this.selectedTab = this.currentFilter.indexOf(data);
    },
  },
};
</script>

<style scoped>
.card-filters {
  background-color: #f2f4f5;
  margin: 0 auto 24px auto;
  width: auto;
  display: table;
  padding: 2px;
  border-radius: 8px;
}

.settlement {
  border-radius: 24px;
  padding: 9px 12px;
  font-style: normal;
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.25rem;
  display: table;
  background-color: #fe7333;
  color: var(--white);
}

.mb-2r {
  margin-bottom: 2rem;
}
.my-policy-actions > div {
  margin-bottom: 0rem !important;
  margin-top: 1.5rem;
}
.my-policy-actions::v-deep button.action img {
  position: relative;
  width: 24px;
  height: 24px;
  margin: 12px auto;
}
.my-policy-actions::v-deep button.action {
  position: relative;
}
.my-policy-actions::v-deep button.action span {
  margin: 0 auto;
  width: 72px;
  height: 72px;
  border: 12px solid var(--svg-color-three);
  border-radius: 72px;
  margin-bottom: 12px;
  display: block;
}
</style>
