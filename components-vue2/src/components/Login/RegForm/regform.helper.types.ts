type PasswordValidator = {
  /** Текст ошибки */
  errorText: string;
  /** Функция проверки ошибки */
  isError: (pass: string) => boolean;
  /** Индикатор */
  indicator: number;
};

export type PasswordValidators = {
  lengthValidation: PasswordValidator;
  customValidation: PasswordValidator;
  spaceValidation: PasswordValidator;
  russianSignValidation: PasswordValidator;
};
