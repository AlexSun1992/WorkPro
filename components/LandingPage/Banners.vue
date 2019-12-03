<template>
  <div>
    <b-row class="card-content">
      <b-col v-for="item in items" :key="item.main_title" lg="6" sm="12" md="6">
        <b-card class="border-light text-center card_content">
          <div class="picture"><img :src="item.picture"></div>
          <div class="head_title">{{item.title}}</div>
          <div v-html="item.description" class="description"/>
          <NLink  class="px-3" :to="item.link.url">
            {{item.link.name}}
          </NLink>
        </b-card>
      </b-col>
    </b-row><!--/.row-->
  </div>
</template>

<script>
  export default {
    name: 'Banners',
    props: {
      items: {
        type: Array,
        required: true,
        default: () => []
      }
    },
  }
</script>

<style scoped>
  .head_title {
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    line-height: 20px;
  }
  .description {
    padding: 20px;
  }
  .card-content > div > div.card {
    height: calc(100% - 15px);
    margin-bottom: 15px;
  }
  .picture {
    text-align: center;
  }
</style>
