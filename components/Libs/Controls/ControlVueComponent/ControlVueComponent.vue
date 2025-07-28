<template>
  <div>
    <vue-custom-component />
  </div>
</template>

<script>
import ActionButton from "../../../Pages/Cabinet/Block/ActionButton.vue";

export default {
  name: "ControlVueComponent",
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  created() {
    this.$options.components.vueCustomComponent = {
      ...this.currentComponentConfig,
      components: {
        ActionButton,
      },

      methods: {
        isFieldExists(name, data = undefined) {
          return Boolean(this.getField(name, data));
        },
        getField(name) {
          return this.formData.find((item) => item.name === name);
        },
        getFieldValue(name) {
          return this.getField(name) ? this.getField(name).value : "";
        },
        getFieldLabel(name) {
          return this.getField(name) ? this.getField(name).label : "Стоимость полиса";
        },
        getVisible(name) {
          return this.getField(name) ? this.getField(name).visible : "";
        },
        label(name) {
          return this.getField(name) ? this.getField(name)?.label : "Стоимость полиса";
        },
      },
      computed: {
        formData() {
          return this.$store.getters["data_card/getForm"] || [];
        },
      },
    };
  },

  computed: {
    componentRegExp() {
      return new RegExp(`<template.*?slot="${this.data.name}".*?>([\\s\\S]*?)</template>`);
    },
    availableHardcodedComponent() {
      return require
        .context("./HardcodedComponents", false, /[A-Z]\w+\.(vue|js)$/)
        .keys()
        .map((filename) => filename.replace("./", "").replace(".vue", ""));
    },
    hardcodedComponentConfig() {
      const requireComponent = require.context("./HardcodedComponents", false, /[A-Z]\w+\.(vue|js)$/);

      let hardcodedComponentConfig = null;
      requireComponent
        .keys()
        .filter((fileName) => fileName.includes(`${this.data.name}.vue`))
        .forEach((fileName) => {
          hardcodedComponentConfig = requireComponent(fileName).default;
        });
      return hardcodedComponentConfig;
    },

    isSlotInCardtemplate() {
      return this.componentRegExp.test(this.cardtemplate);
    },
    cardtemplate() {
      return this.$store.getters["menu/getSettingsByIdItem"](this?.$route?.params?.idItem || {})?.cardtemplate;
    },
    currentComponentConfig() {
      if (this.isSlotInCardtemplate) {
        const [, componentText] = this.cardtemplate.match(this.componentRegExp);
        return { template: componentText };
      }
      return (
        this.hardcodedComponentConfig || {
          template: `<div>
            <h3>Компонент ${this.data.name} не найден</h3>
            <li>Выберите из доступных: ${this.availableHardcodedComponent.join()}</li>
            <li>Укажите в Заголовке компонента</li>
            <li>Укажите в VueJs шаблон карточки<pre>
                &lt;div&gt;
                  &lt;template slot=&quot;${this.data.name}&quot;&gt;
                  &lt;/template&gt;
                &lt;/div&gt;</pre>
            </li></div>`,
        }
      );
    },
  },
};
</script>
