import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (otp !== "1234") return alert("Invalid OTP");

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ phone })
    );

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Sent to +91 {phone}</Text>

      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.btnText}>Verify</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Use OTP: 1234</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { marginBottom: 20, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  hint: {
    marginTop: 15,
    textAlign: "center",
    color: "gray",
  },
});