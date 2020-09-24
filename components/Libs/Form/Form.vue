<template>
  <b-form-row>
    <b-tabs v-if="captions" content-class="mt-4">
      <b-tab :title="tab" v-for="(tab, index) in captions" :key="index">
        <div class="row">
          <Control v-for='(item, i) in items(index)' :key="i"
            @update="$emit('update', $event)" 
            @clear="$emit('clear', $event)" 
            :data="item" 
            :edit="edit" 
            :cols="cols">
          </Control>
        </div>
      </b-tab>
    </b-tabs>
    <div v-else class="row">
      <Control v-for='(item, i) in items()' :key="i"
        @update="$emit('update', $event)" 
        @clear="$emit('clear', $event)"
        :data="item" 
        :edit="edit" 
        :cols="cols">
      </Control>
    </div>
  </b-form-row>
</template>
<script>
import Control from '~/components/Libs/Controls/Control'
export default {
  name: 'Form',
  components: {Control},
  props: {
    data: {
      type: Array | null,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1
    }
  },
  methods: {
    items(index) {
      if (this.data) {
        return this.data.filter(item => {
          if (this.captions) {
            if (index != item.page) return;
          }
          if (!item.visible) return; 
          return this.edit || !this.edit && item.value;
        })
      }
    }
  },
  computed: {
    captions: function() {
      return this.$store.getters['data_card/getCaptions'];
    }
  }
}
</script>
