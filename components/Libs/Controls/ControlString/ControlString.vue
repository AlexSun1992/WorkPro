<template>
    <b-form-group class="mb-0"  :label="label" :class="{required: data.required}">
      <string-autocomplete
        :data="data"
        :edit="edit"
        @update="data.value=$event"
        @code="getCode($event)"
      ></string-autocomplete>
    </b-form-group>
</template>

<script>
import StringAutocomplete from './StringAutocomplete'
export default {
  name: 'ControlString',
  components: { StringAutocomplete },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  computed: {
    label () {
      return `${this.data.label}`
    }
  },
  methods: {
    getCode(e) {
      this.data.value=e;
      this.$emit('update', e);
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
