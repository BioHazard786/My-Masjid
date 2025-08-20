import useExpoPushTokenStore from "@mobile/store/expo-push-token-store";
import { useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

type NotificationData = {
  id: string;
  nameEn: string;
  nameHi: string;
  nameUr: string;
  addressEn: string;
  addressHi: string;
  addressUr: string;
  fajr: string | null;
  dhuhr: string | null;
  asr: string | null;
  maghrib: string | null;
  isha: string | null;
  jummah: string | null;
};

export function useNotifications() {
  const setExpoPushToken = useExpoPushTokenStore.use.setExpoPushToken();
  const queryClient = useQueryClient();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        handleNotificationReceived(notification, queryClient);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse(response, queryClient);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return alert("Failed to get push token for push notification");
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      return alert("Project ID not found");
    }
    try {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      return token;
    } catch (error) {
      console.log(error);
      alert("Failed to get push token for push notification");
    }
  } else {
    alert("Must be using a physical device for Push notifications");
  }
}

const handleNotificationReceived = (
  notification: Notifications.Notification,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  const data = notification.request.content.data as NotificationData;

  // Check if this is a prayer times update notification
  if (data) {
    // Update the cached masjid data with new prayer times
    queryClient.setQueryData(["persist", "masjid", data.id], {
      success: true,
      data,
    });
  }
};

const handleNotificationResponse = (
  response: Notifications.NotificationResponse,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  const data = response.notification.request.content.data as NotificationData;
  // Handle notification tap - you can navigate to specific screens here
  if (data) {
    // Safety check: ensure queryClient is properly initialized
    if (queryClient && typeof queryClient.invalidateQueries === "function") {
      queryClient.setQueryData(["persist", "masjid", data.id], {
        success: true,
        data,
      });
    }

    // You can use router to navigate to the masjid page
    // router.push(`/masjid/${data.id}`);
  }
};
