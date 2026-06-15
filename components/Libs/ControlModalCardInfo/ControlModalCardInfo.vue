<template>
  <VModal
    ref="modalRef"
    v-model="visible"
    :title="title"
    size="md"
    :hide-footer="true"
    :hide-ok="true"
    :hide-cancel="true"
    :close-on-backdrop="false"
    :close-on-esc="false"
    centered
    class="cabinet"
    @hidden="onHidden"
  >
    <img
      v-if="iconURL"
      :src="iconURL"
      alt="icon"
      class="mx-auto mb-3 d-block"
    />

    <div v-html="text" />

    <div class="d-flex justify-content-between">
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
    const { $modalCardInfo } = useContext();

    const modalRef = ref(null);
    const visible = ref(false);
    const infoBlock = ref({});
    const text = computed(() => props.data?.TEXT ?? "");
    const title = computed(() => props.data?.TITLE ?? "");
    const buttons = computed(() => props.data?.BUTTONS ?? "");
    const iconURL = computed(() => props.data?.ICON ?? "");
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
