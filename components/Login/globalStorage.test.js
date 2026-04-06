import { subscribe, unsubscribe } from "./globalStorage";

describe("globalStorage", () => {
  it("subscribe", () => {
    const setUserInfoFunc = jest.fn();
    const mockData = { type: "setUserInfo", func: setUserInfoFunc };
    subscribe("setUserInfo", setUserInfoFunc);

    window.lk2.setUserInfo(mockData);

    expect(setUserInfoFunc.mock.calls.length).toBe(1);
    expect(setUserInfoFunc).toHaveBeenCalledWith(mockData);
  });

  it("subscribe && unsubscribe", () => {
    const setUserInfoFunc = jest.fn();
    const mockData = { type: "setUserInfo", func: setUserInfoFunc };
    subscribe("setUserInfo", setUserInfoFunc);

    window.lk2.setUserInfo(mockData);
    unsubscribe("setUserInfo", setUserInfoFunc);
    window.lk2.setUserInfo(mockData);

    expect(setUserInfoFunc.mock.calls.length).toBe(1);
    expect(setUserInfoFunc).toHaveBeenCalledWith(mockData);
  });

  it("subscribe called 2 times", () => {
    const setUserInfoFunc = jest.fn();
    const mockData = { type: "setUserInfo", func: setUserInfoFunc };
    subscribe("setUserInfo", setUserInfoFunc);

    window.lk2.setUserInfo(mockData);
    window.lk2.setUserInfo(mockData);

    expect(setUserInfoFunc.mock.calls.length).toBe(2);
    expect(setUserInfoFunc).toHaveBeenCalledWith(mockData);
  });

  it("subscribe called 2 times", () => {
    const setUserInfoFunc = jest.fn();
    const setUserInfoFunc2 = jest.fn();
    const mockData = { type: "setUserInfo", func: setUserInfoFunc };
    subscribe("setUserInfo", setUserInfoFunc);
    subscribe("setUserInfo", setUserInfoFunc2);

    window.lk2.setUserInfo(mockData);
    unsubscribe("setUserInfo", setUserInfoFunc);
    window.lk2.setUserInfo(mockData);
    window.lk2.setUserInfo(mockData);

    expect(setUserInfoFunc.mock.calls.length).toBe(1);
    expect(setUserInfoFunc2.mock.calls.length).toBe(3);
    expect(setUserInfoFunc).toHaveBeenCalledWith(mockData);
    expect(setUserInfoFunc2).toHaveBeenCalledWith(mockData);
  });
});
