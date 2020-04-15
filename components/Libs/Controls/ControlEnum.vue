<template>
  <span  @click="onfocus">
    <b-form-group   :label="data.label">
      <model-list-select  :list="options"
                         option-value="value"
                         option-text="text"
                         :isDisabled="!edit"
                         :isError="data.state === false"
                         v-model="data.value"
                         placeholder="Выберите из списка"
                         @searchchange="initData">
      </model-list-select>
      <span class="error" v-if="data.state === false">
      Обязательно для заполнения
    </span>
    </b-form-group>
  </span>
</template>

<script>
import {ModelListSelect} from 'vue-search-select'
import select from '@/services/select'

export default {
  name: 'ControlEnum',
  components: {ModelListSelect},
  data () {
    return {
      options: [],
      param: ''
    }
  },
  created () {
    if (this.data.value.value) this.options.push(this.data.value)
  },
  watch: {
    data: function (val) {
      this.options = []
    }
  },
  methods: {
    initData (param) {
      select.getData(this.data.dic, param).then((data) => {
        this.options = data
      })
    },
    optionDisplayText (option) {
      return option.text
    },
    onfocus () {
      if (this.edit) {
        this.initData()
      }
    }
  },
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

</style>
