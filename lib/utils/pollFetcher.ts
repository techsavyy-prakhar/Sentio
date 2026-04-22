import { apiEndpoint } from "@/lib/config/api";

export const fetchPolls = async (
  category: string,
  deviceId: string
): Promise<any[] | null> => {
  try {
    let query =
      category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
    if (deviceId) query += `${query ? "&" : "?"}device_id=${deviceId}`;

    const response = await fetch(apiEndpoint(`/polls/${query}`));
    if (!response.ok) {
      console.log("Server error response:", await response.text());
      return null;
    }
    return await response.json();
  } catch (err) {
    console.log("Fetch error:", err);
    return null;
  }
};
