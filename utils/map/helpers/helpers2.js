const getTime = (distance) => {
  if (!distance) return "";
  const mins = (distance / 3) * 60;
  if (mins > 20) return `${distance.toFixed(1)} км`;
  const minutes = mins === 0 ? 1 : mins % 60;
  return `${parseInt(minutes)} мин`;
};

const isOpened = (office) => {
  let opened = true;
  const dateNow = new Date();
  let day = dateNow.getDay();
  const dateEnd = new Date();
  day = day === 0 ? 7 : day;
  const dayObj = office.GRAF?.find((item) => item.NDAY === day);
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
  if (!agency.GRAF) return "";

  const dateNow = new Date();
  const dateNext = new Date();
  dateNext.setDate(dateNext.getDate() + 1);
  let day = dateNow.getDay();
  const dateEnd = new Date();
  day = day == 0 ? 7 : day;

  const dayObj = agency.GRAF?.find((item) => item.NDAY == day);
  const nexDayObj = agency.GRAF?.find((item) => item.NDAY == day + 1);
  const closedString = `Закрыт до ${`0${dateNext.getDate()}`.slice(-2)}.${`0${dateNext.getMonth() + 1}`.slice(
    -2
  )}.${dateNext.getFullYear()}`;

  if (dayObj) {
    const [endHour, endMinute] = dayObj?.SEND.split(".");
    dateEnd.setHours(endHour);
    dateEnd.setMinutes(endMinute);
    let str;
    if (dateNow < dateEnd) {
      str = `Открыт до ${dateEnd.getHours()}:${
        dateEnd.getMinutes() == 0 ? `${dateEnd.getMinutes()}0` : dateEnd.getMinutes()
      }`;
    } else if (dateNow > dateEnd && nexDayObj) {
      str = `Откроется завтра в ${nexDayObj.SBEGIN}`;
    } else {
      str = "";
    }
    return str;
  }
  return closedString;
};

const getPhones = (officePhones) => {
  const phones = [];
  Object.values(officePhones).forEach((phone) => {
    phones.push({
      clear: phone,
      view: `${phone.substring(0, 2)}(${phone.substring(2, 5)})${phone.substring(5, 8)}-${phone.substring(
        8,
        10
      )}-${phone.substring(10, 12)}${phone.includes(",") ? ` доб. ${phone.split(",")[1]}` : ""}`,
    });
  });
  return phones;
};

const sortOffices = (offices, centerCoords) => {
  function getDistance(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  }
  return offices.sort((a, b) => {
    const distanceA = getDistance([a.NLAT, a.NLONG], centerCoords);
    const distanceB = getDistance([b.NLAT, b.NLONG], centerCoords);

    if (distanceA > distanceB) return 1;
    if (distanceA < distanceB) return -1;
    if (a.NLAT === b.NLAT && a.NLONG === b.NLONG) {
      const orderA = a.NORDER ? a.NORDER : 1000;
      const orderB = b.NORDER ? b.NORDER : 1000;
      return orderA - orderB;
    }
    return -1;
  });
};

