<template>
  <MapInfoBlock :data="dataSource" />
</template>

<script>
import { getCurrentInstance, computed } from "vue";
import MapInfoBlock from "@/components/Libs/Controls/ControlMap/MapInfoBlock.vue";

export default {
  name: "ControlYMap",
  components: { MapInfoBlock },
  props: {
    data: {
      type: Object,
      required: true,
    },
    itemId: {
      type: Number,
      default: undefined,
    },
    mainFilteredItems: {
      type: Array,
      default: undefined,
    },
  },

  setup(props) {
    const store = getCurrentInstance().proxy.$store;

    const dataContent = computed(() =>
      props.data.menudic ? store.getters["blocks/getUnfilteredBlockById"](props.data.menudic) : {}
    );

    const dataContentFiltered = computed(() => {
      if (props.itemId) {
        const block = store.getters["blocks/getBlockById"](props.itemId);
        return block?.data?.items || [];
      }
      return [];
    });

    const dataSource = computed(() => {
      let data;
      if (props.mainFilteredItems?.length) {
        data = props.mainFilteredItems;
      } else if (dataContentFiltered.value.length) {
        data = dataContentFiltered.value;
      } else {
        data = dataContent.value.data?.items || [];
      }

      return data;
    });

    return { dataSource };
  },
};
</script>
