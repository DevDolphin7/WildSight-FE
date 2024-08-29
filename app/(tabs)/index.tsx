import { useState } from "react";
import { ImageBackground, StyleSheet, Modal, Button } from "react-native";
import HomeScreen from "@/components/HomeScreen";
import SignUp from "@/components/SignUp";
import Login from "@/components/Login";
const backgroundImage = require("../../assets/images/home-screen-background.png");

export default function Index() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Modal visible={signUpOpen} animationType="slide">
        <SignUp setSignUpOpen={setSignUpOpen} />
      </Modal>
      <Modal visible={loginOpen} animationType="slide">
        <Login setLoginOpen={setLoginOpen} />
      </Modal>
      <HomeScreen setSignUpOpen={setSignUpOpen} setLoginOpen={setLoginOpen} />
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
});
