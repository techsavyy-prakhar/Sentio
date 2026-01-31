import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerDeviceForPush() {

  if (!Device.isDevice) {

    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();


  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }


  if (finalStatus !== "granted") {
    return null;
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync();
  const expoPushToken = tokenResponse.data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return {
    expoPushToken,
    platform: Platform.OS,
  };
}
