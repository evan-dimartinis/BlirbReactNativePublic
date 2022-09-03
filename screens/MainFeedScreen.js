import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Linking,
  TouchableHighlight
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../customs_components/HeaderButtons";
import ChooseGroupModal from "./chooseGroupModal";
import { getGroupFeed } from "../store/actions/groups";
import { getMainFeed, getNextMainFeed } from "../store/actions/media";
import RecommendationModal from "./RecommendationModal";
import Colors from "../customs_components/Colors";
import { getUserGroups, setActiveGroup } from "../store/actions/groups";
import CommentComponent from "../customs_components/comment";
import CreateGroupModal from "./CreateGroup";
import MovieRender from "../customs_components/MovieRender";
import TvShowRender from "../customs_components/TvShowRender";
import PodcastEpisodeRender from "../customs_components/PodcastEpisodeRender";
import PodcastRender from "../customs_components/PodcastRender";
import BookRender from "../customs_components/BookRender";
import { Ionicons } from "@expo/vector-icons";
import { getComments } from "../store/actions/comments";
import { getUserLists, addMovieToList, addPodcastEpisodeToList, addPodcastToList, addTvShowToList } from "../store/actions/lists";
import { JoinGroupByCodeModal } from "./joinGroupModal";
import { addBookToList } from "../store/actions/lists";
import { getUserInfo } from "../store/actions/user";

