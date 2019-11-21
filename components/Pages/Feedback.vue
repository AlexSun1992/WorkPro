<template>
    <div>
      <div v-html="content"></div>
      <v-runtime-template :template="content"></v-runtime-template>
      <ul>
        <li v-for="todo in todos">
          <input type="checkbox" :checked="todo.done" @change="toggle(todo)">
          <span :class="{ done: todo.done }">{{ todo.text }}</span>
        </li>
        <li><input placeholder="What needs to be done?" @keyup.enter="addTodo"></li>
      </ul>
    </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: 'Feedback',
    head: {
      title: 'Обратная связь'
    },
    async asyncData ({ $axios }) {
      return {content: "<b-card></b-card>"}
    },
    async fetch({store}) {
      await store.dispatch("cars/get", "74")
    },
    components: {VRuntimeTemplate},
    computed: {
      todos () {
        return this.$store.state.todos.list
      },
      ...mapState({
        car: state => state.cars.car
      })
    },
    methods: {
      addTodo (e) {
        this.$store.commit('todos/add', e.target.value)
        e.target.value = ''
      },
      ...mapMutations({
        toggle: 'todos/toggle'
      })
    }
  }
</script>

<style scoped>

</style>
