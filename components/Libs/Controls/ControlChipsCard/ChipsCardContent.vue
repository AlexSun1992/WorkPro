<template>
  <div
    v-if="chipsData.length && cardActon && cardActon.id"
    class="chips-content-wrapper"
    @click.stop="onClick"
  >
    <div class="title">
      {{ titleData }}
    </div>

    <div
      v-for="item in chipsData"
      :key="item"
      class="chips"
      :class="`chip-color-${chipsColor}`"
    >
      {{ item }}
    </div>

    <div class="footer">
      <ActionButton
        ref="actionBtn"
        :action-id="actionId"
        :card-data="{ cardId: data.ID, relId: data.SREL }"
      >
      </ActionButton>
    </div>
  </div>
</template>

<script>
import ActionButton from "@/components/Pages/Cabinet/Block/ActionButton";

export default {
  name: "ChipsCardContent",
  components: { ActionButton },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    dataMapping: {
      type: Object,
      default: () => ({
        title: "SOBJECT",
        chips: "SINFORMER",
        action: "IDACTION",
        id: "ID",
      }),
    },
  },
  computed: {
    actionId() {
      return this.cardActon.name?.replace("Item", "");
    },
    titleField() {
      return this.dataMapping.title || "SOBJECT";
    },
    chipsField() {
      return this.dataMapping.chips || "SINFORMER";
    },
    chipsColor() {
      return this.data.SCOLOR;
    },
    actionField() {
      return this.dataMapping.action || "IDACTION";
    },

    titleData() {
      return this.data[this.titleField] || "";
    },
    chipsData() {
      const chips = this.data[this.chipsField];

      if (!chips) {
        return [];
      }

      return Array.isArray(chips) ? chips : [chips];
    },
    actionDataId() {
      return this.data[this.actionField] ?? null;
    },
    cardActon() {
      return this.$store.getters["data_card/getForm"].find((item) => item.name === this.actionDataId) || {};
    },
  },
  methods: {
    onClick() {
      this.$refs.actionBtn.$el?.click();
    },
  },
};
</script>

<style scoped>
.chips-content-wrapper .title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25rem;
  margin-top: 8px;
  margin-bottom: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.chips-content-wrapper {
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 12px 24px;
  border-radius: 16px;
  overflow: hidden;
}

.chips-content-wrapper:hover {
  cursor: pointer;
}

.chips-content-wrapper .footer {
  width: 100%;
  position: relative;
}

.chips-content-wrapper .footer::v-deep button {
  border: 0;
  border-top: 1px solid rgba(240, 240, 240, 1);
  padding: 0;
  height: 46px;
  font-family: SF Pro Display;
  font-weight: 600;
  font-size: 1rem;
  line-height: 50px;
  text-align: center;
  color: var(--lgreen);
  display: grid;
  align-items: center;
  width: 100%;
  border-radius: 0;
}

.chips-content-wrapper .footer::v-deep button:hover {
  background-color: transparent;
}

.chips-content-wrapper .chips {
  background-color: #edf8ea;
  color: #43b02a;
  padding: 4px 12px;
  font-size: 0.875rem;
  line-height: 1rem;
}

.chips-content-wrapper .chips {
  padding: 4px 12px;
  font-size: 0.875rem;
  line-height: 1rem;
  border-radius: 16px;
  display: inline-block;
  margin-bottom: 16px;
  background-color: #f2f4f5;
  color: #292929;
}

.chips-content-wrapper .chips.chip-color-green {
  background-color: #edf8ea;
  color: #43b02a;
}

.chips-content-wrapper .chips.chip-color-red {
  background-color: #fff1eb;
  color: #292929;
}

@media (max-width: 992px) {
  .chips-content-wrapper {
    min-width: 260px;
  }
}
</style>
