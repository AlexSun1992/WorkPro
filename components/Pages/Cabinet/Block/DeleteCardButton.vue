<template>
  <div>
    <b-modal :id="'confirmDelete' + menuId + itemId"  centered title="Удаление записи" ok-title="Удалить" cancel-title="Отмена"  no-close-on-backdrop  @ok="deleteCard">
      Вы действительно хотите удалить эту запись?
    </b-modal>
    <b-button @click="$bvModal.show('confirmDelete' + menuId + itemId)">
      <slot>Удалить</slot>
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'OpenCardButton',
    props: {
      itemId: {
        type: Number,
        required: false,
        default: () => null
      },
      menuId: {
        required: true,
        default: () => ''
      },
      moduleId: {
        type: String,
        required: true,
        default: () => ''
      }
    },
    methods: {
      async deleteCard () {
        try {
          await this.$store.dispatch('blocks/deleteForm', {moduleId:this.moduleId, menuId:this.menuId, itemId:this.itemId});
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      },
    },
  }
</script>

<style scoped>

</style>
