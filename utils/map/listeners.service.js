export const callbacks = [];

export function addListener(func) {
  if (typeof func !== "function") {
    throw new Error("Передана не функция");
  }
  callbacks.push(func);
}

export function notifyListeners(data) {
  callbacks.forEach((func) => {
    try {
      func(data);
    } catch (e) {
      console.error(e);
    }
  });
}
