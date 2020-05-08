<template>
  <div>
    <b-modal ref="products" hide-footer hide-header>
        <div class="mb-4" v-for="(item, index) in products.sections" :key="index">
          <h3>{{item.title}}</h3>
          <span v-for="(link, index) in item.links" :key="index">
            <b-button class="mr-4" :href="link.link.url">{{link.link.title}}</b-button>
          </span>
        </div>
    </b-modal>
    <span class="px-3"  v-for="(item, index) in menu" :key="index">
      <span v-if="!item.sections"><a :href="item.link.url">{{ item.title }}</a></span>
      <b-button variant="link" v-if="item.sections" @click="showProducts(item)" v-b-modal.modal-1>{{ item.title }}<i class="fa fa-chevron-down" aria-hidden="true"></i></b-button>
  </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: {}
    }
  },
  methods: {
    showProducts(data) {
      this.products = data
      this.$refs['products'].show()
    }
  },
  computed: {
    menu() {
      return this.$store.getters['pages/getMenu'];
    }
  }
}
</script>
