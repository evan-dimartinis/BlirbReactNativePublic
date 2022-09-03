import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Button,
  Modal,
  Image,
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Clipboard,
} from "react-native";
import Colors from "../customs_components/Colors";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGroupDetails,
  getUserGroups,
  uploadGroupPicture,
  removeMemberFromGroup,
} from "../store/actions/groups";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const GroupSettingsModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPictureData, setNewPictureData] = useState(null);
  const dispatch = useDispatch();

  const [groupDesc, setGroupDesc] = useState("");
  const [groupName, setGroupName] = useState("");
  const [newPictureChosen, setNewPictureChosen] = useState(false);
  const [newPictureFile, setNewPictureFile] = useState(null);

  const copyGroupJoinCodeToClipboard = () => {
    Clipboard.setString(props.group.groupJoinCode);
  };

  const renderGroupMember = (member) => {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 5,
          width: 350,
          height: 50,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text ellipsizeMode="tail" numberOfLines={1} style={{color: "white", fontSize: 20, maxWidth: 200}} onPress={() => props.goToProfile()}>
          {member.item.first_name} {member.item.last_name}
        </Text>
        <Button
        title={"Remove"}
          onPress={() => {
            Alert.alert("Are you sure you want to remove " + member.item.first_name + " " + member.item.last_name + " from the group?", "", [
              {
                text: "Yes",
                onPress: () => removeGroupMember(member.item.id)
              },
              {
                text: "No",
                onPress: () => {}
              }
            ])
          }}
        />
      </View>
    );
  };

  const changeGroupPic = async (file) => {
    if (newPictureFile != null) {
      try {
        await dispatch(uploadGroupPicture(props.group.groupID, file));
      } catch (error) {
        throw new Error("error uploading picture");
      }
    }
  };

  const removeGroupMember = async (userID) => {
    try {
      setIsLoading(true);
      await dispatch(removeMemberFromGroup(props.group.groupID, userID));
      await dispatch(getUserGroups());
      props.onCloseGroupSettings();
      setIsLoading(false);
    } catch (err) {
      Alert.alert(
        "Could not remove member from group",
        "Please try again later",
        [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let imageBlob = await createImageBlob(result.uri);
      let x = new File([imageBlob], "new Group Picture");
      //let fileReader = new FileReader();
      //fileReader.readAsDataURL(imageBlob);
      setNewPictureData(result.uri);
      setNewPictureChosen(true);
      setNewPictureFile(x);
    }
  };

  const createImageBlob = async (uri) => {
    try {
      let response = await fetch(uri);
      let blob = await response.blob();
      return blob;
    } catch (err) {}
  };

  const submitGroupChanges = async () => {
    if (groupDesc === "") {
      setGroupDesc(props.group.groupDesc);
    }
    if (groupName === "") {
      setGroupName(props.group.groupName);
    }
    let action = updateGroupDetails(groupName, groupDesc, props.group.groupID);
    try {
      setIsLoading(true);
      await dispatch(action);
      await changeGroupPic(newPictureFile);
      await dispatch(getUserGroups());
      setNewPictureChosen(false);
      setNewPictureData(null)
      setNewPictureFile(null)
      setIsLoading(false);
      props.onCloseGroupSettings();
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Something went wrong", "Please try again later", [
        {
          text: "Okay",
        },
      ]);
    } finally {
      setGroupName("")
      setGroupDesc("")
    }
  };

  if (props.group == null) {
    return (
      <Modal visible={props.visible} animationType="fade">
        <SafeAreaView></SafeAreaView>
      </Modal>
    );
  } else if (isLoading) {
    return (
      <Modal visible={props.visible} animationType="fade">
        <ActivityIndicator
          size="large"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      </Modal>
    );
  } else {
    let imageURI = "https://d3cemh7k7c204q.cloudfront.net/general/default.png";
    if (newPictureChosen) {
      imageURI = newPictureData;
    } else {
      imageURI =
        "https://dbgtjb94040g6.cloudfront.net/" + props.group.groupS3Key;
    }

    return (
      <Modal visible={props.visible} animationType="fade">
        <SafeAreaView
          style={{
            backgroundColor: Colors.primary,
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Ionicons
            size={30}
            name="close"
            style={{ alignSelf: "flex-end" }}
            onPress={() => props.onCloseGroupSettings()}
          />
          <Image
            source={{ uri: imageURI }}
            resizeMode="contain"
            style={{
              height: 200,
              width: 300,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          />
          <Button title="Pick Image" onPress={pickImage} />
          <TextInput
            style={{
              borderColor: "black",
              borderRadius: 20,
              borderBottomWidth: 2,
              width: 200,
              padding: 10,
              margin: 10,
              color: "white",
            }}
            placeholder={props.group.groupName}
            placeholderTextColor="white"
            onChangeText={(text) => {
              setGroupName(text);
            }}
          />
          <TextInput
            style={{
              borderColor: "black",
              borderRadius: 20,
              borderBottomWidth: 2,
              width: 200,
              padding: 10,
              margin: 10,
              color: "white",
            }}
            placeholderTextColor="white"
            placeholder={props.group.groupDesc}
            onChangeText={(text) => {
              setGroupDesc(text);
            }}
          />
          <FlatList
            data={props.group.groupMembers}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderGroupMember}
            style={{ marginTop: 10}}
          />
          <View style={{ height: "6%", marginVertical: 7, backgroundColor: Colors.secondary, justifyContent: "center", alignItems: "center", borderRadius: 10, width: "70%" }}>
            <Button title={"Leave Group"} color="red" />
          </View>
          <View style={{ height: "6%", marginVertical: 7, backgroundColor: Colors.secondary, justifyContent: "center", alignItems: "center", borderRadius: 10, width: "70%" }}>
            <Button
              title="Copy Group Join Code"
              onPress={copyGroupJoinCodeToClipboard}
              color="white"
            />
          </View>
          
          <View style={{ height: "6%", marginVertical: 7, backgroundColor: Colors.secondary, justifyContent: "center", alignItems: "center", borderRadius: 10, width: "70%" }}>
            <Button title="Save and Close" onPress={submitGroupChanges} color="white" />
          </View>
          
        </SafeAreaView>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderColor: Colors.secondary,
    borderWidth: 2,
    margin: 20,
    width: 300,
  },
});

export default GroupSettingsModal;
