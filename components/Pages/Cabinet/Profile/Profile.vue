<template>
  <div>
    <b-card title="Мой профиль">
      <div class="profile">
        <profile-info v-if="show" @load="dataLoaded=true" @cancel="cancel" :params="params"></profile-info>
        <profile-side-block v-if="dataLoaded" class="ml-4"></profile-side-block>
      </div>
    </b-card>
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
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  methods: {
    cancel() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    }
  }
};
</script>

<style scoped>
  .profile {
    display: flex;
    justify-content: space-between;
  }
</style>