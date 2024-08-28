import { useState, useContext } from "react";
import {
  ImageBackground,
  View,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import { postLoginAttempt } from "../api";
import { LoggedInContext } from "@/contexts/LoggedIn";
import CryptoES from "crypto-es";
import FormGuidance from "./FormGuidance";

const { validateLogin } = require("../scripts/utils");
const backgroundImage = require("../assets/images/home-screen-background.png");

type Props = {
  setLoginOpen(params: boolean): void;
};

interface FormValues {
  usernameOrEmail: string;
  password: string;
}

interface DataBaseResponse {
  user_id: string;
  username: string;
  email: string;
}

export default function Login(props: Props) {
  const { setLoginOpen } = props;
  const initialValues: FormValues = {
    usernameOrEmail: "",
    password: "",
  };
  const [validFormData, setValidFormData] = useState({
    usernameOrEmail: true,
    password: true,
  });
  const { setLoggedIn } = useContext(LoggedInContext);

  const validateInput = (
    values: FormValues,
    formikHandler: Function,
    property: string,
    value: String
  ): void => {
    const currentvalidity = JSON.parse(JSON.stringify(validFormData));
    const currentValues = JSON.parse(JSON.stringify(values));
    currentValues[property] = value;
    const checkValidity = validateLogin(currentValues);
    currentvalidity[property] = checkValidity[property];
    setValidFormData(currentvalidity);
    formikHandler(property)(value);
  };

  const handleSubmit = (values: FormValues): void => {
    const checkValidity = validateLogin(values);
    setValidFormData(checkValidity);
    if (Object.values(checkValidity).includes(false)) {
      return;
    }
    encryptThenLoginAttempt(values);
  };

  const encryptThenLoginAttempt = (values: FormValues): void => {
    const encryptedValues = JSON.parse(JSON.stringify(values));
    encryptedValues.password = CryptoES.SHA256(
      encryptedValues.password
    ).toString();
    postLoginAttempt(encryptedValues, handleSuccess);
  };

  const handleSuccess = (dbResponse: DataBaseResponse) => {
    setLoggedIn(dbResponse);
    setLoginOpen(false);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.background}>
            <View style={styles.inputAndGuidance}>
              <TextInput
                onChangeText={(value) =>
                  validateInput(values, handleChange, "usernameOrEmail", value)
                }
                onBlur={handleBlur("usernameOrEmail")}
                placeholder="Username or Email"
                value={values.usernameOrEmail}
                style={[
                  styles.formEntry,
                  validFormData.usernameOrEmail
                    ? null
                    : styles.invalidFormEntry,
                ]}
              />
              {!validFormData.usernameOrEmail &&
                !/@/.test(values.usernameOrEmail) && (
                  <FormGuidance guidance={"username"} />
                )}
              {!validFormData.usernameOrEmail &&
                /@/.test(values.usernameOrEmail) && (
                  <FormGuidance guidance={"email"} />
                )}
            </View>
            <View style={styles.inputAndGuidance}>
              <TextInput
                onChangeText={(value) =>
                  validateInput(values, handleChange, "password", value)
                }
                onBlur={handleBlur("password")}
                placeholder="Password"
                value={values.password}
                style={[
                  styles.formEntry,
                  validFormData.password ? null : styles.invalidFormEntry,
                ]}
              />
              {!validFormData.password && (
                <FormGuidance guidance={"password"} />
              )}
            </View>
            <Button title="Submit" onPress={handleSubmit as any} />
          </View>
        )}
      </Formik>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  formEntry: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#21514080",
    backgroundColor: "#ffd5bd80",
  },
  inputAndGuidance: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  invalidFormEntry: {
    backgroundColor: "#DD464680",
  },
});
