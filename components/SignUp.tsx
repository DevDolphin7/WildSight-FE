import {
  ImageBackground,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import BackgroundImage from "../assets/images/home-screen-background.png";
import SignUpForm from "./SignUpForm";

interface MyFormValues {
  firstName: string;
}

export default function SignUp() {
  const initialValues: MyFormValues = { firstName: "" };
  return (
    <ImageBackground
      source={BackgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={(values) => {
          if (Object.values(values).includes("")) {
            return;
          }
          alert(
            `Name: ${values.name}\nEmail: ${values.email}\nPassword: ${values.password}`
          );
        }}
      >
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
            <Button onPress={handleSubmit} title="Submit" />
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
