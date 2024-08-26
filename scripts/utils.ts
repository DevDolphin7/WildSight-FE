interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SignUpValidFormDataResult {
  username: boolean;
  email: boolean;
  password: boolean;
}

exports.validateSignUp = (
  formData: SignUpFormData
): SignUpValidFormDataResult => {
  const validFormData = { username: false, email: false, password: false };

  validFormData.username = formData.username
    ? /^[a-z0-9-]{3,}$/i.test(formData.username)
    : false;

  validFormData.email = formData.email
    ? /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(formData.email)
    : false;

  validFormData.password = formData.password
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[A-Za-z0-9-_@#$%^&+=]{8,24}$/.test(
        formData.password
      )
    : false;

  return validFormData;
};

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

interface LoginValidFormDataResult {
  usernameOrEmail: boolean;
  password: boolean;
}

exports.validateLogin = (formData: LoginFormData): LoginValidFormDataResult => {
  const validFormData = { usernameOrEmail: false, password: false };

  if (formData.usernameOrEmail) {
    const validUsername = /^[a-z0-9-]{3,}$/i.test(formData.usernameOrEmail);
    const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(
      formData.usernameOrEmail
    );
    validFormData.usernameOrEmail = validUsername || validEmail;
  }

  validFormData.password = formData.password
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[A-Za-z0-9-_@#$%^&+=]{8,24}$/.test(
        formData.password
      )
    : false;

  return validFormData;
};
