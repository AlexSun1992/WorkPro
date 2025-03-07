<template>
  <div class="radio-group">
    <div v-for="item in options" :key="item.value" class="blk-radio-btn">
      <input
        type="radio"
        :id="data.name + item.value"
        :value="item.value"
        :name="data.name"
        @change="update(item.value)"
        :checked="item.value == id"
        :disabled="data.readonly === true"
      />
      <label
        :for="data.name + item.value"
        :class="{
          active: item.value == id,
        }"
        >{{ item.text }}
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    update(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value,
      });
    },
  },
  computed: {
    id() {
      return this.data.value;
    },
    options() {
      return this.data.options;
    },
  },
};
</script>

<style scoped>
.radio-group input {
  display: none;
}

.radio-group label {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1;
  color: #292929;
  padding-left: 50px;
  position: relative;
  cursor: pointer;
  margin-bottom: 0;
}

.radio-group input:checked + label:before {
  display: none;
}
.radio-group input:checked + label:after {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM0IiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9IiM0M0IwMkEiLz4KPGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iNyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==");
  border: 0;
}
.radio-group input + label:after {
  content: "";
  width: 34px;
  height: 34px;
  left: 0;
  border: 2px solid #c3c3c3;
  box-sizing: border-box;
  border-radius: 34px;
  top: 50%;
  transform: translateY(-52%);
  position: absolute;
}

.radio-group input:disabled + label:after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjE2IiBzdHJva2U9IiNGMkY0RjUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K");
  border: 0;
}
.radio-group input:checked + label {
  color: #292929;
}
.radio-group input:disabled + label {
  color: #c3c3c3;
}
.blk-radio-btn {
  min-height: 34px;
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
.radio-group > div:first-child {
  margin-top: 0;
}

.radio-group.columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
}

.radio-group.columns-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 20px;
}

.radio-group.columns-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
}
.radio-btn .blk-radio-btn,
.radio-btn > div {
  margin-right: 20px;
  display: inline-block;
}
.radio-btn > div:last-child {
  margin-right: 0;
}
.radio-tabs > div {
  display: inline-block;
}
.radio-btn > div > label {
  padding: 0 12px;
}
.radio-tabs > div > label {
  padding-left: 0px;
}
.radio-tabs > div + div {
  margin-left: 20px;
}
.radio-btn .blk-radio-btn,
.radio-tabs .blk-radio-btn {
  height: auto;
  min-height: 0;
}
.radio-btn input + label:after,
.radio-btn input + label:before {
  display: none;
}
.radio-btn input + label {
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 100px;
  position: relative;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
  color: #43b02a;
  border: 0;
  padding: 3px 16px 2px 16px;
  text-decoration: none;
  height: 38px;
  box-sizing: border-box;
  margin: 0;
  transition: 0.3s;
  white-space: nowrap;
}
.radio-btn input:checked + label {
  background: #009639;
  color: #fff;
  transition: 0.3s;
}
.conf-block .radio-btn input + label {
  border: 1px solid #43b02a;
}
.radio-btn input + label:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.radio-tabs input + label:after,
.radio-tabs input + label:before {
  width: 0;
  background: transparent;
}
.radio-tabs input + label:after,
.radio-tabs input + label:before {
  content: "";
  position: absolute;
  bottom: -4px;
  width: 0;
  height: 3px;
  background: #eee;
  top: auto;
  transform: none;
  transition: 0.3s;
  border: 0;
  left: 50%;
}
.radio-tabs input:hover + label:after,
.radio-tabs input:hover + label:before {
  width: 50%;
  transition: 0.3s;
  background: #c3c3c3;
}

.radio-tabs input:checked + label:after,
.radio-tabs input:checked + label:before {
  width: 50%;
  background: #43b02a;
  transition: 0.3s;
  content: "";
  display: block;
}
.radio-tabs input:hover + label:after,
.radio-tabs input:checked + label:after {
  margin-left: -50%;
}

@media (min-width: 993px) {
  .radio-group[class*="columns-"] .blk-radio-btn {
    margin-top: 0;
  }
}

@media (max-width: 992px) {
  .radio-group[class*="columns-"] {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0px;
  }
}
</style>