const MainFeedScreen = (props) => {
  const dispatch = useDispatch();

  const feed = useSelector((state) => state.mediaReducer.mainFeed);
  const next = useSelector((state) => state.mediaReducer.nextLink);
  const previous = useSelector((state) => state.mediaReducer.previousLinks);
  const cstate = useSelector((state) => state.mediaReducer);
  const lists = useSelector((state) => state.listReducer.lists);

  const [isChoosingGroup, setIsChoosingGroup] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [recChosen, setRecChosen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [nextThreshold, setNextThreshold] = useState(0.1);
  const [createGroup, setCreateGroup] = useState(false);
  const [JoinByCode, setJoinByCode] = useState(false);

  const getNextFeed = async (nextPrevious) => {
    if (nextPrevious && next != null) {
      try {
        setisLoading(true);
        let action = getNextMainFeed(true);
        await dispatch(action);
        setisLoading(false);
      } catch (err) {
        setisLoading(false);
        Alert.alert("Sorry, we couldn't load more recommendations", "", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      }
    } else if (!nextPrevious) {
      if (previous.length == 1) {
        try {
          setisLoading(true);
          await dispatch(getMainFeed());
          setisLoading(false);
        } catch (err) {
          Alert.alert("Sorry, we couldn't load more recommendations", "", [
            {
              text: "Okay",
              onPress: () => {},
            },
          ]);
        }
      } else {
        try {
          setisLoading(true);
          await dispatch(getNextMainFeed(false));
          setisLoading(false);
        } catch (err) {
          setisLoading(false);
          Alert.alert("Sorry, we couldn't load more recommendations", "", [
            {
              text: "Okay",
              onPress: () => {},
            },
          ]);
        }
      }
    }
  };

  const navToProfile = (userID, username) => {
    props.navigation.navigate("OutsideUser", {
      id: userID,
      username: username,
    });
  };

  const goToProfile = () => {
    props.navigation.push("Profile");
  };

  const goToComments = async (recID) => {
    props.navigation.navigate("Comments", {
      groupRecID: recID,
    });
  };

  useEffect(() => {
    const loadFeed = async () => {
      setisLoading(true);
      try {
        await dispatch(getMainFeed());
        await dispatch(getUserGroups());
        await dispatch(getUserLists());
      } catch (err) {
        Alert.alert("An error occured", "try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      }

      setisLoading(false);
    };
    loadFeed();
  }, [dispatch]);

  const closeRec = () => {
    setRecChosen(false);
  };

  const chooseGroup = async (groupID, groupName) => {
    setisLoading(true);
    setIsChoosingGroup(false);
    let action;
    if (groupID === "main") {
      action = getMainFeed();
      try {
        await dispatch(action);
      } catch (err) {
      } finally {
        setisLoading(false);
      }
    } else {
      try {
        props.navigation.navigate({
          routeName: "Group",
          groupName: groupName,
        });
        dispatch(getGroupFeed(groupID, groupName));
      } catch (err) {
        Alert.alert(
          "Sorry!",
          "Could not load group feed, please try again later",
          [
            {
              text: "Okay",
              onPress: () => {},
            },
          ]
        );
      }
    }
  };

  const addToList = async (listID, mediaID, mediaType, parentPodID) => {
    try {
      setisLoading(true);
      if (mediaType == "book") {
        await dispatch(addBookToList(mediaID, listID));
      } else if (mediaType == "movie") {
        await dispatch(addMovieToList(mediaID, listID))
      } else if (mediaType == "podcast-ep") {
        await dispatch(addPodcastEpisodeToList(parentPodID, mediaID, listID))
      } else if (mediaType == "podcast") {
        await dispatch(addPodcastToList(mediaID, listID))
      } else if (mediaType == "tvShow") {
        await dispatch(addTvShowToList(mediaID, listID))
      }
      await dispatch(getUserInfo());
    } catch (err) {
      Alert.alert("Could not add recommendation to list", "Please try again later", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    } finally {
      setisLoading(false);
    }
  };

  const renderListName = (list, mediaID, mediaType, parentPodID) => {
    return (
      <TouchableHighlight
        onPress={() => addToList(list.item.id, mediaID, mediaType, parentPodID)}
        style={{
          width: "46%",
          height: 30,
          backgroundColor: Colors.primary,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          margin: "2%",
        }}
      >
        <Text numberOfLines={1} style={{ color: "white" }}>
          {list.item.name}
        </Text>
      </TouchableHighlight>
    );
  };

  const renderGridItem = (rec) => {
    if (rec.item.recType === "movie") {
      return (
        <MovieRender
          renderListName={(listItem) => renderListName(listItem, rec.item.mediaID, "movie", null)}
          lists={lists}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
          rec={rec.item}
        />
      );
    } else if (rec.item.recType === "tv") {
      return (
        <TvShowRender
        renderListName={(listItem) => renderListName(listItem, rec.item.mediaID, "tvShow", rec.item.parentPodID)}
          lists={lists}
          rec={rec.item}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
        />
      );
    } else if (rec.item.recType === "podcast-ep") {
      return (
        <PodcastEpisodeRender
          renderListName={(listItem) => renderListName(listItem, rec.item.mediaID, "podcast-ep", rec.item.parentPodID)}
          lists={lists}
          rec={rec.item}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
        />
      );
    } else if (rec.item.recType === "podcast") {
      return (
        <PodcastRender
        renderListName={(listItem) => renderListName(listItem, rec.item.mediaID, "podcast", rec.item.parentPodID)}
          lists={lists}
          rec={rec.item}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
        />
      );
    } else if (rec.item.recType === "book") {
      return (
        <BookRender
          renderListName={(listItem) => renderListName(listItem, rec.item.mediaID, "book", null)}
          lists={lists}
          rec={rec.item}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
        />
      );
    } else {
      return null;
    }
  };

  if (isLoading == true) {
    // IS LOADING

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  } else if (feed.length == 0 && previous.length > 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
        />
        <CreateGroupModal
          visible={createGroup}
          onCloseCreateGroup={() => {
            setCreateGroup(false);
          }}
        />
        <JoinGroupByCodeModal
          visible={JoinByCode}
          onCloseByCode={() => {
            setJoinByCode(false);
          }}
        />
        <View style={{ height: "100%", backgroundColor: Colors.primary }}>
          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              backgroundColor: Colors.primary,
            }}
          >
            {previous.length > 0 ? (
              <Ionicons
                style={{ position: "absolute", left: 3 }}
                color={"white"}
                size={25}
                name="arrow-back-outline"
                onPress={() => getNextFeed(false)}
              />
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 25,
                  paddingRight: 2,
                  color: "white",
                }}
                onPress={() => setIsChoosingGroup(true)}
              >
                Main Feed
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={15}
                color={"white"}
                onPress={() => setIsChoosingGroup(true)}
              />
            </View>
          </View>
          <View
            style={{
              height: "8%",
              backgroundColor: Colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Create Group"
                color={"white"}
                onPress={() => setCreateGroup(true)}
              />
            </View>
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Join group"
                color={"white"}
                onPress={() => setJoinByCode(true)}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              marginTop: 20,
              padding: 10,
              textAlign: "center",
              color: "white",
            }}
          >
            No more recommendations. Tap the '+' in the tab bar to recommend one
            of your favorites!
          </Text>
        </View>
      </SafeAreaView>
    );
  } else if (feed.length == 0 && previous.length == 0) {
    // NO RECOMMENDATIONS NOTE

    return (
      <SafeAreaView
        style={{
          backgroundColor: Colors.primary,
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
        />
        <CreateGroupModal
          visible={createGroup}
          onCloseCreateGroup={() => {
            setCreateGroup(false);
          }}
        />
        <JoinGroupByCodeModal
          visible={JoinByCode}
          onCloseByCode={() => {
            setJoinByCode(false);
          }}
        />
        <View style={{ height: "100%", backgroundColor: Colors.primary }}>
          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              backgroundColor: Colors.primary,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 25,
                  paddingRight: 2,
                  color: "white",
                }}
                onPress={() => setIsChoosingGroup(true)}
              >
                Main Feed
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={15}
                color={"white"}
                onPress={() => setIsChoosingGroup(true)}
              />
            </View>
          </View>
          <View
            style={{
              height: "8%",
              backgroundColor: Colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Create Group"
                color={"white"}
                onPress={() => setCreateGroup(true)}
              />
            </View>
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Join group"
                color={"white"}
                onPress={() => setJoinByCode(true)}
              />
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              marginTop: 20,
              padding: 10,
              textAlign: "center",
              color: "white",
            }}
          >
            No recommendations yet! Tap the '+' tab to make your first
            recommendation!
          </Text>
        </View>
      </SafeAreaView>
    );
  } else {
    // MAIN LIST

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <RecommendationModal
          visible={recChosen}
          onCloseRec={closeRec}
          rec={selectedRec}
        />
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
          goToProfile={goToProfile}
        />
        <CreateGroupModal
          visible={createGroup}
          onCloseCreateGroup={() => {
            setCreateGroup(false);
          }}
        />
        <JoinGroupByCodeModal
          visible={JoinByCode}
          onCloseByCode={() => {
            setJoinByCode(false);
          }}
        />
        <View style={{ height: "100%", backgroundColor: Colors.primary }}>
          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              backgroundColor: Colors.primary,
            }}
          >
            {previous.length > 0 ? (
              <Ionicons
                style={{ position: "absolute", left: 3 }}
                color={"white"}
                size={25}
                name="arrow-back-outline"
                onPress={() => getNextFeed(false)}
              />
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  paddingRight: 2,
                  color: "white",
                }}
                onPress={() => setIsChoosingGroup(true)}
              >
                Main Feed
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={15}
                color={"white"}
                onPress={() => setIsChoosingGroup(true)}
              />
            </View>

            <Ionicons
              name="arrow-forward-outline"
              color={"white"}
              size={25}
              style={{ position: "absolute", right: 3 }}
              onPress={() => getNextFeed(true)}
            />
          </View>
          <View
            style={{
              height: "8%",
              backgroundColor: Colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Create Group"
                color={"white"}
                onPress={() => setCreateGroup(true)}
              />
            </View>
            <View
              style={{
                backgroundColor: Colors.secondary,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Button
                title="Join group"
                color={"white"}
                onPress={() => setJoinByCode(true)}
              />
            </View>
          </View>
          <FlatList
            keyExtractor={(item, index) => Math.random().toString()}
            numColumns={1}
            data={feed}
            renderItem={renderGridItem}
            removeClippedSubviews={true}
            initialNumToRender={4}
          />
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  gridItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    //height: "auto",
    paddingLeft: 5,
    paddingRight: 5,
  },
  image: {
    height: 250,
    width: "100%",
    resizeMode: "center",
  },
  chooseGroupButtonView: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.secondary,
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    height: "8%",
    marginBottom: 10,
    justifyContent: "center",
  },
  chooseGroupButton: {
    alignItems: "center",
  },
  imageContainer: {
    height: "100%",
    width: "40%",
    paddingLeft: 5,
    paddingRight: 8,
  },
  recTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  detailsContainer: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "60%",
  },
});

export default MainFeedScreen;
