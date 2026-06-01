<template>
  <div>
    <p>Заполните профиль</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  name: "ControlProgressbar",
  props: {
    profileFullness: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const max = ref(100);
    const value = ref(0);

    const percent = computed(() => {
      if (props.profileFullness && props.profileFullness[0]) {
        return props.profileFullness[0]._data[0].NPROFILEFULLNESS;
      }
      return 0;
    });

    function randomValue() {
      value.value = Math.random() * max.value;
    }

    onMounted(() => {
      value.value = percent.value;
    });

    return {
      value,
      max,
      percent,
      randomValue,
    };
  },
};
</script>

<style scoped></style>
```
