<template>
  <VModal
    v-model="visible"
    ref="modalRef"
    :title="title"
    size="md"
    :hide-footer="true"
    :hide-ok="true"
    :hide-cancel="true"
    :closeOnBackdrop="false"
    :closeOnEsc="false"
    centered
    @hidden="onHidden"
    class="cabinet"
    :iconURL="iconURL"
  >
    <div v-html="text" />

    <div>
      <button
        v-for="button in buttons"
        :key="button.text"
        :class="['mt-3', button.type]"
        @click="onButtonClick(button)"
      >
        {{ button.text }}
      </button>
    </div>
  </VModal>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, computed } from "vue";
import { useContext, useRouter } from "@nuxtjs/composition-api";
import VModal from "@/components/Libs/VModal/VModal";

export default {
  name: "ControlModalCardInfo",
  components: { VModal },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const INFOBLOCK = "INFOBLOCK";
    const { $modalCardInfo } = useContext();

    const modalRef = ref(null);
    const visible = ref(false);
    const infoBlock = ref({});
    const text = computed(() => props.data?.[INFOBLOCK]?.TEXT ?? "");
    const title = computed(() => props.data?.[INFOBLOCK]?.TITLE ?? "");
    const buttons = computed(() => props.data?.[INFOBLOCK]?.BUTTONS ?? "");
    const iconURL = computed(() => props.data?.[INFOBLOCK]?.ICON ?? "");

    const redirect = (link) => {
      if (link) {
        window.location.href = link;
      }
    };

    const onButtonClick = (button) => {
      if (button.link) {
        return redirect(button.link);
      }

      modalRef.value.close();
    };

    function onHidden() {
      infoBlock.value = {};
      $modalCardInfo?.hide();
    }

    return {
      props,
      visible,
      infoBlock,
      text,
      title,
      iconURL,
      buttons,
      modalRef,
      onHidden,
      onButtonClick,
      redirect,
    };
  },
};
</script>

<style scoped></style>
