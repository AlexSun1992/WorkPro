<template>
  <div class="autocomplete">
    <b-form-input
      class="form-control"
      type="text"
      v-model="data.value"
      :disabled="!edit"
      :required="data.required"
      :state="data.state"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="getSuggestions(data.name)"
    ></b-form-input>
    <b-form-invalid-feedback>Обязательно для заполнения</b-form-invalid-feedback>
    <ul v-if="open && suggestions && suggestions.length" :class="{'dropdown-menu': open}">
      <li
        v-for="(suggestion, i) in suggestions"
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
export default {
  data() {
    return {
      open: false,
      current: 0,
      suggestions: null
    };
  },
  props: ['data', 'edit'],
  methods: {
    enter() {
      this.open = false;
      this.$emit("update", this.suggestions[this.current]);
    },
    up() {
      if (this.current > 0) {
        this.current--;
      }
    },
    down() {
      if (this.current < this.suggestions.length - 1) {
        this.current++;
      }
    },
    isActive(index) {
      return index === this.current;
    },
    suggestionClick(index) {
      this.open = false;
      if (!index) return;
      this.$emit("update", this.suggestions[index]);
    },
    async getSuggestions(name) {
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
        } else {
          params.parts = ["PATRONYMIC"];
        }
      } else if (name.includes('ADDRESS')) {
        params.suggestionType = 'address';
      } else return;
      this.suggestions = await this.$store.dispatch('card/fetchSuggestions', params)
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
</style>
