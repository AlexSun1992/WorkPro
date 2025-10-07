export function eventHandler(data) {
  return data;
}
export function initHandler(data) {
  const payBtn = data.find((f) => f.name === "Item47368");

  if (payBtn?.visible === true) {
    setTimeout(() => {
      if (document.getElementById("payBtn")) {
        /*
        const priceBlock = document.getElementById('payBtn');
        window.scrollTo(0, (priceBlock.offsetTop - window.innerHeight/2 + priceBlock.offsetHeight));
        window.scrollTo(0, (priceBlock.offsetTop - window.innerHeight + priceBlock.offsetHeight));
        */
        const priceBlock = document.querySelector(".pay_block");
        window.scrollTo(0, priceBlock.offsetTop - 40);
      }
    }, 0);
  }
}
