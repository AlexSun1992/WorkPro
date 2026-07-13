<template>
  <div class="autocomplete">
    <input
      :id="data.fieldId"
      v-model="selection"
      class="form-control"
      type="text"
      :placeholder="placeholder"
      autocomplete="off"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="change"
      @mousedown="open = true"
      @blur="debouncedClose()"
    />
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
  name: "Autocomplete",

  props: {
    suggestions: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      open: false,
      current: 0,
      selection: null,
      debouncedClose: null,
    };
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
      if (!this.open) {
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
  list-style: none;
  border-radius: 0 0 6px 6px;
  border: 1px solid #8ad4ee;
  border-top: 0;
  background-color: #fff;
  margin: -5px 0 0;
  padding: 5px 1px 1px;
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
