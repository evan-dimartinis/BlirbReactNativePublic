import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { createList, getUserLists } from "../store/actions/lists";
import { getUserInfo } from "../store/actions/user";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../customs_components/Colors";

const AddListModal = (props) => {
  const dispatch = useDispatch();

  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const create_list = async () => {
    if (listName === "") {
      Alert.alert("Please enter a name for your new list", "", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    } else {
      try {
        setIsLoading(true);
        await dispatch(createList(listName));
        await dispatch(getUserInfo());
        await dispatch(getUserLists());
        props.close();
      } catch (err) {
        Alert.alert("Cannot create list", "Please try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Modal animationType="slide" visible={props.visible}>
        <ActivityIndicator
          size="large"
          style={{ alignSelf: "center" }}
          color={Colors.primary}
        />
      </Modal>
    );
  }
  return (
    <Modal animationType="slide" visible={props.visible}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: Colors.primary,
        }}
      >
        <TextInput
          placeholder="List name..."
          placeholderTextColor="white"
          onChangeText={(text) => {
            setListName(text);
          }}
          style={{
            borderColor: "black",
            borderRadius: 20,
            borderBottomWidth: 2,
            width: 200,
            padding: 10,
            margin: 10,
            color: "white",
          }}
        />
        <Button title="Create List" onPress={create_list} />
        <Button title="Cancel" onPress={props.close} />
      </SafeAreaView>
    </Modal>
  );
};

export default AddListModal;
