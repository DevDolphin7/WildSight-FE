interface FormData {
  username: string;
  email: string;
  password: string;
}

interface ValidFormDataResult {
  username: boolean;
  email: boolean;
  password: boolean;
}

exports.validateSignUp = (formData: FormData): ValidFormDataResult => {
  const validFormData = { username: false, email: false, password: false };

  validFormData.username = formData.username
    ? /^[a-z0-9-]{3,}$/i.test(formData.username)
    : false;

  validFormData.email = formData.email
    ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(formData.email)
    : false;

  validFormData.password = formData.password
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[A-Za-z0-9-_@#$%^&+=]{8,24}$/.test(formData.password)
    : false;

  return validFormData;
};
