<template>
  <div class="promo-blk">
    <img :src="item.PICTURESURL" />
    <span class="name"
      >{{ item.IDOPTION }}
      <span class="tooltipster">
        <vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
          <span>{{ item.SDECRYPTION }}</span>
        </vue-easy-tooltip>
      </span>
    </span>
    <span class="price">{{ item.NCOST }}</span>
    <div class="checkbox-hide">
      <input
        :id="'id_check' + item.ID"
        type="checkbox"
        v-model="fieldValue"
        ref="input"
        @change="handleAdd"
      />
      <label :for="'id_check' + item.ID"></label>
    </div>
  </div>
</template>
<script>
export default {
  name: "ControlMultiItem",
  components: {},
  props: {
    item: {
      typeof: Object,
      required: true,
      default: () => {},
    },
    value: {
      typeof: Number,
      default: () => null,
    },
  },

  data() {
    return {
      fieldValue: false,
    };
  },
  mounted() {
    if (this.value) {
      this.fieldValue = true;
      this.$emit("update", {
        isActive: this.fieldValue,
        id: this.item.value,
      });
    }
  },
  computed: {},
  methods: {
    handleAdd() {
      this.$emit("update", {
        isActive: this.fieldValue,
        id: this.item.ID,
      });
    },
  },
};
</script>
<style scoped>
.promo-blk {
  display: grid;
  grid-template-columns: 48px auto max-content 34px;
  grid-gap: 12px;
  align-items: center;
}
img {
  width: 48px;
  height: 48px;
  overflow: hidden;
}
.name {
  font-size: 1rem;
  color: #686868;
  padding-right: 28px;
  position: relative;
  font-weight: 600;
  line-height: 1.125rem;
}
.price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #43b02a;
}
.tooltipster {
  top: 50%;
  margin-top: -12px;
  right: 0;
  left: auto;
}
label:after {
  background-color: #fff;
}
</style>
