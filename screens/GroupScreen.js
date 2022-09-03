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
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../customs_components/HeaderButtons";
import ChooseGroupModal from "./chooseGroupModal";
import {
  getGroupFeed,
  getGroupRecComments,
  getNextGroupFeed,
} from "../store/actions/groups";
import { getMainFeed, getNextMainFeed } from "../store/actions/media";
import RecommendationModal from "./RecommendationModal";
import Colors from "../customs_components/Colors";
import { getUserGroups } from "../store/actions/groups";
import CommentComponent from "../customs_components/comment";
import CreateGroupModal from "./CreateGroup";
import MovieRender from "../customs_components/MovieRender";
import TvShowRender from "../customs_components/TvShowRender";
import PodcastEpisodeRender from "../customs_components/PodcastEpisodeRender";
import PodcastRender from "../customs_components/PodcastRender";
import BookRender from "../customs_components/BookRender";
import { Ionicons } from "@expo/vector-icons";
import { JoinGroupByCodeModal } from "./joinGroupModal";

const GroupFeedScreen = (props) => {
  const groupID = useSelector((state) => state.groupsReducer.activeGroup.id);
  const dispatch = useDispatch();

  const feed = useSelector((state) => state.mediaReducer.mainFeed);
  const next = useSelector((state) => state.mediaReducer.nextLink);
  const previous = useSelector((state) => state.mediaReducer.previousLinks);
  const current = useSelector((state) => state.mediaReducer.currentLink);
  const lists = useSelector((state) => state.listReducer.lists);

  const [isChoosingGroup, setIsChoosingGroup] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [recChosen, setRecChosen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [nextThreshold, setNextThreshold] = useState(0.1);
  const groupName = useSelector((state) => state.mediaReducer.feedInfo.name);

  const [createGroup, setCreateGroup] = useState(false);
  const [JoinByCode, setJoinByCode] = useState(false);

  

  const getNextFeed = async (nextPrevious) => {
    if (nextPrevious && next != null) {
      try {
        setisLoading(true);
        let action = getNextGroupFeed(groupID, groupName, true);
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
    } else {
      if (previous.length == 1) {
        try {
          setisLoading(true);
          await dispatch(getGroupFeed(groupID, groupName));
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
          await dispatch(getNextGroupFeed(groupID, groupName, false));
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

  const goToProfile = () => {
    props.navigation.push("Profile");
  };

  const goToComments = async(recID) => {
    props.navigation.navigate("Comments", {
      groupRecID: recID
    })
  }

  /* useEffect(() => {
    const loadFeed = async () => {
      setisLoading(true);
      try {
        await dispatch(getGroupFeed(groupID))
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
  }, [dispatch]); */

  const closeRec = () => {
    setRecChosen(false);
  };

  const navToProfile = (userID, username) => {
    props.navigation.navigate("OutsideUser", {
      id: userID,
      username: username,
    });
  };

  const chooseGroup = async (groupID, groupName) => {
    setisLoading(true);
    setIsChoosingGroup(false);
    let action;

    try {
      if (groupID === "main") {
        props.navigation.navigate("Main");
      } else {
        setisLoading(true);
        await dispatch(getGroupFeed(groupID, groupName));
      }
    } catch (err) {
      Alert.alert("Error loading group feed", "Please try again", [
        {
          text: "Okay",
          onPress: () => {}
        }
      ])
    } finally {
      setisLoading(false);
    }
  };

  const renderGridItem = (rec) => {
    if (rec.item.recType === "movie") {
      return <MovieRender lists={lists} rec={rec.item} goToUser={() => {
        navToProfile(rec.item.recCreatorId, rec.item.recUsername);
      }}
      showComments={(recID) => goToComments(recID)} />;
    } else if (rec.item.recType === "tv") {
      return (
        <TvShowRender
        lists={lists}
          rec={rec.item}
          goToUser={() => {
            navToProfile(rec.item.recCreatorId, rec.item.recUsername);
          }}
          showComments={(recID) => goToComments(recID)}
        />
      );
    } else if (rec.item.recType === "podcast-ep") {
      return <PodcastEpisodeRender lists={lists} rec={rec.item} goToUser={() => {
        navToProfile(rec.item.recCreatorId, rec.item.recUsername);
      }}
      showComments={(recID) => goToComments(recID)} />;
    } else if (rec.item.recType === "podcast") {
      return <PodcastRender lists={lists} rec={rec.item} goToUser={() => {
        navToProfile(rec.item.recCreatorId, rec.item.recUsername);
      }}
      showComments={(recID) => goToComments(recID)} />;
    } else if (rec.item.recType === "book") {
      return <BookRender lists={lists} rec={rec.item} goToUser={() => {
        navToProfile(rec.item.recCreatorId, rec.item.recUsername);
      }}
      showComments={(recID) => goToComments(recID)} />;
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
      <SafeAreaView style={{ justifyContent: "flex-start", flex: 1, backgroundColor: Colors.primary }}>
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
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
              <Ionicons style={{position: "absolute", left: 3}} color={"white"} size={25} name="arrow-back-outline" onPress={() => getNextFeed(false)}/>
            ) : null}
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text
                style={{
                  fontSize: 25,
                  paddingRight: 2,
                  color: "white"
                }}
                onPress={() => setIsChoosingGroup(true)}
              >
                {groupName}
              </Text>
              <Ionicons name="caret-down-outline" size={15} color={"white"} onPress={() => setIsChoosingGroup(true)} />
            </View>
          </View>
          <View style={{ height: "8%", backgroundColor: Colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                <View style={{ backgroundColor: Colors.secondary, width: "45%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  <Button title="Create Group" color={"white"} onPress={() => setCreateGroup(true)} />
                </View>
                <View style={{ backgroundColor: Colors.secondary, width: "45%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  <Button title="Join group" color={"white"} onPress={() => setJoinByCode(true)} />
                </View>
          </View>
        <Text style={{ fontSize: 20, padding: 10, textAlign: "center" }}>
          No more recommendations. Tap the '+' in the tab bar to recommend one of your favorites!
        </Text>
        </View>
      </SafeAreaView>
    )
  } else if (feed.length == 0 && previous.length == 0) {
    // NO RECOMMENDATIONS NOTE

    return (
      <SafeAreaView style={{ backgroundColor: Colors.primary, justifyContent: "flex-start", flex: 1 }}>
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
        />
        <ChooseGroupModal
          visible={isChoosingGroup}
          onChooseGroup={chooseGroup}
        />
  <CreateGroupModal
        visible={createGroup}
        onCloseCreateGroup={() => {
          setCreateGroup(false)
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
              {groupName}
            </Text>
            <Ionicons
              name="caret-down-outline"
              size={15}
              color={"white"}
              onPress={() => setIsChoosingGroup(true)}
            />
          </View>
        </View>
        <View style={{ height: "8%", backgroundColor: Colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                <View style={{ backgroundColor: Colors.secondary, width: "45%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  <Button title="Create Group" color={"white"} onPress={() => setCreateGroup(true)} />
                </View>
                <View style={{ backgroundColor: Colors.secondary, width: "45%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                  <Button title="Join group" color={"white"} onPress={() => setJoinByCode(true)} />
                </View>
          </View>
        <Text style={{ fontSize: 20, padding: 10, textAlign: "center" }}>
          No recommendations yet! Tap the '+' in the tab bar to make
          your first recommendation or join a group below!
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

        <View style={{ height: "100%",
              backgroundColor: Colors.primary }}>
          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: Colors.primary,
              borderBottomWidth: 1,
              borderBottomColor: "white",
            }}
          >
            {previous.length > 0 ? (
              <Ionicons style={{position: "absolute", left: 3}} color="white" size={25} name="arrow-back-outline" onPress={() => getNextFeed(false)}/>
            ) : null}
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text
                style={{
                  fontSize: 25,
                  paddingRight: 2,
                  color: "white"
                }}
                onPress={() => setIsChoosingGroup(true)}
              >
                {groupName}
              </Text>
              <Ionicons name="caret-down-outline" size={15} color="white" onPress={() => setIsChoosingGroup(true)} />
            </View>

            <Ionicons name="arrow-forward-outline" size={25} color="white" style={{position: "absolute", right: 3}} onPress={() => getNextFeed(true)}/>
          </View>
          <FlatList
            keyExtractor={(item, index) => Math.random().toString()}
            numColumns={1}
            data={feed}
            renderItem={renderGridItem}
            removeClippedSubviews={true}
          />
        </View>
      </SafeAreaView>
    );
  }
};

/* GroupFeedScreen.navigationOptions = (navData) => {
    return {
      headerTitle: useSelector(state => state.mediaReducer.feedInfo.name),
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="Menu" iconName="menu" onPress={() => {
            
          }}></Item>
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="Menu" iconName="settings" onPress={() => {
            
          }}></Item>
        </HeaderButtons>
      )
    };
  };
 */

const styles = StyleSheet.create({
  gridItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
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
    right: 2,
    backgroundColor: Colors.secondary,
    width: "20%",
    //alignSelf: "center",
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

export default GroupFeedScreen;
