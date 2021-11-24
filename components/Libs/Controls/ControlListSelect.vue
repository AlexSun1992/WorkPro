<template>
  <div>
    <b-button
      class="mb-2"
      :class="visible ? null : 'collapsed'"
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="collapse-4"
      @click="visible = !visible"
    >
      {{ data.label }}
    </b-button>
    <b-collapse id="collapse-4" v-model="visible" class="mt-2">
      <b-card>
        <b-col style="width: 50rem">
          <grid
            :action="true"
            :total="dataContent.total"
            :fields="dataContent.fields"
            :items="dataContent.items"
          >
            <template v-slot:actions="slotProps">
              <b-button class="btn-table-open">Выбрать</b-button>
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
  async fetch() {
    try {
      await this.$store.dispatch("blocks/fetchBlock", {
        id: this.data.menudic,
        query: {},
      });
    } catch (err) {
      this.$bvToast.toast(err.response.data.MESSAGE, {
        title: "Ошибка",
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    }
  },
  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](
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
};
</script>

<style scoped></style>
