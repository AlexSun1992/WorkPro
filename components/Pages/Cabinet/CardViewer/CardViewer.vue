<template>
  <div class="col-12">
    <component
      :is="params.settings.isModal ? 'b-modal' : 'div'"
      id="profile-modal"
      @close="closeModal"
      no-close-on-backdrop
      hide-footer
    >
      <div>
        <div class="block-title pt-0 position-relative mt-2 mb-4">
          <i class="icon-my-profile"></i>{{ label }}
        </div>
        <div class="profile row" v-show="$store.getters['card/wizardData']">
          <card-viewer-info
            :context="context"
            @field-changed="refresh()"
            @saved="showSaveToast()"
            @error="showErrorToast()"
            v-if="show"
            @load="dataLoaded=true"
            @cancel="refresh()"
            :params="params"
            class="bg-six block-border-one block col"
          ></card-viewer-info>
          <side-block class="col-xl-3 d-none d-xl-block">
            <slot></slot>
          </side-block>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import CardViewerInfo from "~/components/Pages/Cabinet/CardViewer/CardViewerInfo";
import SideBlock from "~/components/Pages/Cabinet/CardViewer/SideBlock";
export default {
  name: "CardViewer",
  components: { CardViewerInfo, SideBlock },
  data() {
    return {
      dataLoaded: false,
      show: true,
    };
  },
  props: ["params", "label", "context"],
  mounted() {
    this.$bvModal.show("profile-modal");
  },
  methods: {
    beforeUnload(event) {
      var confirmationMessage = "\o/";
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    },
    refresh() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    closeModal() {
      this.$router.back();
    },
    showSaveToast() {
      this.$bvToast.toast("Успешно сохранено", {
        title: ``,
        variant: "success",
        solid: true,
      });
    },
    showErrorToast() {
      this.$bvToast.toast("Error", {
        title: `Ошибка`,
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    },
  },
  computed: {
    templateData: {
      get: function () {
        return this.params.settings.cardgrid;
      },
    },
  },
  mounted() {
    window.addEventListener('beforeunload',  event => {
      if(this.$store.getters['card/isFormChanged']){
        this.beforeUnload(event)
      }
    });
  }
};
</script>

<style scoped>
.profile {
  display: flex;
  justify-content: space-between;
  min-height: 450px;
}
/deep/ .modal-dialog {
  width: 95vw;
  max-width: 100%;
}
</style>
