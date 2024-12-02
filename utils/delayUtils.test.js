import { debounce, wait } from "./delayUtils";

describe("Utility Functions", () => {
  describe("debounce", () => {
    jest.useFakeTimers();

    it("should call the function after the specified delay", () => {
      const mockFunc = jest.fn();
      const debouncedFunc = debounce(mockFunc, 500);

      debouncedFunc();
      expect(mockFunc).not.toBeCalled();

      jest.advanceTimersByTime(500);
      expect(mockFunc).toBeCalled();
    });

    it("should not call the function if called again before the delay", () => {
      const mockFunc = jest.fn();
      const debouncedFunc = debounce(mockFunc, 200);

      debouncedFunc();
      jest.advanceTimersByTime(100);
      debouncedFunc();

      jest.advanceTimersByTime(300);
      expect(mockFunc).toBeCalledTimes(1);
    });

    it("should call the function with the correct context and arguments", () => {
      const mockFunc = jest.fn();
      const debouncedFunc = debounce(mockFunc, 200);
      const context = { value: 42 };

      debouncedFunc.call(context, "arg1", "arg2");

      jest.advanceTimersByTime(400);
      expect(mockFunc).toBeCalledWith("arg1", "arg2");
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
  });

  describe("wait", () => {
    it("should resolve after the specified time", async () => {
      jest.useFakeTimers();

      const time = 300;
      const waitPromise = wait(time);

      jest.advanceTimersByTime(301);

      await expect(waitPromise).resolves.toBeUndefined();
    });
  });
});
