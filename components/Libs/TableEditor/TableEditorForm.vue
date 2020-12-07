<template>
  <div>
    <b-form-row>
      <b-tabs v-if="captions" content-class="mt-4">
        <b-tab :title="tab" v-for="(tab, index) in captions" :key="index">
          <div class="row">
            <Control
              v-for="(item, i) in items(index)"
              :key="i"
              @update="$emit('update', $event)"
              :data="item"
              :edit="edit"
              :cols="cols"
            >
            </Control>
          </div>
        </b-tab>
      </b-tabs>
    </b-form-row>
  </div>
</template>

<script>
import Control from "@/components/Libs/Controls/Control";

export default {
  name: "TableEditorForm",
  components: { Control },
  props: {
    data: {
      type: Object | null,
      default: () => {},
      required: true,
    },
    edit: {
      type: Boolean,
      default: () => true,
      required: false,
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1,
    },
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.metaData.data.filter((item) => {
          if (this.captions) {
            if (index != item.page) return;
          }
          if (!item.visible) return;
          return this.edit || (!this.edit && item.value);
        });
      }
    },
  },
  computed: {
    captions: function () {
      return this.data?.metaData.captions.split(";");
    },
  },
};
</script>

<style scoped></style>
