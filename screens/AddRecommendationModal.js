import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MovieSearchResult } from "../models/movieSearchResult";
import { TVSearchResult } from "../models/TVsearchResult";
import { BookSearchResult } from "../models/bookSearchResult";
import { FlatList } from "react-native-gesture-handler";
import colors from "../customs_components/Colors";
import { addMovieRecToGroup } from "../store/actions/groups";
import { PodcastEpisodeSearchResult } from "../models/podcastEpisodeSearchResult";
import { PodcastSearchResult } from "../models/podcastSearchResult";
import { getUserGroups } from "../store/actions/media";
import { getUserLists, searchAddToList } from "../store/actions/lists";
import { getUserInfo } from "../store/actions/user";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../customs_components/Colors";
import NumberPlease from "react-native-number-please"

const AddRecommendationModal = (props) => {
  const dispatch = useDispatch();

  const [recDescription, setRecDescription] = useState("");
  const [recRating, setRecRating] = useState("");
  const [groupsChosen, setGroupsChosen] = useState([]);
  const [listsChosen, setListsChosen] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [userGroups, setUserGroups] = useState(
    useSelector((state) => state.groupsReducer.groupList)
  );

  const [userLists, setUserLists] = useState(
    useSelector((state) => state.listReducer.lists)
  );

  const [podcastID, setPodcastID] = useState(
    useSelector((state) => state.podcastIDReducer.podcastID)
  );

  useEffect(() => {
    const loadLists = async () => {
      setIsLoading(true);
      try {
        await dispatch(getUserLists());
        await dispatch(getUserGroups());
      } catch (err) {
        Alert.alert("An error occured", "try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      }
      setIsLoading(false);
    };
    loadLists();
  }, [dispatch]);

  const possibleRatings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const unbind = () => {
    let groupsChosenCopy = groupsChosen;
    groupsChosenCopy.forEach((group) => {
      removeFromChosenGroups(group);
    });
    listsChosen.forEach((list) => {
      removeFromChosenList(list);
    });
  };

  const Submit = async (id) => {
    let mediaType = props.mediaType;
    if (props.isTV) {
      mediaType = "tv";
    }
    if (
      (recDescription === "" || !possibleRatings.includes(recRating)) &&
      groupsChosen.length > 0
    ) {
      Alert.alert(
        "Invalid Form",
        "Please make sure you have a recommendation description and valid rating (1-10)",
        [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]
      );
    } else {
      try {
        setIsLoading(true);
        if (groupsChosen.length > 0) {
          await dispatch(
            addMovieRecToGroup(
              id,
              recDescription,
              recRating,
              groupsChosen,
              mediaType,
              podcastID
            )
          );
        }
        if (listsChosen.length > 0) {
          await dispatch(
            searchAddToList(listsChosen, id, mediaType, podcastID)
          );
          await dispatch(getUserInfo());
        }
        Alert.alert("Success!", "", [
          {
            text: "Okay",
            onPress: () => {
              props.onCloseModal(null);
            },
          },
        ]);
        setRecDescription("");
        setRecRating("");
      } catch (error) {
        Alert.alert("Something went wrong", "Sorry, try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      } finally {
        setIsLoading(false);
        unbind();
      }
    }
  };

  const addToChosenGroup = (group) => {
    let newGroups = userGroups.slice();
    const index = newGroups.indexOf(group);
    newGroups.splice(index, 1);
    setUserGroups(newGroups);
    let newgroupschosen = groupsChosen.slice();
    newgroupschosen.push(group);
    setGroupsChosen(newgroupschosen);
  };

  const addToChosenList = (list) => {
    let newLists = userLists.slice();
    const index = newLists.indexOf(list);
    newLists.splice(index, 1);
    setUserLists(newLists);
    let newlistschosen = listsChosen.slice();
    newlistschosen.push(list);
    setListsChosen(newlistschosen);
  };

  const removeFromChosenGroups = (group) => {
    let newGroups = userGroups.slice();
    newGroups.push(group);
    setUserGroups(newGroups);
    let newgroupschosen = groupsChosen.slice();
    const index = newgroupschosen.indexOf(group);
    newgroupschosen.splice(index, 1);
    setGroupsChosen(newgroupschosen);
  };

  const removeFromChosenList = (list) => {
    let newlists = userLists.slice();
    newlists.push(list);
    setUserLists(newlists);
    let newlistschosen = listsChosen.slice();
    const index = newlistschosen.indexOf(list);
    newlistschosen.splice(index, 1);
    setListsChosen(newlistschosen);
  };

  const renderUserList = (list) => {
    let chosen = false;
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          padding: 5,
          margin: 5,
          borderRadius: 10,
          width: "90%",
          height: 50,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          color={colors.primary}
          title={list.item.name}
          onPress={() => {
            addToChosenList(list.item);
            chosen = !chosen;
          }}
        ></Button>
      </View>
    );
  };

  const renderchosengroup = (group) => {
    return (
      <View style={styles.chosenGroup}>
        <Button
          color="white"
          title={group.item.groupName}
          onPress={() => removeFromChosenGroups(group.item)}
        />
        <Button
          color="white"
          title="X"
          onPress={() => removeFromChosenGroups(group.item)}
        />
      </View>
    );
  };

  const renderchosenlist = (list) => {
    return (
      <View style={styles.chosenGroup}>
        <Button
          color="white"
          title={list.item.name}
          onPress={() => {
            removeFromChosenList(list.item);
          }}
        ></Button>
        <Button
          color="white"
          title="X"
          onPress={() => removeFromChosenList(list.item)}
        />
      </View>
    );
  };

  const renderUserGroup = (group) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          padding: 5,
          margin: 5,
          borderRadius: 10,
          width: "90%",
          height: 50,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          color={colors.primary}
          title={group.item.groupName}
          onPress={() => {
            addToChosenGroup(group.item);
          }}
        />
      </View>
    );
  };

  const digits = [{ id: "digits", label: "", min: 1, max: 10}]

  if (isLoading == true) {
    return (
      <Modal visible={props.visible} animationType="fade">
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Modal>
    );
  }
  if (props.media == null) {
    return (
      <Modal visible={props.visible} animationType="fade">
        <SafeAreaView>
          <Button
            title="Close Modal"
            onPress={() => props.onCloseModal(null)}
          />
          <Text>No media chosen</Text>
        </SafeAreaView>
      </Modal>
    );
  } else {
    return (
      <Modal visible={props.visible} animationType="fade">
        <ImageBackground
          source={{ uri: props.media.imageKey }}
          style={{
            height: "100%",
            width: "100%",
            resizeMode: "contain",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              height: "100%",
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <Ionicons style={{ alignSelf: "flex-end" }} name={"close"} size={20} color={"white"} onPress={() => props.onCloseModal(null)} />
              <View
                style={{
                  height: "28%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.movieTitle}>{props.media.title}</Text>
                <ScrollView style={styles.descriptionContainer}>
                  <Text style={styles.description}>
                    {props.media.description}
                  </Text>
                </ScrollView>
              </View>
              <Text style={{fontSize: 10, color: "white"}}>*Please fill out both fields if recommending to a group</Text>
              <View
                style={{
                  height: "9%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                <TextInput
                  placeholder="Recommendation Description..."
                  placeholderTextColor="gray"
                  value={recDescription}
                  onChangeText={(text) => setRecDescription(text)}
                  style={styles.descriptionInput}
                />
                {/* <NumberPlease
                  digits={digits}
                  values={recRating}
                  onChange={(val) => setRecRating(val)}
                  pickerStyle={{
                    backgroundColor: "gray"
                  }}
                  itemStyle={{
                    color: "white"
                  }}
                  /> */}
                <TextInput
                  placeholder="1-10"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  value={recRating}
                  onChangeText={(text) => setRecRating(text)}
                  style={styles.ratingInput}
                />
              </View>
              <View
                style={{
                  height: "55%",
                  width: "100%",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "50%",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      height: 210,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Groups</Text>
                    <FlatList
                      data={userGroups}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderUserGroup}
                    />
                  </View>
                  <View
                    style={{
                      height: 210,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Groups Selected</Text>
                    <FlatList
                      data={groupsChosen}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderchosengroup}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: "50%",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      height: 210,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Lists</Text>
                    <FlatList
                      data={userLists}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderUserList}
                    />
                  </View>
                  <View
                    style={{
                      height: 210,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Lists Selected</Text>
                    <FlatList
                      data={listsChosen}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderchosenlist}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: "5%",
                  width: "100%",
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Button
                  title="Push to Groups/Lists"
                  color="white"
                  onPress={() => {
                    Submit(props.media.id);
                  }}
                />
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
        {/* <SafeAreaView style={styles.container}>
          <ImageBackground
            source={{ uri: props.media.imageKey }}
            style={styles.backgroundImage}
          >
            
            <View style={styles.overlay}>
              
              <View style={{ height: "30%" }}>
                
                <Text style={styles.movieTitle}>{props.media.title}</Text>
                <ScrollView style={styles.descriptionContainer}>
                  <Text style={styles.description}>
                    {props.media.description}
                  </Text>
                </ScrollView>
                <Ionicons size={30} name="close" onPress={() => {
                    unbind()
                    props.onCloseModal(null)
                  }} color={"white"} style={{position: "absolute", top: 10, right: 10, backgroundColor: "black"}} />
              </View>

              <View
                style={{
                  height: "10%",
                  justifyContent: "center",
                  paddingBottom: 5,
                }}
              >
                <KeyboardAvoidingView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <TextInput
                    placeholder="Recommendation Description..."
                    value={recDescription}
                    onChangeText={(text) => setRecDescription(text)}
                    style={styles.descriptionInput}
                  />
                  <TextInput
                    placeholder="1-10"
                    keyboardType="number-pad"
                    value={recRating}
                    onChangeText={(text) => setRecRating(text)}
                    style={styles.ratingInput}
                  />
                </KeyboardAvoidingView>
              </View>

              <View style={{ height: "55%", flexDirection: "row" }}>
                <View style={{width: "50%", height: "100%", maxHeight: "100%" }}>
                    <Text numberOfLines={2} style={{ color: "white", width: "90%", height: "10%" }}>
                      Select Groups to Recommend To:
                    </Text>
                    <FlatList
                      data={userGroups}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderUserGroup}
                      style={{
                        height: "auto",
                        width: "100%"
                      }}
                    />
                    <Text style={{ color: "white", width: "100%", height: "10%"}}>
                      Groups to push:
                    </Text>
                    <FlatList
                      data={groupsChosen}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderchosengroup}
                      style={{
                        height: "auto",
                        width: "100%"
                      }}
                    />
                  </View>
                  <View style={{width: "50%", height: "auto", maxHeight: "100%"}}>
                    <Text style={{ color: "white", width: "100%", height: "10%" }}>
                      Select Lists to Add To:
                    </Text>
                    <FlatList
                      data={userLists}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderUserList}
                      style={{width: "100%", height: "auto"}}
                    />
                    <Text style={{ color: "white", width: "100%", height: "10%"}}>
                      Lists to push:
                    </Text>
                    <FlatList
                      data={listsChosen}
                      keyExtractor={(item, index) => Math.random().toString()}
                      renderItem={renderchosenlist}
                      style={{
                        width: "100%",
                        height: "auto"
                      }}
                    />
                  </View>
                </View>
              <View
                style={{ backgroundColor: colors.secondary, height: "5%", position: "absolute", bottom: 0, width: "100%" }}
              >
                <Button
                  title="Push to Groups/Lists"
                  color="white"
                  onPress={() => {
                    Submit(props.media.id);
                  }}
                />
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView> */}
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  backgroundImage: {
    resizeMode: "contain",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: "100%",
  },
  movieTitle: {
    fontSize: 40,
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center"
  },
  description: {
    fontSize: 20,
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    width: 350,
    marginTop: 10,
  },
  descriptionContainer: {
    maxHeight: 200,
  },
  descriptionInput: {
    backgroundColor: "white",
    color: "black",
    height: "95%",
    margin: 10,
    padding: 5,
    borderRadius: 10,
    width: "70%",
  },
  ratingInput: {
    width: "15%",
    height: "95%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  InputContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  groupList: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    width: "90%",
  },
  selectedGroupList: {
    backgroundColor: colors.secondary,
  },
  chosenGroup: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    height: 50,
    width: "90%",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  chosenGroupsContainer: {
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default AddRecommendationModal;
