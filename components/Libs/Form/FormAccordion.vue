<template>
  <div>
    <div v-for="(tab, index) in captions" :key="index" class="mb-1">
      <div v-if="tab.displayed">
        <div class="block-border-one block p-1 mb-1 header">
          <div class="label">
            <strong>{{ tab.label }}</strong>
          </div>
          <div type="button" class="toggle-button" @click="toggleButton(index)">
            {{ buttonTitle(tab) }}
          </div>
        </div>
        <div v-show="tab.visible" class="bg-six block-border-one block p-3">
          <div class="row">
            <template v-if="items(index).length">
              <Control
                v-for="(item, i) in items(index)"
                :key="i"
                @update="$emit('update', $event)"
                @clear="$emit('clear', $event)"
                @open-card="$emit('open-card', $event)"
                :data="item"
                :edit="edit"
                :cols="cols"
                :store="store"
              >
              </Control>
            </template>
            <div v-else>
              <TableEditor
                class="m-4"
                v-if="cardId != 0"
                :id="driverTab.id"
                :name="driverTab.label"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Control from "~/components/Libs/Controls/Control";
import TableEditor from "@/components/Libs/TableEditor/TableEditor";
export default {
  name: "FormAccordion",
  components: { Control, TableEditor },
  data() {
    return {};
  },
  props: {
    data: {
      type: Array | null,
      required: true,
    },
    tabs: {
      type: Array,
      required: false,
    },
    edit: {
      type: Boolean,
      required: true,
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1,
    },
    invalidFields: {
      type: Array | null,
      required: false,
    },
    store: {
      type: String,
      required: false,
      default: "data_card",
    },
  },
  mounted() {
    this.$store.dispatch(`${this.store}/updateCaptions`, 0);
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (this.captions) {
            if (index != item.page) return null;
          }
          if (!item.visible) return null;
          return this.edit || (!this.edit && item.value);
        });
      }
    },
    highlightTab(i) {
      let invalidFields = this.$store.getters[`${this.store}/getForm`].filter(
        (item) => item.state == false
      );
      let invalidField = invalidFields.find((item) => item.page == i);
      if (invalidField) return true;
    },
    toggleButton(index) {
      this.$store.dispatch(`${this.store}/updateCaptions`, index);
    },
    buttonTitle(tab) {
      return tab.visible ? "cвернуть" : "развернуть";
    },
  },
  computed: {
    captions: function () {
      return this.$store.getters[`${this.store}/getCaptions`];
    },
    cardId: function () {
      return this.$store.getters[`${this.store}getCardId`];
    },
    driverTab: function () {
      return this.tabs[0];
    },
  },
};
</script>

<style scoped>
.header {
  /* background-color: #cbe0d7; */
  /* cursor: pointer; */
  /* text-align: right; */
  border-bottom: 1px solid rgb(30, 184, 105);
  display: flex;
  justify-content: space-between;
}
.error {
  background-color: #f5c6cb;
  cursor: pointer;
  text-align: center;
}
.toggle-button {
  cursor: pointer;
  text-decoration: underline;
  color: rgb(30, 184, 105);
}
.label {
  text-align: left;
}
/* .btn {
  border: 0;
  cursor: pointer;
  padding: 0;
  width: 99%;
  background-color: #cbe0d7;
} */
</style>
