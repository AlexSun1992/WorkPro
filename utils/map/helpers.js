const getTime = (distance) => {
  const mins = (distance / 3) * 60;
  if (mins > 20) return `${distance.toFixed(1)} км`;
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return hours > 0
    ? `${hours} ч ${parseInt(minutes)} мин`
    : `${parseInt(minutes)} мин`;
};

const isOpened = (office) => {
  let opened = true;
  // if (
  //   office.SSHORTNAME === "ДПМосква-Северо-Запад(РЕСО-73)" ||
  //   office.SSHORTNAME === "РЕСО-735"
  // )
  //   return false;
  let dateNow = new Date();
  let day = dateNow.getDay();
  let dateEnd = new Date();
  day = day == 0 ? 7 : day;
  let dayObj = office.GRAF?.find((item) => item.NDAY == day);
  if (office.GRAF && dayObj) {
    const [endHour, endMinute] = dayObj?.SEND.split(".");
    dateEnd.setHours(endHour);
    dateEnd.setMinutes(endMinute);
    if (dateNow > dateEnd) {
      opened = false;
    }
  }
  if (!dayObj) opened = false;
  return opened;
};

const showWorkingHours = (agency) => {
  let dateNow = new Date();
  let day = dateNow.getDay();
  let dateEnd = new Date();
  day = day == 0 ? 7 : day;

  if (!agency.GRAF) return "";

  let dayObj = agency.GRAF?.find((item) => item.NDAY == day);
  let nexDayObj = agency.GRAF?.find((item) => item.NDAY == day + 1);
  let closedString =
    "Закрыт до " +
    ("0" + (dateNow.getDate() + 1)).slice(-2) +
    "." +
    ("0" + (dateNow.getMonth() + 1)).slice(-2) +
    "." +
    dateNow.getFullYear();

  if (dayObj) {
    const [endHour, endMinute] = dayObj?.SEND.split(".");
    dateEnd.setHours(endHour);
    dateEnd.setMinutes(endMinute);
    let str;
    if (dateNow < dateEnd) {
      str = `Открыт до ${dateEnd.getHours()}:${
        dateEnd.getMinutes() == 0
          ? dateEnd.getMinutes() + "0"
          : dateEnd.getMinutes()
      }`;
    } else if (dateNow > dateEnd) {
      str = `Откроется завтра в ${nexDayObj.SBEGIN}`;
    }
    // else if (dateNow > dateEnd) {
    //   dateNow.setDate(
    //     dateNow.getDate() + ((1 + 7 - dateNow.getDay()) % 7 || 7)
    //   );
    //   str = closedString;
    // }
    return str;
  }
  return closedString;
};

