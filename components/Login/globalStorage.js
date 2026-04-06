const listeners = [];

export function subscribe(type, func) {
  listeners.push({ type, func });
}

export function unsubscribe(type, func) {
  listeners.forEach((listener, idx) => {
    if (listener.type === type && listener.func === func) {
      listeners.splice(idx, 1);
    }
  });
}

if (typeof window !== "undefined") {
  window.lk2 = {
    setUserInfo: (data) => {
      listeners.forEach((listener) => {
        if (listener.type === "setUserInfo") {
          listener.func(data);
        }
      });
    },
  };
}
