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
});
