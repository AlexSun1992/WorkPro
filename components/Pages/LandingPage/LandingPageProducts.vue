<template>
  <b-row class="card-content">
    <b-col v-for="item in items" :key="item.main_title" lg="6" sm="12" md="6">
      <b-card class="border-light">
        <b-col lg="12">
          <b-row>
            <b-col lg="6">
              <div>
                <b class="head_title">{{ item.main_title }}</b>
              </div>
            </b-col>
            <b-col lg="6">
              <div class="pull-right second_head">{{ item.second_title }}</div>
            </b-col>
          </b-row>
        </b-col>
        <div class="description">{{ item.description }}</div>
        <div class="picture"><img :src="item.picture" /></div>
        <b-row class="actions">
          <div v-for="action in item.actions">
            <NLink v-if="action.type == 'link'" class="px-3" :to="action.link">
              {{ action.name }}
            </NLink>
            <b-button
              v-if="action.type == 'button'"
              variant="success"
              :href="action.button"
              >{{ action.name }}</b-button
            >
          </div>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Products",
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.head_title {
  font-size: 24px;
  font-weight: bold;
  line-height: 5px;
}
.second_head {
  text-transform: uppercase;
}
.description {
  padding: 10px;
}
.actions {
  padding: 10px;
}
.picture {
  text-align: center;
}
.card-content > div > div.card {
  height: calc(100% - 15px);
  margin-bottom: 15px;
}
</style>
