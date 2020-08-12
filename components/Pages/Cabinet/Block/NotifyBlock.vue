<div class="block  bg-white block-border-one">
  <div v-text="name" class="block-title"/>
  <content-block :item-id="itemId">
    <template v-slot:data="data">
      <div class="block-notification-item">
        <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3584 11.7498V17.183L17.0103 12.804L15.848 13.9734L20.1961 18.3524H2.80395L7.15197 13.9862L5.98967 12.804L1.64165 17.183V5.69343L11.5 12.7656L14.5118 10.6059C14.0016 10.3226 13.5212 9.98798 13.078 9.60721L11.5 10.7382L3.71597 5.15139H9.85835V3.50393H0V19.9999H23V11.7498H21.3584ZM19.5852 6.72202C20.2467 6.72287 20.8935 6.52623 21.4439 6.157C21.9942 5.78777 22.4233 5.26255 22.6769 4.64783C22.9304 4.03311 22.9969 3.35653 22.8681 2.70373C22.7393 2.05094 22.4208 1.45128 21.9531 0.980668C21.4853 0.510058 20.8893 0.189656 20.2405 0.0600222C19.5917 -0.0696118 18.9193 -0.00264938 18.3083 0.252433C17.6973 0.507515 17.1753 0.939248 16.8083 1.49298C16.4414 2.04671 16.2459 2.69754 16.2468 3.36308C16.2479 4.25358 16.6 5.10729 17.2258 5.73696C17.8517 6.36664 18.7001 6.72089 19.5852 6.72202Z"/>
        </svg>
        <div v-text="data.content.STEXT" class="block-notification-item-text"/>
        <div class="block-notification-btn">
          <action-button  :row-id="data.content.ID" :actions="data.content.ACTIONS"  action-id="32730"/>
          <action-button  class="notification-close"  :row-id="data.content.ID" :actions="data.content.ACTIONS"  action-id="32730"/>
        </div>
      </div>
    </template>
  </content-block>
  <div class="block-footer row justify-content-between align-items-center">
    <div  class="col-auto"><action-button  :actions="actions" item-id="itemId" action-id="32722" class="link-arrow-right"/></div>
    <div  class="col-auto"><action-button  :actions="actions" item-id="itemId" action-id="32729" class="link-arrow-right"/></div>
  </div>
</div>
<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
  import ContentBlock from './ContentBlock'
  import ActionButton from './ActionButton'
  import OpenCardButton from '../Block/OpenCardButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'NotifyBlock',
    components: {ContentBlock, VRuntimeTemplate, ActionButton, OpenCardButton},
    props: {
      moduleId: {
        type: String,
        required: false,
        default: () => ''
      },
      itemId: {
        type: String,
        required: true,
        default: () => null
      },
      name: {
        type: String,
        required: true,
        default: () => null
      }
    },
    computed: {
      templateData: {
        get: function () {
          return this.$store.getters['menu/getMenuById'](this.itemId).SVJCARDGRID
        }
      },
      actions: {
        get: function () {
          return this.$store.getters['menu/getMenuById'](this.itemId).ACTIONSCUR
        }
      }
    }
  }
</script>

<style scoped>

</style>
