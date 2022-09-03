import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { getUserListsByID } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../customs_components/Colors";
import { Ionicons } from '@expo/vector-icons';

const OutsideUserScreen = (props) => {
  let dispatch = useDispatch();

  const userID = props.navigation.getParam("id");
  const username = props.navigation.getParam("username");
  const userInfo = useSelector((state) => state.outsideUserReducer);
  const [listTitles, setListTitles] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getInfo = async () => {
      setIsLoading(true)
      await dispatch(getUserListsByID(userID, username));
      setIsLoading(false);
    };
    getInfo();
  }, [dispatch]);

  const renderListTitle = (list) => {
    return (
      <View
        style={{
          backgroundColor: list.index == selectedListIndex ? Colors.secondary : "white",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
        }}
      >
        <Text onPress={() => setSelectedListIndex(list.index)} style={{ margin: 5 }}>
          {list.item.nameOfRankings}
        </Text>
      </View>
    );
  };

  const renderListItem = (listItem) => {
    return (
      <View style={{ flexDirection: "row", height: 150, paddingVertical: 10}}>
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
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={2}
            style={{ fontSize: 20, fontWeight: "bold" }}
          >
            {listItem.item.title}
          </Text>
          <Text ellipsizeMode={"tail"} numberOfLines={5}>
            {listItem.item.description}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{flex: 1, alignItems: "center", justifyContent: "center"}} />
  } else if (userInfo.lists instanceof Array && userInfo.lists.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: "40%", alignItems: "center" }}>
          <Text style={{ fontSize: 30, color: Colors.primary }}>
            {userInfo.info.first_name} {userInfo.info.last_name}
          </Text>
          <Text style={{ fontSize: 20, color: Colors.primary }}>{username}</Text>
          <Image
            source={{ uri: userInfo.S3Key }}
            style={styles.profilePicture}
          />
        </View>
        <FlatList
          data={userInfo.lists}
          keyExtractor={(item, index) => Math.random().toString()}
          renderItem={renderListTitle}
          horizontal={true}
          style={{ height: "5%" }}
        />

        <FlatList
          data={userInfo.lists[selectedListIndex].items}
          keyExtractor={(item, index) => Math.random().toString()}
          renderItem={renderListItem}
          style={{ height: "55%", borderColor: "white", borderTopWidth: 1 }}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={{ height: "40%", alignItems: "center" }}>
          <Text style={{ fontSize: 30, color: Colors.secondary }}>
            {userInfo.info.first_name} {userInfo.info.last_name}
          </Text>
          <Text style={{ fontSize: 20, color: Colors.secondary }}>{username}</Text>
          <Image
            source={{ uri: userInfo.S3Key }}
            style={styles.profilePicture}
          />
        </View>
      </View>
    );
  }
};

OutsideUserScreen.navigationOptions = navigationData => {
  const uname = navigationData.navigation.getParam('username')

  return {
    headerTitle: uname
  }
}

const styles = StyleSheet.create({
  profilePicture: {
    resizeMode: "contain",
    height: 200,
    width: 300,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default OutsideUserScreen;
