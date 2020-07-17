<template>
  <div>
    <b-card title="Мой профиль">
      <div class="profile">
        <profile-info :params="params"></profile-info>
        <profile-side-block class="ml-4"></profile-side-block>
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
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {}
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