import { useRef, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
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
            source={require("@/assets/images/wildsightLogo.png")}
            style={styles.wildsightlogo}
          />
          {loggedIn ? (
            <>
              <Text>Welcome {loggedIn.username}!</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setLoggedIn(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>Log out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setSignUpOpen(true);
                }}
              >
                <Text style={styles.actionButtonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setLoginOpen(true);
                }}
              >
                <Text style={styles.actionButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              ref.current?.setPage(1);
            }}
          >
            <Text style={styles.buttonText}>Get Started {"->"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.background} key="2">
        <View style={styles.page}>
          <HealthAndSafetyText />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              ref.current?.setPage(2);
            }}
          >
            <Text style={styles.buttonText}>{"<- Page 2 ->"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.background} key="3">
        <View style={styles.page}>
          <Instructions />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              ref.current?.setPage(0);
            }}
          >
            <Text style={styles.buttonText}>{"<- Go Back"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  wildsightlogo: {
    height: 200,
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
  secondaryButton: {
    backgroundColor: "#A5CCC0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "transparent",
    elevation: 0,
    marginVertical: 5,
  },
  secondaryButtonText: {
    color: "#215140",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#A5CCC0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#215140",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
