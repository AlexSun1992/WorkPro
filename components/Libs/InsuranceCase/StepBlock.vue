<template>
  <ul>
    <li
      v-for="(itemName, nKey) in data"
      :key="nKey"
      :class="infoStep(itemName).color"
    >
      {{ infoStep(itemName).title }}
      <span v-if="infoStep(itemName).desc">{{ infoStep(itemName).desc }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "StepBlock",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    infoStep(itemName) {
      const title = itemName.find((title) => title.name === "SNAME_STEP").value;
      const desc = itemName.find((desc) => desc.name === "SNOTE_STEP").value;
      const color = itemName.find((color) => color.name === "SCOLOR").value;
      return { title, desc, color };
    },
  },
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}
ul:after {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 16px;
  background-color: #e1e1e1;
  z-index: 0;
}
ul li {
  z-index: 1;
  position: relative;
  padding: 0 0 0 32px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
  list-style: none;
}
ul li:first-child {
  padding-top: 0;
}
ul li:last-child {
  padding-bottom: 0;
}
ul li:after {
  content: "";
  width: 32px;
  height: 32px;
  position: absolute;
  background: #fff url(/img/ic_Check_Solid.svg) 50% 50% no-repeat;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
ul li:last-child:before {
  content: "";
  width: 1px;
  height: calc(50% - 16px);
  background: #fff;
  z-index: 2;
  top: calc(50% + 16px);
  position: absolute;
  left: 16px;
}
ul li:first-child:before {
  content: "";
  width: 1px;
  height: calc(50% - 16px);
  background: #fff;
  z-index: 2;
  top: 0;
  position: absolute;
  left: 16px;
}

li + li {
  margin-top: 32px;
}
span {
  font-size: 0.75rem;
  color: #868686;
  display: block;
}
li.green {
  color: var(--lgreen);
}
</style>
