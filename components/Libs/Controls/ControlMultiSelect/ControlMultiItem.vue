<template>
  <div class="promo-blk">
    <img :src="item.PICTURESURL" />
    <span class="name"
      >{{ item.IDOPTION }}
      <span class="tooltipster" v-if="item.STYLE != 'vis2'">
        <vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
          <span>{{ item.SDECRYPTION }}</span>
        </vue-easy-tooltip>
      </span>
    </span>
    <span class="dis" v-if="item.STYLE === 'vis2'">{{ item.SDECRYPTION }}</span>
    <span class="kid" v-html="item.STEXT" v-if="item.STYLE === 'vis2'" />
    <span class="price"
      ><span>{{ item.NCOST }}</span></span
    >
    <div class="checkbox-hide">
      <input
        :id="'id_check' + item.ID"
        type="checkbox"
        v-model="inputValue"
        ref="input"
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
    if (this.valueProps) {
      this.fieldValue = true;
      this.$emit("update", {
        isActive: this.fieldValue,
        id: this.valueProps,
      });
    }
  },
  computed: {
    inputValue: {
      get() {
        return !!this.valueProps;
      },
      set(newValue) {
        this.$emit("update", {
          isActive: newValue,
          id: this.item.ID,
        });
      },
    },
    valueProps() {
      return this.value;
    },
  },
};
</script>
<style scoped>
.promo-blk {
  display: grid;
  grid-template-columns: 48px auto max-content 34px;
  grid-template-areas: "img title price check";
  grid-gap: 12px;
  align-items: center;
}
.vis2 .promo-blk {
  display: grid;
  grid-template-columns: 34px auto 115px;
  grid-column-gap: 16px;
  grid-row-gap: 8px;
  align-items: center;
  width: 100%;
  grid-template-areas:
    "check title img"
    "check dis img"
    "check price img"
    "kid kid kid";
}
img {
  width: 48px;
  height: 48px;
  overflow: hidden;
  grid-area: img;
}
.vis2 img {
  width: 115px;
  height: 115px;
}
.kid {
  grid-area: kid;
  font-size: 0.875rem;
  color: #868686;
}

.dis {
  grid-area: dis;
  font-size: 0.875rem;
}
.vis2 .checkbox-hide {
  grid-area: check;
  height: 34px;
  align-items: start;
  align-self: baseline;
}
.checkbox-hide label {
  height: 34px;
  width: 34px;
}
.name {
  font-size: 1rem;
  color: #686868;
  padding-right: 28px;
  position: relative;
  font-weight: 600;
  line-height: 1.125rem;
  grid-area: title;
}
.vis2 .name {
  color: #292929;
}
.price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #43b02a;
  grid-area: price;
}
.vis2 .price span {
  background-color: #009639;
  border-radius: 40px;
  line-height: 38px;
  padding: 0 12px;
  color: #fff;
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 400;
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
@media (max-width: 768px) {
  .price,
  .name {
    font-size: 0.875rem;
  }
  .vis2 .name,
  .vis2 .price span {
    font-size: 1rem;
  }
  .kid {
    font-size: 0.75rem;
  }
  .promo-blk {
    grid-template-columns: 24px auto max-content 34px;
  }
  img {
    width: 24px;
    height: 24px;
  }
  .vis2 img {
    width: 90px;
    height: 90px;
  }
  .vis2 .price {
    align-self: baseline;
    font-size: 1rem;
  }
  .vis2 .promo-blk {
    display: grid;
    grid-template-columns: 34px auto 90px;
    grid-column-gap: 12px;
    grid-template-areas:
      "check title title"
      "check dis dis"
      "check price img"
      "kid kid kid";
  }
}
</style>
