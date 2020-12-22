<template>
  <div>
    <div v-for="(tab, index) in captions" :key="index" class="mb-1">
      <div v-if="tab.displayed">
        <div class="block-border-one block p-1 mb-1 header">
          <div class="label">
            <strong>{{ tab.label }}</strong>
          </div>
          <div type="button" class="toggle-button" @click="toggleButton(index)">
            {{ tab.visible ? "cвернуть" : "развернуть" }}
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
                :store="store"
              >
              </Control>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Control from "~/components/Libs/Controls/Control";
export default {
  name: "FormAccordion2",
  components: { Control },
  props: {
    data: {
      type: Array | null,
      required: true,
    },
    captions: {
      type: Array,
      required: false,
    },
    store: {
      type: String,
      required: false,
      default: "data_card",
    },
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (this.captions) {
            if (index != item.page) return null;
          }
          if (!item.visible) return null;
          return true;
        });
      }
    },
    toggleButton(index) {
      this.$store.dispatch(`osago/updateCaptions`, index);
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
