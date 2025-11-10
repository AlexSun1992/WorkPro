<template>
  <div class="card">
    <div class="insured-list">
      <div
        v-for="(aItem, aKey) in data"
        :key="aKey"
        class="row"
      >
        <div
          v-if="aItem.title"
          class="col-12 title_block mt-4"
        >
          {{ aItem.title }}
        </div>
        <template v-for="bItem in aItem.items">
          <div
            :class="['col-12', `col-lg-${bItem.size || 4}`]"
            v-if="bItem.value"
          >
            <div class="label">{{ bItem.title }}</div>
            <span class="des"> {{ bItem.value }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.label {
  font-size: 0.875rem;
  line-height: 23px;
  color: #868686;
  font-family: "SF Pro Display";
  margin-top: 1.5rem;
}
.des {
  font-family: Raleway;
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  font-feature-settings: "pnum" on, "lnum" on;
}
.insured-list_title {
  margin-top: 2rem;
  font-family: Raleway;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0px;
  margin-top: 2rem;
  margin-bottom: -0.5rem;
}
.title_block {
  font-weight: 700;
  font-size: 1.25rem;
}
@media (max-width: 992px) {
  label {
    margin-top: 1rem;
  }
}
</style>
