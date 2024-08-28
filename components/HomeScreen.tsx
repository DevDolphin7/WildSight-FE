import { useRef, useContext } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import HealthAndSafetyText from "./HealthAndSafetyText";
import Instructions from "./Instructions";
import { LoggedInContext } from "@/contexts/LoggedIn";

type Props = {
  setSignUpOpen(params: boolean): void;
  setLoginOpen(params: boolean): void;
};

export default function HomeScreen(props: Props) {
  const { setSignUpOpen, setLoginOpen } = props;
  const ref = useRef<PagerView>(null);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);

  return (
    <PagerView style={styles.background} initialPage={0} ref={ref}>
      <View style={styles.background} key="1">
        <View style={styles.page}>
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
          {loggedIn ? (
            <>
              <Text>Welcome {loggedIn.username}!</Text>
              <Button
                title="Log out"
                onPress={() => {
                  setLoggedIn(null);
                }}
              />
            </>
          ) : (
            <>
              <Button
                title="Sign Up"
                onPress={() => {
                  setSignUpOpen(true);
                }}
              />
              <Button
                title="Login"
                onPress={() => {
                  setLoginOpen(true);
                }}
              />
            </>
          )}
          <Button
            title="Get Started ->"
            onPress={() => {
              ref.current?.setPage(1);
            }}
          />
        </View>
      </View>
      <View style={styles.background} key="2">
        <View style={styles.page}>
          <HealthAndSafetyText />
          <Button
            title="<- Page 2 ->"
            onPress={() => {
              ref.current?.setPage(2);
            }}
          />
        </View>
      </View>
      <View style={styles.background} key="3">
        <View style={styles.page}>
          <Instructions />
          <Button
            title="<- Go Back->"
            onPress={() => {
              ref.current?.setPage(0);
            }}
          />
        </View>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    width: "90%",
    height: "60%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#21514080",
    backgroundColor: "#ffd5bd80",
  },
});
