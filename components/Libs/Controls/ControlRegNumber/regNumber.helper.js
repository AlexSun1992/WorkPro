 isNumberValid(value) {
    if (
      /^[АВЕКМНОРСТУХABEHKMNOPCTYX]\d{3}(?<!000)[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}$/iu.test(
        value
      )
    ) {
      return true;
    }
    if (/^[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}\d{3}(?<!000)$/iu.test(value)) {
      return true;
    }
    if (/^[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}\d{4}(?<!0000)$/iu.test(value)) {
      return true;
    }
    if (/^\d{4}(?<!0000)[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}$/iu.test(value)) {
      return true;
    }
    if (
      /^[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}\d{3}(?<!000)[АВЕКМНОРСТУХABEHKMNOPCTYX]$/iu.test(
        value
      )
    ) {
      return true;
    }
    if (/^Т[АВЕКМНОРСТУХABEHKMNOPCTYX]{2}\d{3}(?<!000)$/iu.test(value)) {
      return true;
    }
    return false;
  }