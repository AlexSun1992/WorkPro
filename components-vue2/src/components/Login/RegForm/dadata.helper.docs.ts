 async function fetchSuggestions(params:object) {
    const type:string = params.suggestionType
    const key:string = params.key;
    delete params.suggestionType;
    delete params.key;
  
    

    //   if (this.family === "" && this.name === "" && this.patronymic === "") {
    //     this.gender = "UNKNOWN";
    //   }
    //   params.gender = this.gender;
   
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
  }