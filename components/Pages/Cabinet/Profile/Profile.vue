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
          <i class="icon-my-profile"></i>Мой профиль
        </div>
        <div class="profile row" v-show="$store.getters['card/wizardData']">
          <profile-info
            @field-changed="refresh()"
            @saved="showSaveToast()"
            @error="showErrorToast()"
            v-if="show"
            @load="dataLoaded=true"
            @cancel="refresh()"
            :params="params"
            class="bg-six block-border-one block col"
          ></profile-info>
          <profile-side-block class="col-xl-3 d-none d-xl-block">
            <slot></slot>
          </profile-side-block>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import ProfileInfo from "~/components/Pages/Cabinet/Profile/ProfileInfo";
import ProfileSideBlock from "~/components/Pages/Cabinet/Profile/ProfileSideBlock";
export default {
  name: "Profile",
  components: { ProfileInfo, ProfileSideBlock },
  data() {
    return {
      dataLoaded: false,
      show: true,
    };
  },
  props: ["params"],
  mounted() {
    this.$bvModal.show("profile-modal");
  },
  methods: {
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
};
</script>

<style scoped>
.profile {
  display: flex;
  justify-content: space-between;
}
/deep/ .modal-dialog {
  width: 95vw;
  max-width: 100%;
}
</style>
