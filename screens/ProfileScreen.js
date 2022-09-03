import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  ImageBackground,
  Alert,
  AsyncStorage,
} from "react-native";
import { getUserListsByID, getUserInfo } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../customs_components/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../customs_components/HeaderButtons";
import { log_out } from "../store/auth/authActions";
import * as ImagePicker from "expo-image-picker";
import { changeProfilePicture } from "../store/actions/profile";
import { Ionicons } from "@expo/vector-icons";
import AddListModal from "./addListModal";
import { removeFromList } from "../store/actions/lists";

const ProfileScreen = (props) => {
  let dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userReducer);
  const [listTitles, setListTitles] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [addingList, setAddingList] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      setIsLoading(true);
      await dispatch(getUserInfo());
      setIsLoading(false);
    };
    getInfo();
  }, [dispatch]);

  const logout = async () => {
    Alert.alert("Are you sure you want to log out?", null, [
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.clear();
          dispatch(log_out());
          props.navigation.navigate("Auth");
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
  };

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

  const renderListTitle = (list) => {
    return (
      <View
        style={{
          backgroundColor:
            list.index == selectedListIndex ? Colors.secondary : "white",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
        }}
      >
        <Text
          onPress={() => setSelectedListIndex(list.index)}
          adjustsFontSizeToFit={true}
          style={{ margin: 5 }}
        >
          {list.item.nameOfRankings}
        </Text>
      </View>
    );
  };

  const renderListItem = (listItem) => {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 150,
          marginVertical: 10,
        }}
      >
        {/* <Ionicons size={20} name="trash-bin-outline" onPress={() => {
          
          //dispatch(removeFromList(listItem.item.rankingItemID))
        }} /> */}
        <Image
          source={{ uri: listItem.item.imageURL }}
          style={{
            resizeMode: "contain",
            height: 140,
            width: 100,
            paddingRight: 5,
          }}
        />

        <View style={{ width: "70%", paddingLeft: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              ellipsizeMode={"tail"}
              numberOfLines={2}
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              {listItem.item.title}
            </Text>
            <Ionicons
              size={20}
              name={"trash-bin-outline"}
              color={"red"}
              onPress={async () => {
                setIsLoading(true);
                try {
                  await dispatch(removeFromList(listItem.item.Id));
                  await dispatch(getUserInfo());
                } catch (err) {
                  Alert.alert(
                    "Could not remove item from list",
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
              }}
            />
          </View>

          <Text ellipsizeMode={"tail"} numberOfLines={5}>
            {listItem.item.description}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      />
    );
  } else if (userInfo.lists instanceof Array && userInfo.lists.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <AddListModal visible={addingList} close={() => setAddingList(false)} />
        <View
          style={{
            height: "30%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={{ position: "absolute", left: 5, top: 5 }}>
            <Button title="logout" onPress={logout} color={Colors.primary} />
          </View>

          <Ionicons
            name={"add"}
            size={35}
            style={{ position: "absolute", right: 5, top: 5 }}
            onPress={() => setAddingList(true)}
          />

          <Text style={{ fontSize: 30, color: Colors.primary }}>
            {userInfo.first_name} {userInfo.last_name}
          </Text>
          <Text style={{ fontSize: 20, color: Colors.primary }}>
            {userInfo.username}
          </Text>
          <TouchableHighlight
            onPress={() => {
              uploadNewProfilePicture();
            }}
            style={{ paddingTop: "3%", height: "100%" }}
          >
            <ImageBackground
              source={{ uri: userInfo.S3Key }}
              style={styles.profilePicture}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "rgb(0,0,50)",
                  }}
                >
                  Change Profile Picture
                </Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </View>
        <View style={{ alignItems: "center", height: "60%" }}>
          <FlatList
            data={userInfo.lists}
            keyExtractor={(item, index) => Math.random().toString()}
            renderItem={renderListTitle}
            horizontal={true}
            style={{ height: "10%" }}
          />

          <FlatList
            data={userInfo.lists[selectedListIndex].items}
            keyExtractor={(item, index) => Math.random().toString()}
            renderItem={renderListItem}
            style={{ height: "90%", borderColor: "white", borderWidth: 1 }}
            scrollEnabled={true}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <AddListModal visible={addingList} close={() => setAddingList(false)} />
        <View style={{ height: "40%", alignItems: "center" }}>
          <Button title="logout" onPress={logout} />
          <Ionicons
            name={"add"}
            size={35}
            style={{ position: "absolute", right: 5, top: 5 }}
            onPress={() => setAddingList(true)}
          />
          <Text style={{ fontSize: 30 }}>
            {userInfo.first_name} {userInfo.last_name}
          </Text>
          <Text style={{ fontSize: 20 }}>{userInfo.username}</Text>
          <Image
            source={{ uri: userInfo.S3Key }}
            style={styles.profilePicture}
          />
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  profilePicture: {
    resizeMode: "contain",
    height: "100%",
    width: 300,
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
});

ProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Profile",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Log Out"
          onPress={() => {
            navData.navigation.navigate("Auth");
          }}
        ></Item>
      </HeaderButtons>
    ),
  };
};

export default ProfileScreen;
