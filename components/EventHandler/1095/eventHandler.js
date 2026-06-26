export function eventHandler(data, item) {
  if (item.value === "Item45282") {
    if (item.resp) {
      const { ID, REL } = item.resp.data[0];
      window.location.href = `/individual/auto/osago?ID=${ID}&REL=${REL}`;
      return null;
    }
  }
  /* 
   Вот тут хочу добавить функцию 
   бла бла  foo bar
  */
  return data;
}

export function initHandler(data) {
  setTimeout(() => {
    const btnGreyAuth = document.querySelector(".bg-auth-grey");
    const chipsCard = document.querySelector(".chips-card");

    const changeClass = (element) => {
      const closestElement = element?.closest(".col-12");
      if (closestElement) {
        closestElement.classList.remove("col-lg-6");
        closestElement.classList.add("col-lg-12");
      }
    };

    if (btnGreyAuth && !chipsCard) {
      changeClass(btnGreyAuth);
    }
    if (!btnGreyAuth && chipsCard) {
      changeClass(chipsCard);
    }
  }, 0);
  return data;
}
