import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./navigation/Navigation";
import configureStore from "./store/store";
import { Provider } from "react-redux";
import Colors from "./customs_components/Colors";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

const store = configureStore;

export default function App() {

  const triggerScheduledNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Watch anything good lately?",
        body: "Don't forget to recommend your favorite shows, movies, podcasts, and books to your friends!"
      },
      trigger: {
        seconds: 60 * 60 * 24,
        repeats: true
      }
    })
  }

  useEffect(() => {
    Notifications.getPermissionsAsync()
      .then((status) => {
        if (!status.granted) {
          return Notifications.requestPermissionsAsync();
        }
        return status
      })
      .then((data) => {
        Notifications.cancelAllScheduledNotificationsAsync().then((cancelData) => {
          triggerScheduledNotification()
        })
      })
      .catch((err) => {
        return null;
      });
  }, []);

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
  },
});
