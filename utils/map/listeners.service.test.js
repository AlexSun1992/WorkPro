import { addListener, notifyListeners } from "./listeners.service";
describe("listenerService", () => {
  it("addListener принимает на вход функцию", () => {
    expect(() => addListener(() => {})).not.toThrow();
  });

  it("получаем ошибку если передана не функция", () => {
    expect(() => addListener()).toThrow();
  });

  it("функция func1 вызывается", () => {
    const func1 = jest.fn();
    addListener(func1);
    notifyListeners();

    expect(func1).toHaveBeenCalledTimes(1);
  });
  it("функция func2 после ошибочной func1 вызывается", () => {
    const func1 = () => {
      throw new Error("");
    };
    const func2 = jest.fn();
    addListener(func1);
    addListener(func2);
    notifyListeners();

    expect(func2).toHaveBeenCalledTimes(1);
  });
});
