<template>
  <div>
    <span class="ppl-name">{{ user }}</span>
  </div>
</template>

<script>
export default {
  name: "HeaderUserInfo",
  props: ["userData"],
  computed: {
    user() {
      if (this.userData && this.userData[0]) {
        return `${this.userData[0]._data[0].SFIRSTNAME} ${this.userData[0]._data[0].SSECONDNAME}`;
      }
    },
  },
};
</script>