const getTemplate = (agency) => {
  const phonesArr = getPhones(agency.PHONES);
  const grafArr = agency.SGRAF?.split("\n");
  if (phonesArr) {
    if (phonesArr[phonesArr.length - 1] === "") {
      phonesArr.pop();
    }
  }
  if (grafArr) {
    if (grafArr[grafArr.length - 1] === "***") {
      grafArr.pop();
    }
  }
  let template = `
      <div class="card-body">
        <h4 class="card-title">${agency.SSHORTNAME ?? "Офис продаж"}</h4>
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
        <div class="tags-block"></div>
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
  template = template.replace(/<div class="tags-block">[^<]*?<\/div[^>]*>\n/g, () =>
    agency.LSPR || agency.LREG_CENTER
      ? '<div class="tags-block"><div class="green-tags mt-2">Урегулирование страховых случаев</div></div>'
      : ""
  );
  template = template.replace(/<div class="card-office-times">[^<]*?<\/div[^>]*>\n/g, () => {
    let temp = "";
    grafArr?.forEach((graf) => {
      temp += `<div class="card-office-times">${graf}</div>`;
    });
    return temp;
  });
  template = template.replace(/<a href="tel:[^"]*">(.*?)<\/a[^>]*>/g, () => {
    let temp = "";
    phonesArr?.forEach((phone) => {
      temp += `<div class="card-office-phone"><a href="tel:${phone.clear}">${phone.view}</a></div>`;
    });
    return temp;
  });
  template = template.replace(/<a href="mailto:[^"].+? class="card-office-e-mail">(.*?)<\/a[^>]*?>/g, () =>
    agency.SEMAIL ? `<div><a href="mailto:${agency.SEMAIL}" class="card-office-e-mail">${agency.SEMAIL}</a></div>` : ""
  );

  template = template.replace(
    /<div class="col-4 pe-0">[\n\s]*?<div class="position-relative">[\n\s]*?<img src="" \/>[\n\s]*?<button class="office-image-zoom" type="button"><\/button>[\n\s]*?<\/div>[\n\s]*?<\/div[^>]*>/g,
    () => {
      const url = "/export/sites/reso" + `${agency.SPATH1}`;
      return agency.SPATH1
        ? `<div class="col-4 pe-0"><div class="position-relative"><img src=${url} /><button class="office-image-zoom" type="button"></button></div></div>`
        : "";
    }
  );

  template = template.replace(
    /<div class="card-office-undeground">[\n\s]*?<span class="undeground-color"><\/span>[\n\s]*?<span>[^<]*?<\/span>[\n\s]*?<span class="card-office-distance">[^<]*?<\/span>[\n\s]*?<\/div>/,
    () => {
      let temp = "";
      if (agency.SDADATAMETRO) {
        temp += `<div class="card-office-undeground">`;
        if (agency.SDADATAMETRO && Array.isArray(agency.SDADATAMETRO)) {
          agency.SDADATAMETRO.forEach((item) => {
            temp += `<div>
                      <span class=${"undeground-color_"} data-line=${item.LINE}></span>
                      <span>${item.SNAME}</span>
                      <span class="card-office-distance">
                      ${getTime(item.DISTANCE)} </span>
                      </div>
                    `;
          });
          temp += "</div>";
        }
      } else {
        temp = "";
      }

      return temp;
    }
  );

  template = template.replace(
    /<div class="col-8">[\n\s]*?<div>[\n\s]*?(.*?)[\n\s]*?<\/div>[\n\s]*?<div class="card-office-opened">[\n\s]*?Открыт до[\n\s]*?<\/div>[\n\s]*?<\/div>/,
    () =>
      agency.SPATH1
        ? `<div class="col-8">
                  <div>${agency.SADDRESS}</div>
                  <div class="card-office-${isOpened(agency) ? "opened" : "closed"}">${showWorkingHours(agency)}</div>
                </div>`
        : `<div class="col-12">
                <div>${agency.SADDRESS}</div>
                <div class="card-office-${isOpened(agency) ? "opened" : "closed"}">${showWorkingHours(agency)}</div>
            </div>`
  );
  return template;
};

const countOffices = (office) => {
  let str;
  if (office.info.length === 1) {
    str = `${office.info.length} отделение`;
  } else if (office.info.length > 1 && office.info.length < 5) {
    str = `${office.info.length} отделения`;
  } else {
    str = `${office.info.length} отделений`;
  }
  return str;
};

const getUnderlineId = (station, item) => {
  const obj = item.IDUNDERGROUND.find((element) => element.SNAME.toLowerCase().includes(station.toLowerCase()));
  return obj?.IDUNDERLINE;
};

/* const getPhones = (phones) => {
  const phonesArr = phones.split(";");
  phonesArr.pop();
  return phonesArr;
}; */

const getGrafs = (grafs) => {
  const grafsArr = grafs.split("\n");
  if (grafsArr.length > 1) {
    const nonExtraValuesGrafs = grafsArr.filter((item) => item !== "***");
    return nonExtraValuesGrafs;
  }
  return grafsArr;
};

const checkClusterStatus = (clusterer) => {
  for (let i = 0; i <= clusterer.getClusters().length; i++) {
    let counter = 0;
    for (let j = 0; j <= clusterer.getClusters()[i]?.getGeoObjects().length; j++) {
      const isOpened = clusterer
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
        clusterer.getClusters()[i].options.set("preset", "islands#darkGreenClusterIcons");
      }
    }
    if (counter === clusterer.getClusters()[i]?.getGeoObjects().length) {
      clusterer.getClusters()[i].options.set("preset", "islands#invertedGrayClusterIcons");
    }
  }
};

module.exports = {
  getTime,
  isOpened,
  showWorkingHours,
  getTemplate,
  countOffices,
  getUnderlineId,
  getPhones,
  sortOffices,
  getGrafs,
  checkClusterStatus,
};
