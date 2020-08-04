<template>
  <b-col :xl="col" :lg="data.cols" md="12" sm="12" class="mb-4">
    <div class="control" :style="{width: data.width ? data.width : '100%'}">
      <component class="mt-2 mr-3" v-bind:is="comp" @edit="$emit('edit', $event)" @update="$emit('update', $event)" v-bind:data="data" v-bind:edit="edit"></component>
    </div>
  </b-col>
</template>
<script>
import ControlString from '~/components/Libs/Controls/ControlString/ControlString'
import ControlText from '~/components/Libs/Controls/ControlText'
import ControlBoolean from '~/components/Libs/Controls/ControlBoolean'
import ControlDouble from '~/components/Libs/Controls/ControlDouble'
import ControlLong from '~/components/Libs/Controls/ControlLong'
import ControlTimestamp from '~/components/Libs/Controls/ControlTimestamp'
import ControlPeriod from '~/components/Libs/Controls/ControlPeriod'
import ControlClob from '~/components/Libs/Controls/ControlText'
import ControlEnum from '~/components/Libs/Controls/ControlEnum'
import ControlButton from '~/components/Libs/Controls/ControlButton'
import ControlEmpty from '~/components/Libs/Controls/ControlEmpty'
import ControlLink from '~/components/Libs/Controls/ControlLink'

export default {
  name: 'Control',
  components: {ControlString, ControlText, ControlBoolean, ControlDouble, ControlLong, ControlTimestamp, ControlPeriod, ControlClob, ControlEnum, ControlButton, ControlEmpty, ControlLink},
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
    },
    cols: {
      type: Number,
      required: true,
      default: () => 1
    }
  },
  computed: {
    comp: function () {
      return 'Control' + this.data.type.charAt(0).toUpperCase() + this.data.type.slice(1)
    },
    col: function () {
      return 12 / this.cols * this.data.col
    }
  },
  watch: {
    'data.value': 'eventValidate'
  },
  methods: {
    eventValidate () {
      if (this.data.required) {
        if (this.data.value != null && this.data.value !== '') {
          this.data.state = null
          this.data.checked = true
        }
        if (this.data.checked) {
          if (this.data.value == null || this.data.value === '') {
            this.data.state = false
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .control > fieldset {
    margin-bottom: 0;
  }
</style>
