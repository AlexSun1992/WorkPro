<template>
  <b-form-row>
    <b-tabs v-if="captions" content-class="mt-4">
      <b-tab
        :title="tab"
        v-for="(tab, index) in captions"
        :key="index"
        :title-link-class="{'error': highlightTab(index)}"
      >
        <div class="row">
          <Control
            v-for="(item, i) in items(index)"
            :key="i"
            @update="$emit('update', $event)"
            @clear="$emit('clear', $event)"
            @open-card="$emit('open-card', $event)"
            :data="item"
            :edit="edit"
            :cols="cols"
          >
          </Control>
        </div>
      </b-tab>
    </b-tabs>
    <div v-else class="row">
      <Control
        v-for="(item, i) in items()"
        :key="i"
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
        :data="item"
        :edit="edit"
        :cols="cols"
      >
      </Control>
    </div>
  </b-form-row>
</template>
<script>
import Control from "~/components/Libs/Controls/Control";
export default {
  name: "Form",
  components: { Control },
  props: {
    data: {
      type: Array | null,
      required: true,
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
      required: false
    }
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter((item) => {
          if (this.captions) {
            if (index != item.page) return;
          }
          if (!item.visible) return;
          return this.edit || (!this.edit && item.value);
        });
      }
    },
    highlightTab(i) {
      let invalidFields = this.$store.getters['data_card/getForm'].filter(item => item.state == false )
      let invalidField = invalidFields.find(item => item.page == i)
      if (invalidField) return true
    }
  },
  computed: {
    captions: function () {
      return this.$store.getters["data_card/getCaptions"];
    },
  },
};
</script>

<style>
.error {
  color: red !important;
}
</style>
