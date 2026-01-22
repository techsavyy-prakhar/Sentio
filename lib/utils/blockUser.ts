import AsyncStorage from "@react-native-async-storage/async-storage";

export const blockUser = async (creatorDeviceId: string) => {
  const stored = await AsyncStorage.getItem("blockedUsers");
  const blocked = stored ? JSON.parse(stored) : [];

  if (!blocked.includes(creatorDeviceId)) {
    blocked.push(creatorDeviceId);
    await AsyncStorage.setItem("blockedUsers", JSON.stringify(blocked));
  }
};
