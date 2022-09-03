import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableHighlight,
  Image,
  Text,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, clearSearchResults } from "../store/actions/search";
import { addUserToGroup, getUserGroups } from "../store/actions/groups";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../customs_components/Colors";

export const AddUserToGroupModal = (props) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const results = useSelector((state) => state.userSearchReducer.results);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const addUser = async (userID) => {
    let groupID = props.groupID;
    try {
      setIsAddingMember(true);
      await dispatch(addUserToGroup(groupID, userID));
      await dispatch(getUserGroups());
      Alert.alert("User successfully added to group", "", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
      setIsAddingMember(false);
    } catch (err) {
      Alert.alert("Couldn't add user to group", "Please try again later", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    }
  };

  const renderResult = (user) => {
    let picLink = "";
    if (user.item.S3Key === "") {
      picLink = "https://d3cemh7k7c204q.cloudfront.net/general/default.png";
    } else {
      picLink = "https://dbgtjb94040g6.cloudfront.net/" + user.item.S3Key;
    }
    return (
      <View style={styles.resultContainer}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: picLink,
            }}
            style={styles.profilePicture}
          />
          <View>
            <Text>
              {user.item.first_name} {user.item.last_name}
            </Text>
            <Text>{user.item.username}</Text>
          </View>
        </View>
        <Button
          title={"Add"}
          color="green"
          onPress={() => {
            addUser(user.item.id);
          }}
        />
      </View>
    );
  };

  if (isAddingMember) {
    return (
      <Modal visible={props.visible} animationType="slide">
        <ActivityIndicator
          size="large"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      </Modal>
    );
  } else {
    return (
      <Modal visible={props.visible} animationType="slide">
        <SafeAreaView style={{ backgroundColor: Colors.primary, flex: 1 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "flex-end" }}
          >
            <Ionicons
              name="close"
              size={20}
              color="black"
              onPress={() => {
                dispatch(clearSearchResults())
                props.onCloseAddMember()

              }
              }
              style={{ alignSelf: "flex-end", justifyContent: "flex-end"}}
            />
          </View>
          <TextInput
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={(text) => {
              dispatch(searchUsers(searchTerm));
            }}
            style={styles.SearchBar}
            placeholder="Search for user..."
          />
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderResult}
          />
        </SafeAreaView>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  SearchBar: {
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    height: 40,
    borderRadius: 10,
    color: "white",
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  profilePicture: {
    resizeMode: "contain",
    marginLeft: 20,
    marginRight: 10,
    height: 50,
    width: 50,
  },
});

export default AddUserToGroupModal;
