global.$nuxt = {
  $bvToast: {
    hide: () => {},
    toast: () => {},
  },
};

describe("makeToast()", () => {
  const error = {
    MESSAGE: "Ошибка",
  };
  let makeToast = () => {};
  beforeEach(() => {
    makeToast = require("./toast").makeToast;
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("should show always show toast if error passed", () => {
    const toast = jest.spyOn(global.$nuxt.$bvToast, "toast");
    makeToast(error);
    expect(toast).toHaveBeenCalled();
  });

  it("should throw error if error object is not passed", () => {
    expect(() => makeToast()).toThrow("Ошибка");
  });

  it("should hide toasts if count of calls is greater than 2", () => {
    const hide = jest.spyOn(global.$nuxt.$bvToast, "hide");
    makeToast(error);
    makeToast(error);
    makeToast(error);
    expect(hide).toHaveBeenCalledTimes(1);
  });

  it("shouldn't hide toasts if count of calls is less or equal than 2", () => {
    const hide = jest.spyOn(global.$nuxt.$bvToast, "hide");
    makeToast(error);
    makeToast(error);
    expect(hide).not.toHaveBeenCalled();
  });
});
