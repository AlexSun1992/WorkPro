jest.mock("@/components/Libs/ControlModalCardInfo/ControlModalCardInfo", () => ({ name: "ControlModalCardInfo" }), {
  virtual: true,
});

function makeInstanceMock() {
  return {
    visible: false,
    $mount: jest.fn(),
    $el: document.createElement("div"),
    $destroy: jest.fn(),
  };
}

function makeContext() {
  return {
    app: {
      router: {
        push: jest.fn(),
        beforeEach: jest.fn(),
      },
    },
  };
}

async function loadPlugin(instanceMock) {
  const ModalConstructorMock = jest.fn(() => instanceMock);

  jest.resetModules();
  jest.doMock("vue", () => ({ extend: jest.fn(() => ModalConstructorMock) }));

  const { default: plugin } = await import("./PluginModalCardInfo");
  const Vue = await import("vue");

  return { plugin, Vue, ModalConstructorMock };
}

function runPlugin(plugin, context = makeContext()) {
  let modal;

  plugin(context, (name, value) => {
    if (name === "modalCardInfo") {
      modal = value;
    }
  });
  return { modal, context };
}

describe("PluginModalCardInfo", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("inject", () => {
    it("регистрирует modalCardInfo с методами show / hide / createInstance / redirect / destroy", async () => {
      const { plugin } = await loadPlugin(makeInstanceMock());
      const { modal } = runPlugin(plugin);

      expect(modal).toEqual(
        expect.objectContaining({
          show: expect.any(Function),
          hide: expect.any(Function),
          createInstance: expect.any(Function),
          destroy: expect.any(Function),
        })
      );
    });

    it("вызывает Vue.extend с компонентом ControlModalCardInfo", async () => {
      const { plugin, Vue } = await loadPlugin(makeInstanceMock());

      runPlugin(plugin);

      expect(Vue.extend).toHaveBeenCalledWith({ name: "ControlModalCardInfo" });
    });

    it("регистрирует хук router.beforeEach", async () => {
      const { plugin } = await loadPlugin(makeInstanceMock());
      const { context } = runPlugin(plugin);

      expect(context.app.router.beforeEach).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("createInstance", () => {
    it("создаёт инстанс компонента с переданным infoBlock в propsData", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin, ModalConstructorMock } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);
      const infoBlock = { INFOBLOCK: { TITLE: "Test" } };

      modal.createInstance(infoBlock);

      expect(ModalConstructorMock).toHaveBeenCalledWith({
        propsData: { data: infoBlock },
      });
    });

    it("монтирует инстанс", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.createInstance({});

      expect(instanceMock.$mount).toHaveBeenCalled();
    });

    it("добавляет $el инстанса в document.body", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.createInstance({});

      expect(document.body.contains(instanceMock.$el)).toBe(true);
    });
  });

  describe("show", () => {
    it("создаёт инстанс при первом вызове", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin, ModalConstructorMock } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);
      const infoBlock = { INFOBLOCK: { TITLE: "First" } };

      modal.show(infoBlock);

      expect(ModalConstructorMock).toHaveBeenCalledTimes(1);
      expect(ModalConstructorMock).toHaveBeenCalledWith({
        propsData: { data: infoBlock },
      });
    });

    it("устанавливает visible = true", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.show({});

      expect(instanceMock.visible).toBe(true);
    });

    it("возвращает Promise", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      const result = modal.show({});

      expect(result).toBeInstanceOf(Promise);
    });

    it("не создаёт новый инстанс при повторном вызове", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin, ModalConstructorMock } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.show({});
      modal.show({});

      expect(ModalConstructorMock).toHaveBeenCalledTimes(1);
    });

    it("устанавливает visible = true даже при повторном вызове", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.show({});
      instanceMock.visible = false;
      modal.show({});

      expect(instanceMock.visible).toBe(true);
    });
  });

  describe("hide", () => {
    it("устанавливает visible = false", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.show({});
      modal.hide();

      expect(instanceMock.visible).toBe(false);
    });

    it("разрешает Promise, возвращённый show", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      const promise = modal.show({});
      modal.hide();

      await expect(promise).resolves.toBeUndefined();
    });

    it("не выбрасывает ошибку, если вызван без предварительного show", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      expect(() => modal.hide()).not.toThrow();
    });
  });

  describe("destroy", () => {
    it("вызывает $destroy на инстансе", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.createInstance({});
      modal.destroy();

      expect(instanceMock.$destroy).toHaveBeenCalled();
    });

    it("удаляет $el из document.body", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.createInstance({});
      expect(document.body.contains(instanceMock.$el)).toBe(true);

      modal.destroy();

      expect(document.body.contains(instanceMock.$el)).toBe(false);
    });

    it("разрешает Promise, возвращённый show", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      const promise = modal.show({});
      modal.destroy();

      await expect(promise).resolves.toBeUndefined();
    });

    it("не выбрасывает ошибку, если инстанс отсутствует", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      expect(() => modal.destroy()).not.toThrow();
    });

    it("сбрасывает инстанс — повторный show создаёт новый", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin, ModalConstructorMock } = await loadPlugin(instanceMock);
      const { modal } = runPlugin(plugin);

      modal.show({});
      modal.destroy();
      modal.show({});

      expect(ModalConstructorMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("router.beforeEach", () => {
    function getBeforeEachCallback(context) {
      return context.app.router.beforeEach.mock.calls[0][0];
    }

    it("вызывает destroy при смене пути", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal, context } = runPlugin(plugin);

      modal.createInstance({});
      const guard = getBeforeEachCallback(context);
      guard({ path: "/new" }, { path: "/old" }, jest.fn());

      expect(instanceMock.$destroy).toHaveBeenCalled();
    });

    it("не вызывает destroy, если путь не изменился", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { modal, context } = runPlugin(plugin);

      modal.createInstance({});
      const guard = getBeforeEachCallback(context);
      guard({ path: "/same" }, { path: "/same" }, jest.fn());

      expect(instanceMock.$destroy).not.toHaveBeenCalled();
    });

    it("всегда вызывает next()", async () => {
      const instanceMock = makeInstanceMock();
      const { plugin } = await loadPlugin(instanceMock);
      const { context } = runPlugin(plugin);

      const next = jest.fn();
      const guard = getBeforeEachCallback(context);
      guard({ path: "/a" }, { path: "/b" }, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
