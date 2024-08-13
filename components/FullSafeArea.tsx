import React, { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export default function FullSafeAreaView({ children }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.container}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
