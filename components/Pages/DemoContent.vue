<template>
  <ul>
    <li
      v-for="todo in filteredTodos"
      v-bind:key="todo.id"
    >
      <!--
      Указываем слот для каждой задачи, передавая
      объект `todo` в качестве входного параметра.
      -->
      <slot name="data" v-bind:content="{todo,filteredTodos}">
        <!-- Содержимое по умолчанию -->
        {{ todo.name }}
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DemoContent',
  data () {
    return {
      filteredTodos: [
        {
          name: 'Основные',
          idItem: 19,
          id: 1101,
          actions: []
        },
        {
          name: 'Список водителей',
          idItem: 21,
          id: 1102
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
