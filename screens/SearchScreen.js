import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  SafeAreaView
} from "react-native";
import { searchUsers } from "../store/actions/search";
import { useDispatch, useSelector } from "react-redux";

export const SearchScreen = (props) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const results = useSelector((state) => state.userSearchReducer.results);

  const renderResult = (user) => {
    let picLink = "";
    if (user.item.S3Key === "") {
      picLink = "https://d3cemh7k7c204q.cloudfront.net/general/default.png";
    } else {
      picLink = "https://dbgtjb94040g6.cloudfront.net/" + user.item.S3Key;
    }
    return (
      <TouchableHighlight onPress={() => {
        props.navigation.navigate("OutsideUser", {
            id: user.item.id,
            username: user.item.username
          })
      }}>
        <View style={styles.resultContainer}>
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
      </TouchableHighlight>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%"}}>
      <TextInput
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        onSubmitEditing={(text) => {
          dispatch(searchUsers(searchTerm));
        }}
        style={styles.SearchBar}
        placeholder="Search for user..."
        clearButtonMode={"always"}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderResult}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SearchBar: {
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    height: 40,
    borderRadius: 10
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
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

export default SearchScreen;
