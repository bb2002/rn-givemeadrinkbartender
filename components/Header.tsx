import { AsyncStorageKey } from "@/constants/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const onLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/OnBoarding");
  };

  const [credit, setCredit] = useState(0);

  useEffect(() => {
    (async () => {
      const currentCredit = await AsyncStorage.getItem(AsyncStorageKey.credit);
      if (currentCredit && !Number.isNaN(parseInt(currentCredit))) {
        setCredit(parseInt(currentCredit));
      }
    })();
  }, []);

  return (
    <View style={styles.header}>
      <Image source={require("@/assets/icons/logo.png")} style={styles.icon} />
      <View style={styles.headerIcons}>
        <Image
          source={require("@/assets/icons/coin.png")}
          style={styles.coin}
        />
        <Text style={{ marginRight: 24, marginLeft: 4, fontSize: 16 }}>
          {credit}
        </Text>

        <AntDesign
          name="logout"
          size={24}
          color="#000"
          style={styles.icon}
          onPress={onLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    marginRight: -16,
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
    width: 32,
    height: 32,
  },
  coin: {
    width: 24,
    height: 24,
  },
});
