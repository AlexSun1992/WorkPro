<template>
  <div class="autocomplete">
    <b-form-input
      class="form-control"
      type="text"
      v-model="selection"
      :placeholder="placeholder"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="change"
    ></b-form-input>
    <ul v-if="open" :class="{'dropdown-menu': open}">
      <li
        v-for="(suggestion, i) in matches"
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
  data () {
    return {
      open: false,
      current: 0,
      selection: null
    }
  },

  props: {
    suggestions: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String
    }
  },
  methods: {
    enter () {
      this.selection = this.matches[this.current]
      this.open = false
      this.$emit('update', this.selection)
    },
    up () {
      if (this.current > 0) {
        this.current--
      }
    },
    down () {
      if (this.current < this.suggestions.length - 1) {
        this.current++
      }
    },
    isActive (index) {
      return index === this.current
    },
    change () {
      if (this.open == false) {
        this.open = true
        this.current = 0
      }
    },
    suggestionClick (index) {
      this.selection = this.matches[index]
      this.open = false
      this.$emit('update', this.selection)
    }
  },
  computed: {
    matches () {
      return this.suggestions.filter(str => {
        str = str.toLowerCase()
        this.selection = this.selection.toLowerCase()
        return str.indexOf(this.selection) >= 0
      })
    }
  },
  watch: {
    selection: function (val) {
      if (!this.selection) {
        this.open = false
      }
    }
  }
}
</script>

<style scoped>
.autocomplete {
  position: relative;
  width: 70%;
}
.dropdown-menu {
  display: block;
  width: 100%;
}
.active {
  background-color: lightgrey;
}
</style>
