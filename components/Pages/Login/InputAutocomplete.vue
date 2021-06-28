<template>
  <div class="autocomplete">
    <ul>
      <li
        v-for="(item, index) in matches"
        :key="item[filterby]"
        @click="itemClicked(index, matches)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["items", "filterby", "stringValue"],

  methods: {
    itemClicked(index, matches) {
      console.log(matches[index]);
      this.$emit("setValue", index, matches);
      this.$emit("setName", index, matches);
      this.$emit("setSurname", index, matches);
      this.$emit("setEmail", index, matches);
    },
  },

  computed: {
    matches() {
      return this.items;
    },
  },
};
</script>

<style scoped>
.autocomplete {
  width: 100%;
  position: relative;
  box-shadow: 0 0 1px 1px black;
  max-height: 100px;
  overflow-y: scroll;
}

.autocomplete ul {
  margin: 0;
}

.autocomplete ul li {
  list-style-type: none;
  text-align: left;
  padding-left: 0;
  width: 100%;
  cursor: pointer;
  background: #f1f1f1;
}

li {
  list-style: none;
  border-bottom: 1px solid lightgrey;
  padding: 10px;
  cursor: pointer;
}

.autocomplete ul li:not(.selected):hover {
  background: #8c8c8c;
  color: #fff;
}

.options ul li.selected {
  background: #8c8c8c;
}

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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.error {
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
.autocomplete ul.dropdown-menu {
  display: block;
  margin-top: -5px;
}
</style>
