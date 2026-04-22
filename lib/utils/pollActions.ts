import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoint } from "@/lib/config/api";

export const reportPoll = async (
  pollId: string,
  creatorDeviceId: string,
  deviceId: string
) => {
  if (creatorDeviceId === deviceId) {
    Toast.show({
      type: "info",
      text1: "You can't report your own poll",
      text2: "This poll was created by you",
    });
    return;
  }

  Alert.alert(
    "Report Poll",
    "Why are you reporting this poll?",
    [
      {
        text: "Inappropriate content",
        onPress: async () => {
          try {
            const response = await fetch(
              apiEndpoint(`/polls/${pollId}/report/`),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  device_id: deviceId,
                  reason: "inappropriate_content",
                }),
              }
            );

            if (response.status === 409) {
              Toast.show({ type: "error", text1: "You already reported this poll" });
              return;
            }
            if (!response.ok) {
              Toast.show({ type: "error", text1: "Failed to report poll" });
              return;
            }
            Toast.show({ type: "success", text1: "Poll reported" });
          } catch {
            Toast.show({
              type: "error",
              text1: "Network error",
              text2: "Please try again later",
            });
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};

export const blockUserAction = async (
  creatorDeviceId: string,
  deviceId: string,
  onBlock: (blockedDeviceId: string) => void
) => {
  if (creatorDeviceId === deviceId) {
    Toast.show({ type: "info", text1: "You can't block yourself" });
    return;
  }

  Alert.alert("Block this user?", "You will no longer see their polls.", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Block",
      style: "destructive",
      onPress: async () => {
        try {
          await fetch(apiEndpoint("/block-user/"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blocker_device_id: deviceId,
              blocked_device_id: creatorDeviceId,
            }),
          });
          Toast.show({ type: "success", text1: "User blocked" });
          onBlock(creatorDeviceId);
        } catch {
          Toast.show({ type: "error", text1: "Failed to block user" });
        }
      },
    },
  ]);
};

export const hidePoll = async (
  pollId: string,
  hiddenPolls: string[],
  setHiddenPolls: (polls: string[]) => void,
  setPolls: (fn: (prev: any[]) => any[]) => void
) => {
  const updated = [...hiddenPolls, pollId];
  await AsyncStorage.setItem("hiddenPolls", JSON.stringify(updated));
  setHiddenPolls(updated);
  setPolls((prev) => prev.filter((poll) => poll.id !== pollId));
};
