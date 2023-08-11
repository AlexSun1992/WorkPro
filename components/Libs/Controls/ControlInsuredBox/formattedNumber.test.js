import { formattedNumber } from "./formattedNumber";

describe("formattedNumber", () => {
  it("Значение является строкой", async () => {
    const prettyNumber = formattedNumber("100020202");
    expect(prettyNumber).toEqual("100 020 202");
  });

  it("Значение является числом", async () => {
    const prettyNumber = formattedNumber(100020202);
    expect(prettyNumber).toEqual("100 020 202");
  });

  it("Пустое значение", async () => {
    const prettyNumber = formattedNumber("");
    expect(prettyNumber).toEqual("0");
  });

  it("Значение null", async () => {
    const prettyNumber = formattedNumber(null);
    expect(prettyNumber).toEqual("0");
  });

  it("Значение true", async () => {
    const prettyNumber = formattedNumber(true);
    expect(prettyNumber).toEqual("1");
  });

  it("Значение false", async () => {
    const prettyNumber = formattedNumber(null);
    expect(prettyNumber).toEqual("0");
  });

  it("Значение с копейками", async () => {
    const prettyNumber = formattedNumber(1111111111.11);
    expect(prettyNumber).toEqual("1 111 111 111,11");
  });
});
