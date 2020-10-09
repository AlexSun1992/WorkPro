<template>
    <b-form-group :label="label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols ? '' : 2" :label-class="data.labelCols">
      <string-autocomplete
        :data="data"
        :edit="edit"
        @update="updateField($event)"
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
    updateField (e) {
      this.data.value = e.value
      this.$emit('update', e)
    }
  }
}
</script>

<style scoped>
  .form-group {
    margin-bottom: 0!important;
  }
</style>
