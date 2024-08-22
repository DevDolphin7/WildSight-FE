import { useState } from "react";
import {
  ImageBackground,
  View,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { Formik, FormikHelpers } from "formik";

const { validateSignUp } = require("../scripts/utils");
const backgroundImage = require("../assets/images/home-screen-background.png");

interface FormValues {
  [username: string]: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const initialValues: FormValues = { username: "", email: "", password: "" };
  const [validFormData, setValidFormData] = useState({
    username: true,
    email: true,
    password: true,
  });

  const validateSubmission = (values: object): void => {
    const checkValidity = validateSignUp(values);
    setValidFormData(checkValidity);
  };

  const handleSubmit = (values: FormValues): void => {
    const checkValidity = validateSignUp(values);
    setValidFormData(checkValidity);
    if (Object.values(checkValidity).includes(false)) {
      return;
    }
    // Make backend call here when it's hosted!
    console.log("Make request!")
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Formik initialValues={initialValues} validate={validateSubmission} onSubmit={handleSubmit}>
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
            <Button title="Submit" onPress={handleSubmit} />
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
