<template>
  <div>
    <i v-b-toggle.collapse-1 class="fa fa-search fa-lg" aria-hidden="true" @click="clearSearch()"></i>
    <b-collapse ref="collapse" id="collapse-1" class="mt-3">
      <b-card>
        <b-input-group class="search">
          <b-form-input v-model="queryStr" @keydown.enter="search()" placeholder="Поиск по сайту"></b-form-input>
          <b-input-group-append class="ml-3">
            <b-button @click="search()" variant="success">Найти</b-button>
          </b-input-group-append>
        </b-input-group>
        <div v-if="searchResult">
          <div>
            <h4>Результаты поиска:</h4>
          </div>
          <div class="my-2">
            По запросу <strong>'{{ searchInput }}'</strong> найдено <span v-if="searchResult">{{ searchResult.length }}</span> {{resultQty}}.
          </div>
        </div>
        <div class="result" v-for="(item, i) in this.searchResult" :key="i">
          <h6 class="mr-1">{{ i + 1 }}.</h6>
          <div v-html="highlight(item.excerpt.rendered)"></div>
        </div>
        <div>
          <div class="overflow-auto mt-2" v-if="searchResult">
            <b-pagination v-model="currentPage" size="sm" align="center"></b-pagination>
          </div>
        </div>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>

export default {
  data() {
    return {
      queryStr: null,
      searchResult: null,
      test: null,
      searchInput: null,
      resultQty: null,
      currentPage: 1
    }
  },
  mounted() {
    this.$refs["collapse"].$el.style.position = "absolute";
  },
  methods: {
    async search() {
      if (!this.queryStr) return;
      this.searchResult = null;
      this.searchInput = this.queryStr;
      this.searchResult = await this.$store.dispatch("search", this.queryStr);
      this.items = this.searchResult;
      this.resultQty = this.enumerate(this.searchResult.length.toString());
    },
    enumerate(num) {
      let lastChar = num.charAt(num.length - 1);
      let result = 'совпадени';
      if (num.length > 2) {
        num = num.charAt(num.length - 2) + num.charAt(num.length - 1);
      }
      if (lastChar == 0 || lastChar >= 5 && lastChar <= 9 || num >= 10 && num <= 20) {
        return result + 'й';
      } else if (lastChar == 1 ) {
        return result + 'е';
      } else if (lastChar >= 2 && lastChar <= 4) {
        return result + 'я';
      }
    },
    highlight(content) {
      return content.replace(new RegExp(this.searchInput, "gi"), match => {
        return '<strong>' + match + '</strong>'
      })
    },
    clearSearch() {
      this.searchResult = null;
      this.queryStr = null;
    }
  }
};
</script>

<style scoped>
.result {
  display: flex;
  max-width: 60vw;
}
.search {
  display: flex; 
  justify-content: center;
}
.collapse {
  z-index: 1;
  width: 100%;
  left: 0;
}
.card {
  border: 1px solid rgb(216, 211, 211);
  border-radius: 0;
}
.fa-search {
  color: #20a8d8;
}
</style>