const getTemplate = (agency) => {
  let phonesArr = agency.SPHONE?.split(";");
  let grafArr = agency.SGRAF?.split("\n");
  phonesArr?.pop();
  grafArr?.pop();
  let template = `
      <div class="card-body">
        <h4 class="card-title">${agency.SSHORTNAME}</h4>
        <div class="card-office-adress row">
          <div class="col-4 pe-0">
            <div class="position-relative">
              <img src="" />
              <button class="office-image-zoom" type="button"></button>
            </div>
          </div>
          <div class="col-8">
            <div>${agency.SADDRESS}</div>
            <div class="card-office-opened">Открыт до</div>
          </div>
        </div>
        <div class="card-office-undeground">
          <span class="undeground-color"></span>
          <span>Ленинский проспект</span>
          <span class="card-office-distance"> 1.5 км </span>
        </div>
        <div class="card-office-time">
          <button type="button">Режим работы:</button>
          <div class="card-office-times">${agency.SGRAF}</div>
        </div>
        <div class="card-office-contacts">
          <a href="tel:${agency.SPHONE}">${agency.SPHONE}</a>
          <div>
            <a href="mailto:${agency.SEMAIL}" class="card-office-e-mail">${agency.SEMAIL}</a>
          </div>
        </div>
      </div>`;
  template = template.replace(
    /<div class="card-office-times">[^<]*?<\/div[^>]*>\n/g,
    () => {
      let temp = "";
      grafArr.forEach((graf) => {
        temp += `<div class="card-office-times">${graf}</div>`;
      });
      return temp;
    }
  );
  template = template.replace(/<a href="tel:[^"]*">(.*?)<\/a[^>]*>/g, () => {
    let temp = "";
    phonesArr?.forEach((phone) => {
      temp += `<div class="card-office-phone"><a href="tel:${phone}">${phone}</a></div>`;
    });
    return temp;
  });
  template = template.replace(
    /<a href="mailto:[^"].+? class="card-office-e-mail">(.*?)<\/a[^>]*?>/g,
    () => {
      return agency.SEMAIL
        ? `<div><a href="mailto:${agency.SEMAIL}" class="card-office-e-mail">${agency.SEMAIL}</a></div>`
        : "";
    }
  );

  template = template.replace(
    /<div class="col-4 pe-0">[\n\s]*?<div class="position-relative">[\n\s]*?<img src="" \/>[\n\s]*?<button class="office-image-zoom" type="button"><\/button>[\n\s]*?<\/div>[\n\s]*?<\/div[^>]*>/g,
    () => {
      let url = "https://www.reso.ru/export/sites_reso/" + `${agency.SPATH1}`;
      return agency.SPATH1
        ? `<div class="col-4 pe-0"><div class="position-relative"><img src=${url} /><button class="office-image-zoom" type="button"></button></div></div>`
        : "";
    }
  );

  template = template.replace(
    /<div class="card-office-undeground">[\n\s]*?<span class="undeground-color"><\/span>[\n\s]*?<span>[^<]*?<\/span>[\n\s]*?<span class="card-office-distance">[^<]*?<\/span>[\n\s]*?<\/div>/,
    () => {
      let temp = "";
      if (agency.IDUNDERGROUND.length > 0) {
        temp += `<div class="card-office-undeground">`;
        agency.IDUNDERGROUND.forEach((item) => {
          temp += `<div>
                  <span class=${"undeground-color_" + item.IDUNDERLINE}></span>
                  <span>${item.SNAME}</span>
                  <span class="card-office-distance"> 
                  ${getTime(agency.NDISTANSE)} </span>
                  </div>
                `;
        });
        temp += "</div>";
      } else {
        temp = "";
      }

      return temp;
    }
  );

  template = template.replace(
    /<div class="col-8">[\n\s]*?<div>[\n\s]*?(.*?)[\n\s]*?<\/div>[\n\s]*?<div class="card-office-opened">[\n\s]*?Открыт до[\n\s]*?<\/div>[\n\s]*?<\/div>/,
    () => {
      return agency.SPATH1
        ? `<div class="col-8">
                <div>${agency.SADDRESS}</div>
                <div class="card-office-${
                  isOpened(agency) ? "opened" : "closed"
                }">${showWorkingHours(agency)}</div>
              </div>`
        : `<div class="col-12">
              <div>${agency.SADDRESS}</div>
              <div class="card-office-${
                isOpened(agency) ? "opened" : "closed"
              }">${showWorkingHours(agency)}</div>
          </div>`;
    }
  );
  return template;
};

const count = (office) => {
  let str;
  if (!office.info) return;
  if (office.info.length == 1) {
    str = office.info.length + " отделение";
  } else if (office.info.length > 1 && office.info.length < 5) {
    str = office.info.length + " отделения";
  } else {
    str = office.info.length + " отделений";
  }
  return str;
};

const getUnderlineId = (station, item) => {
  let obj = item.IDUNDERGROUND.find((element) => {
    return element.SNAME.includes(station);
  });
  return obj?.IDUNDERLINE;
};

const getPhones = (phones) => {
  let phonesArr = phones.split(";");
  phonesArr.pop();
  return phonesArr;
};

const getGrafs = (grafs) => {
  let grafsArr = grafs.split("\n");
  grafsArr.pop();
  return grafsArr;
};

const checkClusterStatus = (clusterer) => {
  for (let i = 0; i <= clusterer.getClusters().length; i++) {
    let counter = 0;
    for (
      let j = 0;
      j <= clusterer.getClusters()[i]?.getGeoObjects().length;
      j++
    ) {
      let isOpened = clusterer
        .getClusters()
        [i].getGeoObjects()
        [j]?.properties.get("balloonContentBody")
        .includes("opened");

      if (
        clusterer
          .getClusters()
          [i].getGeoObjects()
          [j]?.properties.get("balloonContentBody")
          .match(/card-office-closed/g)
      )
        counter++;
      if (isOpened) {
        clusterer
          .getClusters()
          [i].options.set("preset", "islands#darkGreenClusterIcons");
      }
    }
    if (counter === clusterer.getClusters()[i]?.getGeoObjects().length) {
      clusterer
        .getClusters()
        [i].options.set("preset", "islands#invertedGrayClusterIcons");
    }
  }
};

module.exports = {
  getTime,
  isOpened,
  showWorkingHours,
  getTemplate,
  count,
  getUnderlineId,
  getPhones,
  getGrafs,
  checkClusterStatus,
};
