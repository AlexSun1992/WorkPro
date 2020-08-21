<template>
  <div class="autocomplete">
    <b-form-input
      class="form-control"
      :type="getType(data.name)"
      v-model="data.value"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      :placeholder="showPlaceholder(data.name)"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="getSuggestions(data.name)"
      @blur="debouncedClose()"
      :id="data.name"
    ></b-form-input>
    <b-form-invalid-feedback>Обязательно для заполнения</b-form-invalid-feedback>
    <ul v-if="open && suggestions && suggestions.data && suggestions.data.length" :class="{'dropdown-menu': open}">
      <li
        v-for="(suggestion, i) in suggestions.data"
        :key="i"
        :class="{'active': isActive(i)}"
        @click="suggestionClick(i)"
      >
        <span>{{ suggestion }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      open: false,
      current: 0,
      suggestions: {},
      debouncedClose: null
    };
  },
  props: ['data', 'edit'],
  created() {
    this.debouncedClose = _.debounce(this.closeList, 300)
  },
  methods: {
    closeList() {
      this.open = false;
    },
    enter() {
      this.open = false;
      this.suggestionClick(this.current);
      // this.$emit("update", this.suggestions.data[this.current]);
    },
    up() {
      if (this.current > 0) {
        this.current--;
      }
    },
    down() {
      if (this.current < this.suggestions.data.length - 1) {
        this.current++;
      }
    },
    isActive(index) {
      return index === this.current;
    },
    suggestionClick(index) {
      this.open = false;
      let issuedWhere = this.$parent.$parent.$parent.$parent.$children.find(item => {
          return item.data.name === 'SISSUED_WHERE';
        });
      let docDep = this.$parent.$parent.$parent.$parent.$children.find(item => {
        return item.data.name === 'SDOCDEP';
      });
      if (this.suggestions.type === 'SISSUED_WHERE') {
        this.$set(issuedWhere.data, 'value', null);
        this.$set(issuedWhere.data, 'value', this.suggestions.data[index].split(' - ')[0]);
        this.$set(docDep.data, 'value', this.suggestions.data[index].split(' - ')[1]);
      }
      else if (this.suggestions.type === 'SDOCDEP') {
        this.$set(issuedWhere.data, 'value', null);
        this.$set(issuedWhere.data, 'value', this.suggestions.data[index].split(' - ')[1]);
        this.$set(docDep.data, 'value', this.suggestions.data[index].split(' - ')[0]);
      } else {
        this.$emit("update", this.suggestions.data[index]);
      }
      this.open = false;
    },
    async getSuggestions(name) {
      this.$emit('changed-field', {
        name,
        value: this.data.value
      });
      let API_KEY = '7a6080c3383b4dc69e786e1cd5c88366ab58a14c';
      this.open = true;
      this.current = 0;
      let suggestionType;
      let params = {
        query: this.data.value,
        suggestionType,
        key: API_KEY
      };
      if (name === 'SFIRSTNAME' || name === 'SSECONDNAME' || name === 'STHIRDNAME') {
        params.suggestionType = 'fio';
        if (name === 'SFIRSTNAME') {
          params.parts = ["NAME"];
        } else if (name === 'SSECONDNAME') {
          params.parts = ["SURNAME"];
        } else if (name === 'STHIRDNAME') {
          params.parts = ["PATRONYMIC"];
        }
        let result = await this.$store.dispatch('card/fetchSuggestions', params);
        this.$set(this.suggestions, 'data', result.map(item => item.value));
        return;
      } else if (name.includes('ADDRESS')) {
        params.suggestionType = 'address';
        let result = await this.$store.dispatch('card/fetchSuggestions', params);
        this.$set(this.suggestions, 'data', result.map(item => item.value));
      } else if (name === 'SISSUED_WHERE' || name === 'SDOCDEP') {
        params.suggestionType = 'fms_unit';
        let suggestions = {};
        suggestions.data = await this.$store.dispatch('card/fetchSuggestions', params);
        let obj = {};
        let values;
        if (name === 'SISSUED_WHERE') {
          values = suggestions.data.map(item => {
            return `${item.data.name} - ${item.data.code}`
          });
          obj.type = 'SISSUED_WHERE';
        }
        if (name === 'SDOCDEP') {
          values = suggestions.data.map(item => {
            return `${item.data.code} - ${item.data.name}`
          });
          obj.type = 'SDOCDEP';
        }
        obj.values = values;
        this.$set(this.suggestions, 'data', obj.values);
        this.$set(this.suggestions, 'type', obj.type);
      }
    },
    showPlaceholder(name) {
      if (name === 'SNEWPHONE') {
        return 'Введите 10 цифр Вашего телефона'
      } else if (name === 'SCODEFIELD') {
        return 'Введите код';
      } else if (name === 'SNEWEMAIL') {
        return 'Введите новый email';
      }
    },
    getType(name) {
      if (name === 'SNEWPHONE' || name === 'SCODEFIELD') {
        return 'number';
      } else {
        return 'text';
      }
    }
  }
};
</script>

<style scoped>
  .autocomplete {
    position: relative;
  }
  .dropdown-menu {
    display: block;
    width: 100%;
  }
  .active {
    background-color: lightgrey;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
