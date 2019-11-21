<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col v-for="policy in policies" :key="policy.ID" sm="6" md="4">
          <b-card :header="policy.SPOLICY_NUMBER">
            <div>{{policy.SPOLOBJ}}</div>
            <div>{{policy.SPRODUCTNAME}}</div>
            <div>{{policy.DFROMDATE}}</div>
            <div>{{policy.DTODATE}}</div>
          </b-card>
        </b-col>
      </b-row><!--/.row-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Policies',
    async asyncData ({ $axios, app }) {
      try {
        const data = await $axios.$get('/am/main/v2/data/55/8')
        return {policies: data[0]._data}
      } catch (e) {
        const code = parseInt(e.response && e.response.status);
        if ([401, 403].includes(code)) {
          app.$auth.logout();
        }
      }
    }
  }
</script>

<style scoped>

</style>
