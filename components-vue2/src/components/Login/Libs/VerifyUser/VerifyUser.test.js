import VerifyUser from "./VerifyUser.vue";
import { mount } from "@vue/test-utils";
jest.mock("axios");

describe("VerifyUser", () => {
  let wrapper;

  const vData = {
    birthdate: {
      required: false,
      $model: "",
      $invalid: true,
      $dirty: false,
      $anyDirty: false,
      $error: false,
      $anyError: false,
      $pending: false,
      $params: { required: { type: "required" } },
    },
    code: {
      required: false,
      minLength: true,
      $model: "",
      $invalid: true,
      $dirty: false,
      $anyDirty: false,
      $error: false,
      $anyError: false,
      $pending: false,
      $params: {
        required: { type: "required" },
        minLength: { type: "minLength", min: 5 },
      },
    },
    password: {
      required: false,
      minLength: true,
      maxLength: true,
      $model: "",
      $invalid: true,
      $dirty: false,
      $anyDirty: false,
      $error: false,
      $anyError: false,
      $pending: false,
      $params: {
        required: { type: "required" },
        minLength: { type: "minLength", min: 6 },
        maxLength: { type: "maxLength", max: 20 },
      },
    },
    password2: {
      required: false,
      sameAsPassword: true,
      minLength: true,
      maxLength: true,
      $model: "",
      $invalid: true,
      $dirty: false,
      $anyDirty: false,
      $error: false,
      $anyError: false,
      $pending: false,
      $params: {
        required: { type: "required" },
        sameAsPassword: { type: "sameAs", eq: "password" },
        minLength: { type: "minLength", min: 6 },
        maxLength: { type: "maxLength", max: 20 },
      },
    },
    phone: {
      required: false,
      minLength: true,
      $model: "",
      $invalid: true,
      $dirty: true,
      $anyDirty: true,
      $error: true,
      $anyError: true,
      $pending: false,
      $params: {
        required: { type: "required" },
        minLength: { type: "minLength", min: 17 },
      },
    },
    $model: {
      phone: "",
      birthdate: "",
      policyNumber: "",
      code: "",
      password: "",
      password2: "",
    },
    $invalid: true,
    $dirty: false,
    $anyDirty: true,
    $error: false,
    $anyError: true,
    $pending: false,
    $params: {
      birthdate: null,
      code: null,
      password: null,
      password2: null,
      phone: null,
    },
  };

  // const myMock = jest.fn();
  // jest.mock("validateState");

  const createComponent = () => {
    wrapper = mount(VerifyUser, {
      propsData: {
        v: vData,
        validateState: jest.fn(),
      },
    });
  };

  it("тестовый тест", () => {
    createComponent();
    const result = wrapper;
    expect(result).not.toBe(null);
  });
});
