<template>
  <div>
    <b-col cols="12">
      <b-row>
        <div v-if="!policies.length">
          <b-spinner variant="success" label="Загрузка..."></b-spinner>
          <strong> Загрузка...</strong>
        </div>
        <b-col v-for="policy in policies" :key="policy.ID" cols="6">
          <b-card :header="policy.SPRODUCTNAME" :title="policy.SPOLOBJ">
            <div>№ {{ policy.SPOLICY_NUMBER }}</div>
            <div>Действует с {{ policy.DFROMDATE }}</div>
            <div>Срок действия до {{ policy.DTODATE }}</div>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      policies: [],
    };
  },
  async fetch() {
    this.policies = await this.$axios.$get("/main/v2/policy");
  },
};
</script>

<style scoped></style>
