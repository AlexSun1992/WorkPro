<template>
    <b-form-group class="mb-0"  :label="label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols">
      <string-autocomplete
        :data="data"
        :edit="edit"
        @update="data.value=$event"
        @changed-field="updateField($event)"
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
    updateField(e) {
      this.data.value=e.value;
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
