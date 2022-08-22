 async function fetchSuggestions(params:object){
    const type:string = params.suggestionType
    const key:string = params.key;
    delete params.suggestionType;
    delete params.key;
  
    const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${key}`,
      },
      body: JSON.stringify(params),
    });
   
    const result:Array = await response.json();
  
    return result.suggestions;
  },

   
  function createParamsForRequest(
    inputQuery:string,
    name:string,
    surname:string,
    patronimyc:string,
    gender:string
  ) {
    const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";
    let suggestionType = "fio";
    let query;
  
    const params:{
      query:string,
      suggestionType:string,
      key:string
    } = {
      query: query,
      suggestionType,
      key: API_KEY,
    };
    if (inputQuery === "patronymic") {
      params.query = patronimyc;
      params.parts = ["PATRONYMIC"];
      params.gender = gender;
    } else if (inputQuery === "surname") {
      params.query = surname;
      params.parts = ["SURNAME"];
      params.gender = gender;
    } else if (inputQuery === "name") {
      params.query = name;
      params.parts = ["NAME"];
      params.gender = gender;
    }
    return params;
  }

  async function getSuggestions(
    queryParam:string,
    suggestionsHub:any[],
    currentSuggestions:any[],
    family:string,
    name:string,
    patronymic:string
  ) {
    if (queryParam === "surname" && family !== false) {
      currentSuggestions.length = 0;
      await suggestionsHub.forEach((item) => {
        currentSuggestions.push(item.data.surname);
      });
    } else if (queryParam === "name" && name !== false) {
      currentSuggestions.length = 0;
      await suggestionsHub.forEach((item) => {
        currentSuggestions.push(item.data.name);
      });
    } else if (queryParam === "patronymic" && patronymic !== false) {
      currentSuggestions.length = 0;
      await suggestionsHub.forEach((item) => {
        currentSuggestions.push(item.data.patronymic);
      });
    }
    return currentSuggestions;
  }


  function revealGender(name:string, surname:string, patronymic:string) {
    if (name === "" && surname === "" && patronymic === "") {
      return false;
    }
    return true;
  }

  function userSurnameGender(suggestionsFetched:any[], userSurname:string) {
    const getGenderFromSurname = suggestionsFetched.find(
      (item) => item.value === userSurname
    );
    return getGenderFromSurname?.data.gender;
  }

  function userNameGender(suggestionsFetched:any[], userName:string) {
    const getGenderFromName = suggestionsFetched.find(
      (item) => item.value === userName
    );
    return getGenderFromName?.data.gender;
  }

  function userPatronymicGender(suggestionsFetched:any[], patronimyc:string) {
    const getGenderFromPatronimyc = suggestionsFetched.find(
      (item) => item.value === patronimyc
    );
    return getGenderFromPatronimyc?.data.gender;
  }