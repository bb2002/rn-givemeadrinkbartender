import FullSafeAreaView from "@/components/FullSafeArea";
import { AsyncStorageKey } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { HttpStatusCode } from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  ToastAndroid,
} from "react-native";

interface Values {
  peachSchnapps: number;
  vodka: number;
  sweetAndSourMix: number;
  orangeJuice: number;
  cranberryJuice: number;
}

export default function CustonPage() {
  const [values, setValues] = useState<Values>({
    peachSchnapps: 0,
    vodka: 0,
    sweetAndSourMix: 0,
    orangeJuice: 0,
    cranberryJuice: 0,
  });
  const [total, setTotal] = useState<number>(0);

  const handleChange = (name: keyof Values, value: string) => {
    const updatedValues = { ...values, [name]: parseInt(value) || 0 };
    setValues(updatedValues);

    setTotal(
      updatedValues.cranberryJuice +
        updatedValues.orangeJuice +
        updatedValues.peachSchnapps +
        updatedValues.sweetAndSourMix +
        updatedValues.vodka
    );
  };

  const onMenuSelected = () => {
    (async () => {
      try {
        const addr = await AsyncStorage.getItem(AsyncStorageKey.IPAddress);
        const response = await axios.get(addr + "/bartender", {
          params: {
            ...values,
          },
          timeout: 5000,
        });

        if (response.status !== HttpStatusCode.Ok) {
          ToastAndroid.show(
            "바텐더가 잘못된 데이터를 응답했습니다.",
            ToastAndroid.BOTTOM
          );
        } else {
          ToastAndroid.show("바텐더에게 요청했습니다.", ToastAndroid.BOTTOM);
          router.back();
        }
      } catch (ex) {
        ToastAndroid.show(
          "바텐더에게 요청 할 수 없습니다.",
          ToastAndroid.BOTTOM
        );
        console.error(ex);
      }
    })();
  };

  return (
    <FullSafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>비율 직접 설정</Text>
        <Text style={styles.subheading}>
          원하는 레시피를 직접 구현해보세요.
        </Text>
        <View style={styles.inputsContainer}>
          {[
            { key: "peachSchnapps", label: "피치트리" },
            { key: "vodka", label: "보드카" },
            { key: "sweetAndSourMix", label: "스윗 앤 샤워 믹스" },
            { key: "orangeJuice", label: "오렌지 주스" },
            { key: "cranberryJuice", label: "크랜베리 주스" },
          ].map((item, index) => (
            <View key={index} style={styles.inputWrapper}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`${item.label}의 비율`}
                onChangeText={(value) =>
                  handleChange(item.key as keyof Values, value)
                }
                value={values[item.key as keyof Values] as any}
              />
            </View>
          ))}
        </View>
        <Text style={styles.totalText}>현재비율: {total}</Text>
        <Button
          title="바텐더에게 요청"
          onPress={onMenuSelected}
          disabled={total !== 100}
          color="#FFA500"
        />
      </ScrollView>
    </FullSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  totalText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
});
