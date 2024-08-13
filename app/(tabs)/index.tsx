import { Text } from "react-native";
import OnBoarding from "./OnBoarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { AsyncStorageKey } from "../../constants/constants";
import { router } from "expo-router";

export default function App() {
  useEffect(() => {
    (async () => {
      const ipAddress = await AsyncStorage.getItem(AsyncStorageKey.IPAddress);
      await AsyncStorage.setItem(AsyncStorageKey.credit, "10000");
      console.log("Target IPAddress", ipAddress);
      if (ipAddress != null) {
        router.replace("/Home");
      } else {
        router.replace("/OnBoarding");
      }
    })();
  }, []);

  return <></>;
}
