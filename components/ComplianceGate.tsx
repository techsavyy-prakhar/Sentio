import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import Toast from "react-native-toast-message";

type Props = {
  onAccepted: () => void;
};

export default function ComplianceGate({ onAccepted }: Props) {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canContinue = ageConfirmed && termsAccepted;

  const handleAccept = async () => {
    await AsyncStorage.setItem("age_confirmed", "true");
    await AsyncStorage.setItem("terms_accepted", "true");
    onAccepted();
  };

  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        "Age Restriction",
        "You must be 18 or older to use this app. Please close the app to exit.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Age Requirement</Text>
      <Text style={styles.text}>
        Sentio is intended for users who are 18 years of age or older.
      </Text>

      <View style={styles.checkboxRow}>
        <Checkbox
          value={ageConfirmed}
          onValueChange={setAgeConfirmed}
          color={ageConfirmed ? "#ddac5f" : undefined}
        />
        <Text style={styles.checkboxText}>
          I confirm that I am 18 years or older
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Terms & Community Guidelines</Text>

      <Text style={styles.text}>
        By using Sentio, you agree to follow our community standards and
        participate respectfully.
      </Text>

      <Text style={styles.policyText}>
        “We have zero tolerance for abusive, hateful, or objectionable content.
        Users violating these rules will be permanently removed.”
      </Text>

      <View style={styles.checkboxRow}>
        <Checkbox
          value={termsAccepted}
          onValueChange={setTermsAccepted}
          color={termsAccepted ? "#ddac5f" : undefined}
        />
        <Text style={styles.checkboxText}>
          I agree to the Terms & Privacy Policy
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !canContinue && styles.disabled]}
        disabled={!canContinue}
        onPress={handleAccept}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleExit}>
        <Text style={styles.exitText}>Exit App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#2e3c3c",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#ccc",
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
    marginVertical: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxText: {
    color: "#fff",
    marginLeft: 8,
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#ddac5f",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  disabled: {
    opacity: 0.4,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  exitText: {
    color: "#ff5555",
    textAlign: "center",
    marginTop: 16,
  },
});
