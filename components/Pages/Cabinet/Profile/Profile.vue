<template>
  <div>
    <component :is="params.settings.isModal ? 'b-modal' : 'div'" id="profile-modal" @close="closeModal" no-close-on-backdrop hide-footer>
      <b-card title="Мой профиль">
        <div class="profile">
          <profile-info v-if="show" @load="dataLoaded=true" @cancel="cancel" :params="params"></profile-info>
          <profile-side-block v-if="dataLoaded" class="ml-4">
            <slot></slot>
          </profile-side-block>
        </div>
      </b-card>
    </component>
  </div>
</template>

<script>
import ProfileInfo from '~/components/Pages/Cabinet/Profile/ProfileInfo'
import ProfileSideBlock from '~/components/Pages/Cabinet/Profile/ProfileSideBlock'
export default {
  name: "Profile",
  components: { ProfileInfo, ProfileSideBlock },
  data() {
    return {
      dataLoaded: false,
      show: true
    }
  },
  props: ['params'],
  mounted() {
    this.$bvModal.show('profile-modal')
  },
  methods: {
    cancel() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    },
    closeModal() {
      this.$router.back();
    }
  },
  computed: {
    templateData: {
      get: function () {
        return this.params.settings.cardgrid;
      }
    }
  }
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