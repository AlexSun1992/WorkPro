export function validationEmail(field) {
  if (!field?.value) {
    return;
  }

  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]{2,}$/;
  if (!reg.test(field.value)) {
    field.error = "Пожалуйста, введите корректный e-mail";
    field.state = false;
  } else {
    field.error = null;
    field.state = true;
  }
}
