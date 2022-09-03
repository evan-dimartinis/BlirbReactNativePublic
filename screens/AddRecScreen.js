import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch, connect } from "react-redux";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";
import {
  searchMoviesTV,
  searchPodcasts,
  searchBooks,
  getPodcastEpisodes,
  clearSearchResults,
} from "../store/actions/search";
import AddRecommendationModal from "./AddRecommendationModal";
import { importRec } from "../store/actions/recommendation";
import colors from "../customs_components/Colors";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";
import CustomHeaderButton from "../customs_components/HeaderButtons";
import { getUserLists } from "../store/actions/lists";
import { PodcastSearchResult } from "../models/podcastSearchResult";
import { setPodcastID } from "../store/actions/podcastID";
import { MovieSearchResult } from "../models/movieSearchResult";
import { TVSearchResult } from "../models/TVsearchResult";
import { BookSearchResult } from "../models/bookSearchResult";
import { PodcastEpisodeSearchResult } from "../models/podcastEpisodeSearchResult";
import Colors from "../customs_components/Colors";

const AddRecScreen = (props) => {
  const dispatch = useDispatch();

  const [isChoosingRecType, setIsChoosingRecType] = useState(true);
  const [recType, setRecType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recSelected, setRecSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaToRec, setMediaToRec] = useState(null);
  const [isTV, setIsTV] = useState(false);

  const results = useSelector((state) => state.searchReducer.Results);

  useEffect(() => {
    const loadLists = () => {
      dispatch(getUserLists());
    };
    loadLists();
  }, []);

  const seePodcastEpisodes = async (id) => {
    try {
      setIsLoading(true);
      dispatch(setPodcastID(id));
      let action = getPodcastEpisodes(id);
      await dispatch(action);
      setIsLoading(false);
      props.navigation.navigate({ routeName: "Episodes" });
    } catch (err) {
      Alert.alert("Something went wrong", "Try again in a moment", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    }
  };

  const toggleIsChoosingRecType = (type) => {
    if (isChoosingRecType) {
      setRecType(type);
      setIsChoosingRecType(false);
    } else {
      setIsChoosingRecType(true);
      setRecType("");
    }
  };

  const selectRec = (rec) => {
    if (recSelected) {
      setRecSelected(false);
      setMediaToRec(null);
    } else {
      const newRec = {
        imageKey: "",
        title: "",
        description: "",
        id: "",
      };
      if (rec instanceof MovieSearchResult) {
          setIsTV(false)
          newRec.description = rec.overview
          newRec.id = rec.id
          newRec.imageKey = rec.poster_path
          newRec.title = rec.title
      } else if (rec instanceof TVSearchResult) {
          setIsTV(true);
          newRec.title = rec.name
          newRec.description = rec.overview
          newRec.id = rec.id
          newRec.imageKey = rec.poster_path
      } else if (rec instanceof BookSearchResult) {
        (newRec.title = rec.title),
          (newRec.description = rec.description),
          (newRec.imageKey = rec.thumbnail),
          (newRec.id = rec.id);
      } else if (rec instanceof PodcastEpisodeSearchResult) {
        (newRec.description = rec.description),
          (newRec.id = rec.id),
          (newRec.imageKey = rec.image),
          (newRec.title = rec.name);
      } else if (rec instanceof PodcastSearchResult) {
        (newRec.title = rec.name),
          (newRec.imageKey = rec.image),
          (newRec.id = rec.id),
          (newRec.description = rec.description);
      }
      setMediaToRec(newRec);
      setRecSelected(true);
    }
  };

  const Search = () => {
    if (searchQuery === "") {
      Alert.alert("Please Enter a Valid Search Term", "", [
        {
          text: "Ok",
        },
      ]);
    } else {
      if (recType === "movie") {
        let action = searchMoviesTV(searchQuery);
        dispatch(action);
      } else if (recType === "podcast") {
        let action = searchPodcasts(searchQuery);
        dispatch(action);
      } else if (recType === "book") {
        let action = searchBooks(searchQuery);
        dispatch(action);
      }
    }
  };

  const renderSearchResult = (result) => {
    if (recType === "movie") {
      if (result.item.media_type === "movie") {
        return (
          <TouchableHighlight onPress={() => selectRec(result.item)}>
            <View style={styles.gridItem}>
              <Image
                source={{ uri: result.item.poster_path }}
                style={styles.Image}
              />
              <Text style={{ textAlign: "center", fontSize: 20, marginTop: 5 }}>{result.item.title}</Text>
            </View>
          </TouchableHighlight>
        );
      } else if (result.item.media_type === "tv") {
        return (
          <TouchableHighlight onPress={() => selectRec(result.item)}>
            <View style={styles.gridItem}>
              <Image
                source={{ uri: result.item.poster_path }}
                style={styles.Image}
              />
              <Text style={{ textAlign: "center", fontSize: 20, marginTop: 5 }}>{result.item.name}</Text>
            </View>
          </TouchableHighlight>
        );
      }
    } else if (recType === "podcast") {
      return (
        <View>
          <TouchableHighlight
            onPress={() => {
              selectRec(result.item);
            }}
          >
            <View style={styles.gridItem}>
              <Image source={{ uri: result.item.image }} style={styles.Image} />
              <Text style={{ textAlign: "center", fontSize: 20, marginTop: 5 }}>{result.item.name}</Text>
            </View>
          </TouchableHighlight>
          <Button
            title="See Episodes =>"
            onPress={() => seePodcastEpisodes(result.item.id)}
            color={Colors.primary}
          />
        </View>
      );
    } else if (recType === "book") {
      return (
        <TouchableHighlight onPress={() => selectRec(result.item)}>
          <View style={styles.gridItem}>
            <Image
              source={{ uri: result.item.thumbnail }}
              style={styles.Image}
            />
            <Text style={{ textAlign: "center", fontSize: 20, marginTop: 5 }}>{result.item.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size={"large"}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      />
    );
  } else if (isChoosingRecType) {
    return (
      <SafeAreaView style={{ alignItems: "center", justifyContent: "center", }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            height: "90%",
            width: "100%"
          }}
        >
          <View 
          style={styles.recTypeView}
          >
            <Button
              title="Movie/TV"
              onPress={() => {
                toggleIsChoosingRecType("movie");
                dispatch(clearSearchResults());
              }}
              color={"white"}
            />
            
          </View>
          <Image source={require("../assets/tmdblogo.png")} resizeMode="contain" style={{ height: 30, width: 120}} />
          <View style={styles.recTypeView}>
            <Button
              title="Podcast"
              onPress={() => {
                toggleIsChoosingRecType("podcast");
                dispatch(clearSearchResults());
              }}
              color={"white"}
            />
          </View>
          <Image source={require("../assets/SpotifyLogo.png")} resizeMode="contain" style={{ height: 30, width: 120}} />
          <View style={styles.recTypeView}>
            <Button
              title="Book"
              onPress={() => {
                toggleIsChoosingRecType("book");
                dispatch(clearSearchResults());
              }}
              color={"white"}
            />
          </View>
          <Image source={require("../assets/googlebookslogo.png")} resizeMode="contain" style={{ height: 30, width: 120}} />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <AddRecommendationModal
          visible={recSelected}
          onCloseModal={selectRec}
          media={mediaToRec}
          mediaType={recType}
          isTV={isTV}
          podcastID={null}
        />
        <View style={styles.topBarContainer}>
          <TextInput
            style={styles.searchbar}
            placeholder="Search..."
            returnKeyType="search"
            onSubmitEditing={Search}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text === "") {
                dispatch(clearSearchResults());
              }
            }}
            clearButtonMode={"always"}
          />
          <Button
            title={"Change Media"}
            onPress={() => toggleIsChoosingRecType("dont matter")}
            style={styles.changeMedia}
          />
        </View>

        <FlatList
          keyExtractor={(item, index) => Math.random()}
          renderItem={renderSearchResult}
          numColumns={2}
          data={results}
          style={styles.results}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  searchbar: {
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 2,
    textAlign: "center",
    width: "65%",
    height: "100%",
  },
  recTypeView: {
    backgroundColor: Colors.secondary,
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    borderRadius: 10,
    margin: "5%"
  },
  Image: {
    height: 150,
    width: 150,
    resizeMode: "contain",
  },
  gridItem: {
    margin: 10,
    justifyContent: "center",
    width: 160,
  },
  topBarContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
    paddingLeft: 3,
  },
  changeMedia: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "blue",
    height: "100%",
  },
  results: {
    height: "90%",
  },
  container: {
    alignItems: "center"
  },
  seeEpisodes: {
    color: colors.secondary,
  },
});

AddRecScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Add Recommendation",
  };
};

export default AddRecScreen;
