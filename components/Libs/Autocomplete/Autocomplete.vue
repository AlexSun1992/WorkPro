<template>
  <div class="autocomplete">
    <b-form-input
      class="form-control"
      type="text"
      v-model="selection"
      :id="data.fieldId"
      :placeholder="placeholder"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="change"
      @mousedown="open = true"
      autocomplete="off"
      @blur="debouncedClose()"
    ></b-form-input>
    <ul
      v-if="open"
      :class="{ 'dropdown-menu': open }"
    >
      <li
        v-for="(suggestion, i) in matches"
        :key="i"
        :class="{ active: isActive(i) }"
        @click="suggestionClick(i)"
      >
        <span>{{ suggestion }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      open: false,
      current: 0,
      selection: null,
      debouncedClose: null,
    };
  },

  props: {
    suggestions: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  created() {
    this.debouncedClose = debounce(this.closeList, 300);
  },
  methods: {
    closeList() {
      this.open = false;
    },
    enter() {
      this.selection = this.matches[this.current];
      this.open = false;
      this.$emit("update", this.selection);
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
    change() {
      if (this.open == false) {
        this.open = true;
        this.current = 0;
      }
    },
    suggestionClick(index) {
      this.selection = this.matches[index];
      this.open = false;
      this.$emit("update", this.selection);
    },
  },
  computed: {
    matches() {
      if (this.selection) {
        return this.suggestions.filter((str) => {
          str = str.toLowerCase();
          this.selection = this.selection.toLowerCase();
          return str.indexOf(this.selection) >= 0;
        });
      } 
        return this.suggestions;
      
    },
  },
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
.autocomplete .dropdown-menu {
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  padding: 1px;
  list-style: none;
  margin: 0;
  border-radius: 0 0 6px 6px;
  border-top: 0px;
  /*border-color: #8ad4ee;*/
  border: 1px solid #8ad4ee;
  border-top: 0;
  background-color: #fff;
  margin-top: -5px;
  padding-top: 5px;
}
.autocomplete .dropdown-menu li {
  padding: 5px 10px;
  border-bottom: 1px solid #fafafa;
}
.autocomplete .dropdown-menu li:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
.autocomplete .form-control {
  box-shadow: none;
}
.autocomplete .dropdown-menu li.active {
  background-color: rgba(0, 0, 0, 0.03);
}
.form-control:focus {
  box-shadow: none;
}
</style>
