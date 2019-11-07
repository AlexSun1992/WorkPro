<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col lg="12">
          <b-card>
            <div
              v-html="content"
            />
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData ({ $axios }) {
      const data = await $axios.$get('/wp-json/wp/v2/pages/74')
      return {content:data.content.rendered}
    },
    head: {
      title: 'О компании'
    }
  }
</script>
