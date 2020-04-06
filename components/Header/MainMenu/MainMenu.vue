<template>
  <div>
    <NLink class="px-3" :to="item.link.url" @click.native="setUrl(item.link.url)" v-for="(item, index) in menu" :key="index">
    {{ item.link.title }}
  </NLink>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  methods: {
    setUrl(url) {
      this.$store.dispatch('pages/setUrl', url)
    }
  },
  computed: {
    menu() {
      return this.$store.getters['pages/getMenu'];
    }
  }
}
</script>
