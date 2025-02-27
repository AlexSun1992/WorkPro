import { setScript, clearScript, updateScript } from "./eventHandler.helper";

describe("Загрузка скрипта(eventHandler)", () => {
  it("Устанавливаем дефолтный скрипт", async () => {
    const mockScript = `function getAgeFromBirthday(birthday) {
        if(birthday){
          var totalMonths = moment().diff(birthday, 'months');
          var years = parseInt(totalMonths / 12);
          var months = totalMonths % 12;
            if(months !== 0){
               return parseFloat(years + '.' + months);
             }
        return years;
          }
        return null;
    }

     async function eventHandler(actions){
        return actions
      }

     async function initHandler(actions){
       return actions
     }
      `;

    updateScript(mockScript);
    const getEventHandlerValue = await window.eventHandler(12);
    const getInitHandlerValue = await window.initHandler(15);
    expect(getEventHandlerValue).toBe(12);
    expect(getInitHandlerValue).toBe(15);
  });

  it("Получаем дефолтные значения скрипта", async () => {
    clearScript();
    const getEventHandlerValue = await window.eventHandler();
    const getInitHandlerValue = await window.initHandler();
    expect(getInitHandlerValue).toBe(null);
    expect(getEventHandlerValue).toBe(null);
  });

  it("Переопределяем значения скриптов", async () => {
    const mockScript = `
   async function eventHandler(actions){
      return actions
    }
   async function initHandler(actions){
     return actions
   }`;

    setScript(mockScript);
    const getEventHandlerValue = await window.eventHandler(20);
    expect(getEventHandlerValue).toBe(20);

    clearScript();

    const getEventHandlerValueAfterClear = await window.eventHandler();
    expect(getEventHandlerValueAfterClear).toBe(null);
    wait wrapper.find({ ref: "messageInput" }).setValue("deposition");
    wait wrapper.find('[data-test="send-data"]').trigger("click");
    await wrapper.find({ ref: "messageInput" }).setValue("depositional");
    await wrapper.find('[data-test="send-data"]').trigger("click");
    await wrapper.find({ ref: "messageInput" }).setValue("depositions");
    await wrapper.find('[data-test="send-data"]').trigger("click");
    await wrapper.find({ ref: "messageInput" }).setValue("depositive");
    wait
  });
});
