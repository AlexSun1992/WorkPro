<template>
  <div class="docs-searching-results">
    <div v-for="item in options" :key="item.id">
      <div class="doc-date">{{ new Intl.DateTimeFormat("ru-RU").format(new Date(item.DDATE)) }}</div>
      <div class="doc-expert">{{ item.SSPECIALISTNAME }}</div>
      <div class="doc-name">{{ item.SPERSON }}</div>
      <div class="doc-location">{{ item.FKIDLPU }}</div>
      <div class="doc-adress"><i class="my-location"></i>{{ item.SADDRESS }}</div>
      <div v-for="elem in item.STIMELIST" :key="elem.id" class="doc-time">
        <button @click="chooseTimeToVisit(elem, item)" class="btn-doc-time">
          {{ elem.DFROM }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlDoctorSchedule",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  computed: {
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    options: {
      get() {
        return this.dataContent.items || [];
      },
    },
  },

  async created() {
    await this.$store.dispatch("blocks/fetchBlock", {
      id: this.data.menudic,
      query: this.$store.getters["data_card/getFiltersAllFields"],
    });
  },

  methods: {
    chooseTimeToVisit(elem, item) {
      const copyValue = Object.assign({}, item, elem);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { value: copyValue },
      });
    },
  },
};
</script>

<style scoped>

.docs-searching-results{
border: 1px solid #EFF1F3;
border-radius: 16px;padding:24px 54px 24px 20px;}
.doc-name{font-family: 'Raleway';
font-style: normal;
font-weight: 700;
font-size: 20px;
line-height: 24px;
}
.doc-date{
font-family: 'Raleway'; float:right;
font-style: normal;
font-weight: 700;
font-size: 20px;
line-height: 24px;
font-feature-settings: 'pnum' on, 'lnum' on;
color: #009639;
}
.doc-location{
font-family: 'SF Pro Display';
font-style: normal;
font-weight: 600;
font-size: 20px;
line-height: 32px;margin-top:40px;
}
.doc-adress {
font-family: 'SF Pro Display';
font-style: normal;
font-weight: 400;
font-size: 20px;
line-height: 32px;
color: #292929;
}
.doc-time {display:inline-block;
margin-right:20px;margin-top:20px;}
.btn-doc-time {background: #EDF8EA;
border-radius: 15px;padding:22px 20px;border:0;
font-family: 'SF Pro Display';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 1;
color: #009639;
min-width:84px;
text-align:center;
}
</style>
