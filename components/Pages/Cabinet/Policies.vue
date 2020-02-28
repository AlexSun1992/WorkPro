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
      this.policies = []
    }
  }
</script>

<style scoped>

</style>
