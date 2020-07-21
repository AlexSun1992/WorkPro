<template>
  <span  @click="onfocus">
    <b-form-group :label="data.label" :class="{required: data.required}">
      <model-list-select  :list="options"
                         option-value="value"
                         option-text="text"
                         :isDisabled="!edit ? !edit : data.readonly"
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
import 'vue-search-select/dist/VueSearchSelect.css'
import {ModelListSelect} from 'vue-search-select'

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
      // this.options = []
    }
  },
  methods: {
    initData (param) {
      this.$axios({url: `/api/dic/${this.data.dic}`, method: 'GET'})
        .then(resp => {
          this.options = resp.data
        })
        .catch(err => {
          console.log(err)
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

  .required > legend:after {
    content: '*';
    color: red;
  }

</style>
