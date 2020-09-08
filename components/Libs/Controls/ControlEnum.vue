<template>
  <span  @click="onfocus">
    <b-form-group :label="data.label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols ? '' : 2" :label-class="data.labelCols">
      <model-list-select  :list="options"
                         option-value="value"
                         option-text="text"
                         :isDisabled="!edit ? !edit : data.readonly"
                         :isError="data.state === false"
                         v-model="fieldValue"
                         @input="updateMessage"
                         placeholder="Выберите из списка"
                         @select="onSelect"
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
  methods: {
    updateMessage(e){
      console.log(e)
    },
    initData (param) {
      let url = '';
      if(this.relationValue){
        if(this.relationValue.value){
          url = `/api/dicwf/${this.data.fieldId}/${this.relationValue.value.value}`
        }
      }
      else{
        url = `/api/dic/${this.$route.params.idModule}/${this.data.id}/${this.data.dic}`
      }
      this.$axios({url: url, method: 'GET'})
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
    },
    onSelect (items, lastSelectItem) {
      console.log(lastSelectItem)
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
  },
  computed: {
    relationValue: {
      get: function () {
        if(this.data.isRelation){
          return this.$store.getters['card/getWizardDataFieldByName'](this.data.fieldRelation)
        }
        else{
          return null
        }
      }
    },
    fieldValue: {
      get: function () {
        return this.data.value
      },
      set: function (value) {
        this.$store.commit('card/setWizardField', {fieldId:this.data.fieldId, isTab:this.data.isTab, value:value, page: this.data.page});
        this.$store.commit('card/clearWizardRelationField', {fieldName:this.data.name});
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
