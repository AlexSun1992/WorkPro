<template>
  <div>
    <div>
      <v-runtime-template :template="content"></v-runtime-template>
    </div>
  </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import DemoContent from './DemoContent'
  export default {
    components: {VRuntimeTemplate, DemoContent},
    data(){
      return {
        content: '<demo-content>\n' +
        '  <template v-slot:data="{ content }">\n' +
        '    <b>{{ content.name }}</b>\n' +
        '    <i>{{ content.id }}</i>\n' +
        '  </template>\n' +
        '</demo-content>'
      }
    }
  }
</script>
