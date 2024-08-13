import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  image: any;
  text: string;
  onClicked: () => void;
  price: number;
}

export default function MenuBox({ image, text, onClicked, price }: Props) {
  return (
    <TouchableOpacity style={styles.box} onPress={onClicked}>
      <Image style={styles.image} source={image} />
      <Text style={styles.boxText}>{text}</Text>
      <Text style={styles.boxText}>{price}원</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 56, // Adjust based on your needs
    height: 56, // Adjust based on your needs
    marginBottom: 4,
  },
  boxText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
