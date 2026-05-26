<script>
import VRuntimeTemplateImpl from "./v-runtime-template";

export default {
  name: "RuntimeTemplate",

  props: {
    template: { type: String, required: true },
    templateProps: { type: Object, default: () => ({}) },
  },

  render(h) {
    return h(VRuntimeTemplateImpl, {
      props: {
        template: this.template,
        templateProps: this.templateProps,
        parent: this.$parent,
      },
    });
  },
};
</script>
