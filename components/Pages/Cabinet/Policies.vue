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
    data() {
      return {
        policies: []
      }
    },
    async mounted() { // only client side hook no need to check
      const { data } = await this.$axios.get('/am/main/v2/data/55/8'); // await is not mandatory
      this.policies = data[0]._data
    }
  }
</script>

<style scoped>

</style>
