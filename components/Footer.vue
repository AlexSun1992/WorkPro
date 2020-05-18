<template>
  <footer class="app-footer">
    <div v-for="(item, index) in menu" :key="index">
      <div class="title">
        <h6 class="mr-3">{{ item.title }}</h6>
        <b-button :href="item.link.url" size="sm" v-if="item.link.title" pill variant="success">{{ item.link.title }}</b-button>
      </div>
      <div :class="{col: index == 0}">
        <div class="link" v-for="(item, index) in links(item)" :key="index">
          <div v-if="item.length > 1">
            <div v-for="(item, index) in item" :key="index">
              <a :href="item.link.url">{{ item.link.title }}</a>
            </div>
          </div>
          <div v-else>
            <a :href="item.link.url">{{ item.link.title }}</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'c-footer',
  data() {
    return {
      cols: 2
    }
  },
  methods: {
    links(item) {
      let columns = [];
      let links = [];
      item.sections.forEach(i => {
        links.push(...i.links);
      });
      if(links.length > 5) {
        let mid = Math.ceil(links.length / this.cols);
        for (let col = 0; col < this.cols; col++) {
          columns.push(links.slice(col * mid, col * mid + mid));
        }
        return columns;
      } else {
        return links;
      }
    }
  },
  computed: {
    menu() {
      return this.$store.getters["pages/getFooterMenu"];
    }
  }
}
</script>

<style scoped lang="scss">
  .app-footer {
    border-top: none;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 20px;
  }
  .col {
    display: flex;
    padding: 0;
  }
  .title {
    display: flex; 
    flex-direction: row; 
    margin-bottom: 8px; 
    align-items: baseline;
  }
  .link {
    margin-right: 150px;
  }
</style>
