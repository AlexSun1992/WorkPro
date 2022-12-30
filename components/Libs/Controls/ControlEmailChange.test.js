import { createLocalVue, mount } from "@vue/test-utils";
import ControlEmailChange from "./ControlEmailChange.vue";
import { BootstrapVue } from "bootstrap-vue";
import { data_card as dataCard } from "../../../store/data_card";

describe("ControlemailChange", () => {
  let wrapper;

  const localVue = createLocalVue();
  localVue.use(BootstrapVue);

  const dataProps = {
    label: "E-mail",
    type: "emailChange",
    structType: "string",
    id: "718",
    fieldId: 35724,
    cols: 12,
    colSm: 12,
    colMd: 12,
    colLg: 12,
    width: "100%",
    name: "SEMAILNEW",
    labelCols: "mt-3",
    webId: "",
    visible: true,
    required: true,
    page: 0,
    readonly: false,
    control: null,
    state: true,
    checked: true,
    error: null,
    isRelation: false,
    fieldRelation: null,
    isTab: true,
    value: "hhh@mail.ru",
  };

  const paramsProps = {
    text: "Верифицировать e-mail",
    active: true,
    compType: 9,
    recordLoad: true,
    newRecord: false,
    filters: [],
    actions: [
      {
        label: "Выслат код",
        id: 36297,
        type: 4,
        command: "Mobile.ClientUtils.SendEmail",
        relaction: "92FD4856E5006CA158B5BA8236962DA2",
        isDialog: false,
        isCurrentWindow: true,
        field: "id",
        refresh: false,
        closeAfter: false,
      },
    ],
    tabs: [],
    add: false,
    edit: true,
    delete: false,
    cols: 1,
    wizard: [],
    isCard: false,
    isForm: true,
    isWizard: false,
    isPortal: false,
    portalgrid: null,
    cardgrid: null,
    cardtemplate: null,
    isModal: false,
    parentMenu: null,
    idItem: 718,
    idParent: 0,
    newCount: null,
  };

  const createComponent = () => {
    wrapper = mount(ControlEmailChange, {
      localVue,
      mocks: {
        $store: dataCard,
      },
      propsData: { data: dataProps, params: paramsProps },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("необходимо отобразить компонент ControlEmailChange ", () => {
    createComponent();
    console.log("wrapper:", wrapper.html());
    expect(wrapper.text()).not.toBe(null);
  });
});
