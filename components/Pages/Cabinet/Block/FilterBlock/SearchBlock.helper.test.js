import { getFilteredArray, isStringInItem } from "./SearchBlock.helper";

describe("SearchBlock.helper.test.js", () => {
  it("Строка является пустой", async () => {
    const isExists = isStringInItem({}, "");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является string и пустая строка", async () => {
    const isExists = isStringInItem("", "");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является string и строка со значением ", async () => {
    const isExists = isStringInItem("", "string");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является number и строка со значением", async () => {
    const isExists = isStringInItem(4, "4");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является number и пустая строка", async () => {
    const isExists = isStringInItem(4, "");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является object[] и строка со значением ", async () => {
    const isExists = isStringInItem([], "string");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является object[] и строка со значением ", async () => {
    const isExists = isStringInItem(["", "", "", "string"], "string");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является null и строка со значением ", async () => {
    const isExists = isStringInItem(null, "null");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является object{} со вложенным [] и строка со значением ", async () => {
    const isExists = isStringInItem({ a: [{ b: 1 }] }, "1");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является object{} со вложенным [] и строка со значением ", async () => {
    const isExists = isStringInItem({ a: [{ b: 1 }] }, "2");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является object{} со значением и строка со значением ", async () => {
    const isExists = isStringInItem({ a: 1 }, "1");
    expect(isExists).toEqual(true);
  });

  it("Входными параметрами является object{} и строка со значением ", async () => {
    const isExists = isStringInItem({}, "{}");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является boolean и строка со значением ", async () => {
    const isExists = isStringInItem(false, "false");
    expect(isExists).toEqual(false);
  });

  it("Входными параметрами является undefined и строка со значением ", async () => {
    const isExists = isStringInItem(undefined, "undefined");
    expect(isExists).toEqual(false);
  });
});
