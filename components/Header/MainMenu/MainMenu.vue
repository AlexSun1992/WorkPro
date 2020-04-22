<template>
  <div>
    <NLink class="px-3" :to="item.link.url" v-for="(item, index) in menu" :key="index">
    {{ item.link.title }}
  </NLink>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  computed: {
    menu() {
      return this.$store.getters['pages/getMenu'];
    }
  }
}
</script>
