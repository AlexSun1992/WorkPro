const callbacks = [];

export function addListener(func) {
  callbacks.push(func);
}

export function notifyListeners(data) {
  callbacks.forEach((func) => func(data));
}
