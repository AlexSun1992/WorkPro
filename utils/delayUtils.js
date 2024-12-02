export function debounce(func, delay) {
  let timeout;

  return function debounced(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

export function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}
