export function dataManager(data) {
  const urlAddress = /\bhttps?:\/\/\S+/g;
  const phone = /\s(\+7|8)[-]*\(?[-]*(\d{3}[-]*\)?([-]*\d){7}|\d\d[-]*\d\d[-]*\)?([-]*\d){6})/g;
  const email = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

  data.forEach((item) => {
    if (item.SANSWER.match(urlAddress)) {
      if (item.SANSWER.match(urlAddress).length > 0) {
        for (let i = 0; i < item.SANSWER.match(urlAddress).length; i++) {
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(urlAddress)[i],
            `<a target="_blank" href="${item.SANSWER.match(urlAddress)[i]}">${item.SANSWER.match(urlAddress)[i]}</a>`
          );
        }
      } else
        item.SANSWER = item.SANSWER.replace(
          item.SANSWER.match(urlAddress),
          `<a target="_blank" href="${item.SANSWER.match(urlAddress)}">${item.SANSWER.match(urlAddress)}</a>`
        );
    }

    if (item.SANSWER.match(phone)) {
      if (item.SANSWER.match(phone).length > 1) {
        for (let i = 0; i < item.SANSWER.match(phone).length; i++) {
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(phone)[i],
            `<a target="_blank" href=tel:"${item.SANSWER.match(phone)[i]}">${item.SANSWER.match(phone)[i]}</a>`
          );
        }
      } else
        item.SANSWER = item.SANSWER.replace(
          item.SANSWER.match(phone),
          `<a target="_blank" href="tel:${item.SANSWER.match(phone)}">${item.SANSWER.match(phone)}</a>`
        );
    }

    if (item.SANSWER.match(email)) {
      if (item.SANSWER.match(email).length > 1) {
        for (let i = 0; i < item.SANSWER.match(email).length; i++) {
          item.SANSWER = item.SANSWER.replace(
            item.SANSWER.match(email)[i],
            `<a target="_blank" href=tel:"${item.SANSWER.match(email)[i]}">${item.SANSWER.match(phone)[i]}</a>`
          );
        }
      } else
        item.SANSWER = item.SANSWER.replace(
          item.SANSWER.match(email),
          `<a target="_blank" href="mailto:${item.SANSWER.match(email)}">${item.SANSWER.match(email)}</a>`
        );
    }

    if (item.SANSWER.includes("\n")) {
      item.SANSWER = item.SANSWER.replace(/\n/g, "<br />");
    }
  });

  return data;
}
