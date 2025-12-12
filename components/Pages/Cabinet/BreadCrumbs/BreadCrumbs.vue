<template>
  <div>
    <ul class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <a
          v-if="item.href && !lastRoute(index)"
          :disabled="lastRoute(index)"
          :class="{ 'pe-none': lastRoute(index) }"
          :href="item.href"
          >{{ item.text }}</a
        >
        <router-link
          v-if="item.to && !lastRoute(index)"
          :to="item.to"
          :disabled="lastRoute(index)"
          :class="{ 'pe-none': lastRoute(index) }"
        >
          {{ item.text }}
        </router-link>

        {{ item.to && lastRoute(index) ? item.text : null }}
        {{ item.href && lastRoute(index) ? item.text : null }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BreadCrumbs",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    lastRoute() {
      return (index) => this.data.length - 1 === index;
    },
  },
};
</script>
