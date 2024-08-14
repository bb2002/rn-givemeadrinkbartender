import {
  Image,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import FullSafeAreaView from "../../components/FullSafeArea";
import MenuBox from "../../components/MenuBox";
import { Recipe, Recipes } from "@/constants/recipes";
import axios, { HttpStatusCode } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKey, fetcher } from "@/constants/constants";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import useSWR from "swr";
import { Audio } from "expo-av";

export default function Home() {
  const [workBartender, setWorkBartendar] = useState(false);
  const [ipAddress, setIPAddress] = useState<string | null>(null);
  const [bartenderSound, setBartenderSound] = useState<Audio.Sound | null>(
    null
  );

  const { data, error, isLoading } = useSWR(ipAddress + "/busy", fetcher, {
    refreshInterval: 1000,
  });

  const onMenuSelected = (recipe: Recipe, price: number) => {
    if (!ipAddress) {
      return;
    }

    setWorkBartendar(true);
    bartenderSound?.replayAsync().then();
    (async () => {
      try {
        const response = await axios.get(ipAddress + "/bartender", {
          params: {
            ...recipe,
          },
          timeout: 50000,
        });

        if (response.status === HttpStatusCode.Ok) {
          const credit = parseInt(
            (await AsyncStorage.getItem(AsyncStorageKey.credit)) || "0"
          );
          await AsyncStorage.setItem(
            AsyncStorageKey.credit,
            `${credit - price}`
          );
          router.replace("/Home");
        } else {
          ToastAndroid.show(
            "바텐더가 잘못된 데이터를 응답했습니다.",
            ToastAndroid.BOTTOM
          );
        }
      } catch (ex: any) {
        ToastAndroid.show(
          "바텐더에게 요청 할 수 없습니다.",
          ToastAndroid.BOTTOM
        );
        console.error(ex);
      } finally {
        setWorkBartendar(false);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const addr = await AsyncStorage.getItem(AsyncStorageKey.IPAddress);
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sound/bartender.mp3")
      );
      setBartenderSound(sound);
      setIPAddress(addr);
    })();
  }, []);

  useEffect(() => {
    if (data && data == "OK") {
      setWorkBartendar(false);
    }

    if (data && data == "Busy") {
      setWorkBartendar(true);
    }
  }, [data, isLoading, error]);

  return (
    <FullSafeAreaView>
      <View style={styles.dropdownWrapper}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={workBartender}
          // visible={false}
          onRequestClose={() => {}}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image
                style={styles.memeImage}
                source={require("@/assets/memes/bartender.gif")}
              />
              <Text style={styles.modalText}>
                바텐더가 음료를 제조중입니다.
              </Text>
              <Text style={styles.modalText}>잠시만 기다려주세요.</Text>
            </View>
          </View>
        </Modal>
        <Text style={styles.heading}>Give me a drink bartender :)</Text>
        <Text style={styles.subheading}>대상 서버: {ipAddress}</Text>
        <View style={styles.grid}>
          <View style={styles.row}>
            <MenuBox
              image={require("@/assets/icons/fuzzy_navel.png")}
              text="퍼지네이블"
              onClicked={() => onMenuSelected(Recipes.fuzzyNavel, 2800)}
              price={2800}
            />
            <MenuBox
              image={require("@/assets/icons/hairy_navel.png")}
              text="헤어리네이블"
              onClicked={() => onMenuSelected(Recipes.hairyNavel, 3000)}
              price={3000}
            />
            <MenuBox
              image={require("@/assets/icons/woowoo.png")}
              text="우우"
              onClicked={() => onMenuSelected(Recipes.woowoo, 3400)}
              price={3400}
            />
          </View>
          <View style={styles.row}>
            <MenuBox
              image={require("@/assets/icons/sex_on_the_beach.png")}
              text="쓰껄온더비치"
              onClicked={() => onMenuSelected(Recipes.sexOnTheBeach, 3600)}
              price={3600}
            />
            <MenuBox
              image={require("@/assets/icons/peach_crush.png")}
              text="피치크러시"
              onClicked={() => onMenuSelected(Recipes.peachCrush, 3800)}
              price={3800}
            />
            <MenuBox
              image={require("@/assets/icons/vodka_sunrise.png")}
              text="보드카선라이즈"
              onClicked={() => onMenuSelected(Recipes.vodkaSunrise, 4000)}
              price={4000}
            />
          </View>
          <View style={styles.row}>
            <MenuBox
              image={require("@/assets/icons/peach_pleasure.png")}
              text="피치 플레져"
              onClicked={() => onMenuSelected(Recipes.peachPleasure, 4200)}
              price={4200}
            />
            <MenuBox
              image={require("@/assets/icons/peach_cranburst.png")}
              text="피치크랜버스트"
              onClicked={() => onMenuSelected(Recipes.peachCranburst, 4400)}
              price={4400}
            />
            <MenuBox
              image={require("@/assets/icons/cranberry_puccini.png")}
              text="크랜베리푸치니"
              onClicked={() => onMenuSelected(Recipes.cranberryPuccini, 4600)}
              price={4600}
            />
          </View>
        </View>
      </View>

      <View style={styles.dropdownWrapper}>
        <Text style={styles.heading}>Custom Bartender :)</Text>
        <View style={styles.grid}>
          <View style={styles.row}>
            <MenuBox
              image={require("@/assets/icons/custom.png")}
              text="내맘대로칵테일"
              onClicked={() => {
                router.push("/Custom");
              }}
              price={5000}
            />
          </View>
        </View>
      </View>

      <Text style={styles.copyright}>
        Copyright (c) 2015-2022 Ballbot, Team Elegance All rights reserved.
      </Text>
    </FullSafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  dropdownWrapper: {
    display: "flex",
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    margin: 4,
  },
  copyright: {
    marginLeft: 24,
    marginRight: 24,
    fontSize: 12,
    color: "#bdc3c7",
    marginBottom: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  memeImage: {
    width: "100%",
    height: 150,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
