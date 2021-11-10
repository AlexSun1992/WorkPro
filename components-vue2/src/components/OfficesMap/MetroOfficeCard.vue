<template>
  <div>
    <div>
      <div v-for="(office, index) in offices" :key="index">
        <div>
          <strong>{{ office.SSHORTNAME }}</strong>
        </div>
        <div>{{ office.SADDRESS }}</div>
        <div><strong>Тел.:</strong>{{ office.SPHONE }}</div>
        <div><strong>Email:</strong>{{ office.SEMAIL }}</div>
        <div><strong>Режим работы:</strong>{{ office.SGRAF }}</div>
        <hr />
      </div>
    </div>
    <div @click="$emit('close')" class="btn-close">X</div>
  </div>
</template>

<script>
export default {
  name: "MetroOfficeCard",
  props: ["offices"],
};
</script>

<style scoped>
.btn-close {
  cursor: pointer;
}
</style>
