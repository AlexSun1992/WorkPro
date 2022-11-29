import Vue from "vue";
import { ToastPlugin } from "bootstrap-vue";
Vue.use(ToastPlugin);
export default () => {
  this.$bvToast.toast("Toast body content", {
    title: "Toast test",
    variant: "succes",
    solid: true,
  });
};
