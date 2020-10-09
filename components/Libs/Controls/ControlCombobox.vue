<template>
  <div>
    <b-form-group :label="data.label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols ? '' : 2" :label-class="data.labelCols">
      <b-form-select v-model="fieldValue" :options="data.options" size="sm" class="mt-3"></b-form-select>
    </b-form-group>
  </div>
</template>

<script>

export default {
  name: 'ControlCombobox',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value
      },
      set: function (value) {
        this.$emit('update', { fieldId: this.data.fieldId, value: String(value) })
      }
    }
  }
}
</script>

<style scoped>
  .ui.disabled.dropdown[data-v-3a0c7bea], .ui.dropdown .menu > .disabled.item[data-v-3a0c7bea] {
    cursor: default;
    pointer-events: none;
    opacity: 1;
  }

  .error {
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #f86c6b;
  }

  .required > legend:after {
    content: '*';
    color: red;
  }

</style>
