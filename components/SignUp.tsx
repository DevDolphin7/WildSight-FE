import { useState, useContext } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import { postUser } from "../api";
import { LoggedInContext } from "@/contexts/LoggedIn";
import FormGuidance from "./FormGuidance";
import CryptoES from "crypto-es";

const { validateSignUp } = require("../scripts/utils");
const backgroundImage = require("../assets/images/home-screen-background.png");

type Props = {
  setSignUpOpen(params: boolean): void;
};

interface FormValues {
  username: string;
  email: string;
  password: string;
}

interface DataBaseResponse {
  user_id: string;
  username: string;
  email: string;
}

export default function SignUp(props: Props) {
  const { setSignUpOpen } = props;
  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
  };
  const [validFormData, setValidFormData] = useState({
    username: true,
    email: true,
    password: true,
  });
  const { setLoggedIn } = useContext(LoggedInContext) as any;

  const validateInput = (
    values: FormValues,
    formikHandler: Function,
    property: string,
    value: String
  ): void => {
    const currentvalidity = JSON.parse(JSON.stringify(validFormData));
    const currentValues = JSON.parse(JSON.stringify(values));
    currentValues[property] = value;
    const checkValidity = validateSignUp(currentValues);
    currentvalidity[property] = checkValidity[property];
    setValidFormData(currentvalidity);
    formikHandler(property)(value);
  };

  const handleSubmit = (values: FormValues): void => {
    const checkValidity = validateSignUp(values);
    setValidFormData(checkValidity);
    if (Object.values(checkValidity).includes(false)) {
      return;
    }
    encryptThenPostUser(values);
  };

  const encryptThenPostUser = (values: FormValues) => {
    const encryptedValues = JSON.parse(JSON.stringify(values));
    encryptedValues.password = CryptoES.SHA256(
      encryptedValues.password
    ).toString();
    postUser(encryptedValues, handleSuccess);
  };

  const handleSuccess = (
    values: FormValues,
    dbResponse: DataBaseResponse
  ): void => {
    setLoggedIn(dbResponse);
    Alert.alert(
      `Welcome ${values.username}!`,
      "Please enjoy using this app responsibly to engage with your surrounding wildlife!\n\nTo find out more, swipe left on the home screen.",
      [
        {
          text: "Got it",
          onPress: () => setSignUpOpen(false),
          style: "default",
        },
      ]
    );
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
                  validateInput(values, handleChange, "username", value)
                }
                onBlur={handleBlur("username")}
                placeholder="Username"
                value={values.username}
                style={[
                  styles.formEntry,
                  validFormData.username ? null : styles.invalidFormEntry,
                ]}
              />
              {!validFormData.username && (
                <FormGuidance guidance={"username"} />
              )}
            </View>
            <View style={styles.inputAndGuidance}>
              <TextInput
                onChangeText={(value) =>
                  validateInput(values, handleChange, "email", value)
                }
                onBlur={handleBlur("email")}
                placeholder="Email"
                value={values.email}
                style={[
                  styles.formEntry,
                  validFormData.email ? null : styles.invalidFormEntry,
                ]}
              />
              {!validFormData.email && <FormGuidance guidance={"email"} />}
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
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as any}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSignUpOpen(false)}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  invalidFormEntry: {
    backgroundColor: "#DD464680",
  },
  button: {
    backgroundColor: "#215140",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 5,
  },
  buttonText: {
    color: "#FEFEFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
