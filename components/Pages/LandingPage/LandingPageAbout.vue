<template>
<div>
  <b-row>
    <b-col class="content">
        <div class="head_title">{{data.title}}</div>
        <div v-html="data.description" class="description"/>
        <NLink  class="px-3" :to="data.link.url">
          {{data.link.name}}
        </NLink>
    </b-col>
  </b-row><!--/.row-->
</div>
</template>

<script>
  export default {
    name: 'About',
    props: {
      data: {
        type: Object,
        required: true,
        default: () => {}
      }
    }
  }
</script>

<style scoped>
  .head_title {
    font-size: 24px;
    font-weight: bold;
  }
  .description {
    padding: 10px;
  }
  .content {
    text-align: center;
  }
</style>
