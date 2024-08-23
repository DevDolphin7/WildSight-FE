import { useState } from "react";
import {
  ImageBackground,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import axios from "axios";

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
  const [userCreated, setUserCreated] = useState(false);

  const validateSubmission = (values: FormValues): void => {
    const checkValidity = validateSignUp(values);
    setValidFormData(checkValidity);
  };

  const handleSubmit = (values: FormValues): void => {
    const checkValidity = validateSignUp(values);
    setValidFormData(checkValidity);
    if (Object.values(checkValidity).includes(false)) {
      return;
    }
    axios
      .post("https://wildside-be.onrender.com/api/users/", values)
      .then(() => {
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
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Formik
        initialValues={initialValues}
        validate={validateSubmission}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.background}>
            <TextInput
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              placeholder="Username"
              value={values.username}
              style={[
                styles.formEntry,
                validFormData.username ? null : styles.invalidFormEntry,
              ]}
            />
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="Email"
              value={values.email}
              style={[
                styles.formEntry,
                validFormData.email ? null : styles.invalidFormEntry,
              ]}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="Password"
              value={values.password}
              style={[
                styles.formEntry,
                validFormData.password ? null : styles.invalidFormEntry,
              ]}
            />
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
    marginBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#21514080",
    backgroundColor: "#ffd5bd80",
  },
  invalidFormEntry: {
    backgroundColor: "#DD464680",
  },
});
