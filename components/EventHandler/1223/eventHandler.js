export function eventHandler(data) {
  return data;
}
export function initHandler(data) {
  const payBtn = data.find((f) => f.name === "Item52031");

  if (payBtn?.visible === true) {
    setTimeout(() => {
      if (document.getElementById("payBtn")) {
        const priceBlock = document.querySelector(".pay_block");
        window.scrollTo(0, priceBlock.offsetTop - 40);
      }
    }, 0);
  }
  return data;
}
