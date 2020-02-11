<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col lg="12">
          <b-card>
            <h1>{{page.title}}</h1>
            <div
              v-html="page.text"
            />
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
  const pageId = 190

  @Component({
    async fetch({store}: any) {
      await store.dispatch("pages/get", pageId)
    }
  })
  export default class AboutComponent extends Vue {

    head () {
      return {
        title: this.page.title,
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          { hid: 'description', name: 'description', content: 'My custom description' }
        ]
      }
    }

    get page () {
      return this.$store.getters['pages/getPageById'](pageId).data.acf
    }
  }
</script>
