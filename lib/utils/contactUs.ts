import * as MailComposer from "expo-mail-composer";
import { Alert } from "react-native";

export const contactUs = async (deviceId?: string) => {
  const isAvailable = await MailComposer.isAvailableAsync();

  if (!isAvailable) {
    Alert.alert("Mail not available", "Please configure a mail account.");
    return;
  }

  await MailComposer.composeAsync({
    recipients: ["aggarwalprakhar0@gmail.com"], 
    subject: "Sentio App – User Support",
    body: `
Hello Sentio Team,

Device ID: ${deviceId ?? "Unknown"}

Please describe your issue below:

`,
  });
};