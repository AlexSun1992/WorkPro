<template>
  <div>
    <b-card title="Мой профиль">
      <div class="profile">
        <edit v-if="isEditForm" @editClose="isEditForm=false" :data="editCard"></edit>
        <profile-info v-if="show" v-show="!isEditForm" @load="dataLoaded=true" @update="updateForm($event)" @cancel="cancel" :params="params"></profile-info>
        <profile-side-block v-if="dataLoaded" class="ml-4">
          <slot></slot>
        </profile-side-block>
      </div>
    </b-card>
  </div>
</template>

<script>
import ProfileInfo from '~/components/Pages/Cabinet/Profile/ProfileInfo'
import Edit from '~/components/Pages/Cabinet/Profile/Card/Edit'
import ProfileSideBlock from '~/components/Pages/Cabinet/Profile/ProfileSideBlock'
export default {
  name: "Profile",
  components: { ProfileInfo, ProfileSideBlock, Edit },
  data() {
    return {
      dataLoaded: false,
      show: true,
      isEditForm: false,
      editCard: null
    }
  },
  props: ['params'],
  methods: {
    cancel() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    },
    updateForm(e) {
      this.isEditForm=true;
      this.editCard = e.data;
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
</style>