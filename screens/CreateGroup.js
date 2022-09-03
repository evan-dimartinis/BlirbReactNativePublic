import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createNewGroup, getUserGroups } from "../store/actions/groups";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../customs_components/Colors";

const CreateGroupModal = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [GroupName, setGroupName] = useState("");
  const [GroupDescription, setGroupDescription] = useState("");
  const imageblob = useSelector(state => state.feedImagesReducer.images[0])

  const createGroup = async () => {
    if (GroupDescription !== "" && GroupName !== "") {
      setGroupDescription(GroupDescription.split(" ").join("%20"));
      setGroupName(GroupName.split(" ").join("%20"));
      let action = createNewGroup(GroupName, GroupDescription);
      try {
        setIsLoading(true);
        await dispatch(action);
        await dispatch(getUserGroups());
        setGroupDescription("")
        setGroupName("")
        props.onCloseCreateGroup();
      } catch (err) {
        Alert.alert("Something went wrong", "try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Please input a group name and description", "", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const uploadNewProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let blob = await createImageBlob(result.uri);
      const file = new File([blob], "New Profile Picture");
      try {
        setIsLoading(true);
        await dispatch(changeProfilePicture(file));
      } catch (error) {
        Alert.alert(
          "Could not update profile picture",
          "Please try again later",
          [
            {
              text: "Ok",
              onPress: () => {},
            },
          ]
        );
      } finally {
        await dispatch(getUserInfo());
        setIsLoading(false);
      }
    }
  };

  const createImageBlob = async (uri) => {
    let response = await fetch(uri);
    let blob = await response.blob();
    return blob;
  };

  if (isLoading) {
    return (
      <Modal visible={props.visible} animationType="slide">
        <ActivityIndicator size="large" />
      </Modal>
    );
  } else {
    return (
      <Modal visible={props.visible} animationType="slide">
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: Colors.primary
          }}
        >
            <TextInput
              style={{
                borderColor: "black",
                borderRadius: 20,
                borderBottomWidth: 2,
                width: 200,
                padding: 10,
                margin: 10,
                color: "white"
              }}
              value={GroupName}
              placeholder="Group Name..."
              onChangeText={(text) => setGroupName(text)}
              placeholderTextColor="white"
            />
            <TextInput
              value={GroupDescription}
              style={{
                borderColor: "black",
                borderRadius: 20,
                borderBottomWidth: 2,
                width: 200,
                padding: 10,
                margin: 10,
                color: "white"
              }}
              onChangeText={(text) => setGroupDescription(text)}
              placeholder="Group Description..."
              placeholderTextColor="white"
            />
            <Button title="Create Group" onPress={createGroup} color="white" />
            <Button title="Cancel" onPress={() => props.onCloseCreateGroup()} color="white" />
            <Image source={{uri: imageblob}} style={{ height: 200, width: 200, resizeMode: "contain" }} />
        </SafeAreaView>
      </Modal>
    );
  }
};

export default CreateGroupModal;
