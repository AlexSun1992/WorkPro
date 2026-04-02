<template>
  <div>
    <div class="title-page">Купить полис</div>
    <div
      class="card-filters"
      v-if="!this.data.value"
    >
      <FilterButton
        v-for="item in filtersBtnName"
        :label="item"
        :key="item"
        @click="select"
        :active="item === curentFilter"
      />
    </div>
    <div class="control-card-list">
      <div
        v-for="(item, key) in getNewMass"
        :key="key"
        :data-id="key"
        class="control-card-list-blk"
      >
        <div class="control-card-list-blk-title">
          {{ key }}
        </div>
        <div class="row">
          <card
            v-for="(card, index) in item"
            :key="index"
            :data="card"
            class="col-12 col-lg-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./Card.vue";
import FilterButton from "./Filter.vue";

const allBtn = "Все";

export default {
  name: "ControlCardList",
  components: {
    Card,
    FilterButton,
  },
  props: {
    data: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      newMass: {},
      curentFilter: allBtn,
    };
  },

  created() {
    const allMass = this.data.value ? JSON.parse(this.data.value) : this.data;
    this.newMass = allMass.reduce((acc, item) => {
      const { SGROUP } = item;
      if (!acc[SGROUP]) {
        acc[SGROUP] = [];
      }
      acc[SGROUP].push(item);
      return acc;
    }, {});
    return this.newMass;
  },
  computed: {
    allBtn() {
      return allBtn;
    },
    filtersBtnName() {
      return [this.allBtn, ...Object.keys(this.newMass)];
    },
    filtersAll() {
      return [this.allBtn, ""].includes(this.curentFilter) ? "active" : "";
    },
    getNewMass() {
      if (!this.curentFilter || this.curentFilter === this.allBtn) {
        return this.newMass;
      }
      return { [this.curentFilter]: this.newMass[this.curentFilter] };
    },
  },

  methods: {
    select(data) {
      this.curentFilter = data;
    },
  },
};
</script>

<style scoped>
.control-card-list-blk {
  box-shadow: 0px 0px 32px -4px rgba(0, 0, 0, 0.1);
  padding: 24px 24px 8px 24px;
  background-color: var(--white);
  border-radius: 24px;
}
.control-card-list-blk + .control-card-list-blk {
  margin-top: 1rem;
}
.control-card-list-blk-title {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 32px;
  margin-bottom: 1rem;
}
.cabinet .title-page {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}
.card-filters {
  margin-bottom: 0.75rem;
}
.row > div {
  margin-bottom: 1rem;
}

.only_cards .title-page,
.only_cards .card-filters,
.only_cards .control-card-list-blk-title {
  display: none;
}
.only_cards .control-card-list-blk {
  box-shadow: none;
  padding: 0;
  background-color: transparent;
}
</style>
