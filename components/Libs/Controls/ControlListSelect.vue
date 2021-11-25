<template>
  <div>
    <b-button
      class="mb-2"
      :class="visible ? null : 'collapsed'"
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="collapse-4"
      @click="openList"
    >
      {{ data.value.text || data.label }}
    </b-button>
    <b-collapse id="collapse-4" v-model="visible" class="mt-2">
      <b-card>
        <b-col style="width: 50rem">
          <grid
            :load="isLoad"
            :action="true"
            :total="dataContent.total"
            :fields="dataContent.fields"
            :items="dataContent.items"
          >
            <template v-slot:actions="slotProps">
              <b-button
                v-on:click="selectItem(slotProps)"
                class="btn-table-open"
                >Выбрать</b-button
              >
            </template>
          </grid>
        </b-col>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import Grid from "../Table/Grid";
export default {
  name: "ControlListSelect",
  components: { Grid },
  data() {
    return {
      visible: false,
      isLoad: false,
    };
  },
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
  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
  },
  methods: {
    selectItem(value) {
      this.visible = false;
      this.$store.commit("data_card/setFilters", value.data.item);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: value.data.item.ID,
          text: value.data.item[this.data.name.substring(2)],
        },
      });
    },
    async openList() {
      this.visible = !this.visible;
      if (this.visible) {
        try {
          this.isLoad = true;
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.data.menudic,
            query: this.$store.getters["data_card/getFilters"],
          });
          this.isLoad = false;
        } catch (err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: "Ошибка",
            variant: "danger",
            noAutoHide: true,
            solid: true,
          });
        }
      }
    },
  },
};
</script>

<style scoped></style>
