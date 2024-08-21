import {
  ImageBackground,
  View,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
const backgroundImage = require("../assets/images/home-screen-background.png");

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const initialValues: FormValues = { name: "", email: "", password: "" };

  const handleSubmit = (values: FormValues): void => {
    if (Object.values(values).includes("")) {
      // Find blank fields and highlight to user
      return;
    }
    alert(
      `Name: ${values.name}\nEmail: ${values.email}\nPassword: ${values.password}`
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
            <TextInput
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              placeholder="Name"
              value={values.name}
              style={styles.formEntry}
            />
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="Email"
              value={values.email}
              style={styles.formEntry}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="Password"
              value={values.password}
              style={styles.formEntry}
            />
            <Button title="Submit" onPress={() => handleSubmit} />
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
    borderWidth: 3,
    borderColor: "red",
  },
});
