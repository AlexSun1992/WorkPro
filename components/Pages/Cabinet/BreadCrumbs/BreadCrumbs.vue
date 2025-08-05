<template>
  <div>
    <ul class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <router-link
          v-if="item.to"
          :to="item.to"
          :disabled="lastRoute(index)"
          :class="{ 'pe-none': lastRoute(index) }"
        >
          {{ item.text }}
        </router-link>

        <a
          v-else-if="item.href"
          :href="item.href"
          :disabled="lastRoute(index)"
          :class="{ 'pe-none': lastRoute(index) }"
          >{{ item.text }}</a
        >
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
      return (index) => {
        return this.data.length - 1 === index;
      };
    },
  },
};
</script>
