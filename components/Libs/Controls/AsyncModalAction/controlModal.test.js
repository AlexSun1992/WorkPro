import { mount } from "@vue/test-utils";
import ControlModal from "./ControlModal";

describe("ControlModal component", () => {
  let wrapper;

  describe("Check ESC button handler", () => {
    test("ESC must close dialog", async () => {
      const closeModal = jest.fn();

      const wrapper = mount(ControlModal, {
        methods: {
          closeModal,
        },
      });

      expect(closeModal).not.toHaveBeenCalled();

      await wrapper.find("dialog").trigger("keydown", {
        key: "Escape",
        code: "Escape",
      });

      expect(closeModal).toHaveBeenCalled();
    });

    test("ESC not close dialog on closeOnESC = false", async () => {
      const closeModal = jest.fn();

      const wrapper = mount(ControlModal, {
        propsData: {
          closeOnESC: false,
        },
        methods: {
          closeModal,
        },
      });

      expect(closeModal).not.toHaveBeenCalled();

      await wrapper.find("dialog").trigger("keydown", {
        key: "Escape",
        code: "Escape",
      });

      expect(closeModal).not.toHaveBeenCalled();
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

    test.skip("Убираем keydown listener по unmounted ", () => {
      // todo revert when update vue3
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
