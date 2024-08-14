import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKey } from "../../constants/constants";
import axios, { HttpStatusCode } from "axios";

const OnBoardingScreen = () => {
  const [ipAddress, setIPAddress] = useState<string>("192.168.0.1:8080");
  const [loading, setLoading] = useState<boolean>(false);

  const onLoginPressed = () => {
    setLoading(true);
    (async () => {
      // DEBUG
      // await AsyncStorage.setItem(AsyncStorageKey.IPAddress, ipAddress);
      // await AsyncStorage.setItem(AsyncStorageKey.credit, "10000");
      // router.replace("/Home");
      ////////

      try {
        const response = await axios.get(ipAddress + "/busy");
        if (response.status === HttpStatusCode.Ok) {
          if (response.data == "OK") {
            AsyncStorage.setItem(AsyncStorageKey.IPAddress, ipAddress);
            AsyncStorage.setItem(AsyncStorageKey.credit, "10000");
            router.replace("/Home");
          }

          if (response.data == "Busy") {
            ToastAndroid.show("바텐더가 바쁩니다.", ToastAndroid.BOTTOM);
          }
        }
      } catch (ex) {
        ToastAndroid.show("바텐더에 연결 할 수 없습니다", ToastAndroid.BOTTOM);
        console.error(ex);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/icons/logo.png")} style={styles.icon} />
      <Text style={styles.mainText}>바텐더</Text>
      <Text style={styles.subText}>Give me a drink bartender</Text>
      <Text style={styles.description}>
        시작하려면 바텐더의 IP 를 입력하십시오.
      </Text>
      <View style={{ width: "70%" }}>
        <TextInput
          style={styles.input}
          placeholder="http://192.168.0.1:8080"
          placeholderTextColor="#ccc"
          onChangeText={(text) => setIPAddress(text)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={onLoginPressed}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  icon: {
    width: 72, // adjust this size as necessary
    height: 72, // adjust this size as necessary
    marginBottom: 20,
  },
  mainText: {
    fontSize: 24,
    color: "#FFA500",
    marginBottom: 4,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#f39c12",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  loginText: {
    color: "#333",
    fontSize: 14,
  },
  loginLink: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#f6f6f6",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OnBoardingScreen;
