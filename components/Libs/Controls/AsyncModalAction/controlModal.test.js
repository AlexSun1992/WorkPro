import { mount } from "@vue/test-utils";
import ControlModal from "./ControlModal";

describe("ControlModal component", () => {
  let wrapper;

  describe("Check ESC button handler", () => {
    test("ESC must close dialog", () => {
      const escPressed = jest.fn();
      const event = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });

      mount(ControlModal, {
        methods: {
          closeModal: escPressed,
        },
      });

      expect(escPressed).not.toHaveBeenCalled();

      window.dispatchEvent(event);

      expect(escPressed).toHaveBeenCalled();
    });

    test("should call closeModal method", async () => {
      const closeModalMock = jest.fn();
      const event = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });

      mount(ControlModal, {
        propsData: {
          closeOnESC: true,
        },
        methods: {
          closeModal: closeModalMock,
        },
      });

      expect(closeModalMock).not.toHaveBeenCalled();

      window.dispatchEvent(event);

      expect(closeModalMock).toHaveBeenCalled();
    });

    test("should call closeModal method", async () => {
      const closeModalMock = jest.fn();
      const event = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });

      mount(ControlModal, {
        propsData: {
          closeOnESC: false,
        },
        methods: {
          closeModal: closeModalMock,
        },
      });

      expect(closeModalMock).not.toHaveBeenCalled();

      window.dispatchEvent(event);

      expect(closeModalMock).not.toHaveBeenCalled();
    });
  });

  describe("ControlModal component + установление стилей (overflow = 'hidden')", () => {
    const mockDialogApi = (wrapper) => {
      wrapper.vm.$refs.modal = {
        showModal: jest.fn(),
        close: jest.fn(),
      };
    };

    beforeEach(() => {
      document.body.style.overflow = "";
      document.body.innerHTML = `<div id="app"></div>`;
    });

    test("Устанавливается значение overflow hidden при вызове showModal и отрабатывает emit('open')", () => {
      const wrapper = mount(ControlModal, { attachTo: document.body });
      mockDialogApi(wrapper);

      wrapper.vm.openModal();

      expect(wrapper.vm.$refs.modal.showModal).toHaveBeenCalled();
      expect(document.body.style.overflow).toBe("hidden");
      expect(wrapper.emitted("open")).toBeTruthy();
    });

    test("Работает dialog.close() при вызове closeModal, устанавливаем значение overflow='' и вызываем emit('close')", () => {
      const wrapper = mount(ControlModal, { attachTo: document.body });
      mockDialogApi(wrapper);

      // откроем, чтобы увидеть изменение overflow
      wrapper.vm.openModal();
      wrapper.vm.closeModal();

      expect(wrapper.vm.$refs.modal.close).toHaveBeenCalled();
      expect(document.body.style.overflow).toBe("");
      expect(wrapper.emitted("close")).toBeTruthy();
    });

    test("Убираем keydown listener по destroyed", () => {
      const removeSpy = jest.spyOn(window, "removeEventListener");

      const wrapper = mount(ControlModal, { attachTo: document.body });
      wrapper.destroy();

      expect(removeSpy).toHaveBeenCalledWith("keydown", wrapper.vm.escPressed);

      removeSpy.mockRestore();
    });

    test("Появление модального окна по watch isOpen", async () => {
      const openModalMock = jest.fn();

      const wrapper = mount(ControlModal, {
        attachTo: document.body,
        methods: { openModal: openModalMock },
        propsData: { isOpen: false },
      });

      expect(openModalMock).not.toHaveBeenCalled();

      await wrapper.setProps({ isOpen: true });

      expect(openModalMock).toHaveBeenCalled();
    });
  });
});
