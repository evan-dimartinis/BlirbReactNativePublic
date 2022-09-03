import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableHighlight,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import colors from "../customs_components/Colors";
import AddRecommendationModal from "./AddRecommendationModal";
import { importRec } from "../store/actions/recommendation";
import { getNextPodcastEpisodes } from "../store/actions/search";

const PodcastEpisodeScreen = (props) => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.searchReducer.podcastEpisodes);
  const podcastID = useSelector((state) => state.searchReducer.podcastID);
  const [episodeToRec, setEpisodeToRec] = useState(null);

  const [recSelected, setRecSelected] = useState(false);

  const selectRec = (rec) => {
    if (recSelected) {
      setRecSelected(false);
    } else {
      let action = importRec(rec);
      dispatch(action);
      setRecSelected(true);
    }
  };

  const renderEpisode = (episode) => {
    return (
      <TouchableHighlight
        onPress={() => {
          setEpisodeToRec(episode.item)
          selectRec(episode.item);
        }}
        style={{ padding: 5 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: episode.item.image }} style={styles.image} />
          <View style={{ width: "80%", paddingLeft: 5 }}>
            <Text style={styles.epTitle}>{episode.item.name}</Text>
            <Text>{Math.round(episode.item.duration_ms / 60000)} min</Text>
            <Text
              style={styles.epDescription}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {episode.item.description}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View styles={styles.pageView}>
      <AddRecommendationModal
        visible={recSelected}
        onCloseModal={selectRec}
        mediaType={"podcast-ep"}
        media={episodeToRec}
      />
      <FlatList
        keyExtractor={(item, index) => Math.random().toString()}
        renderItem={renderEpisode}
        data={episodes}
        numColumns={1}
        onEndReached={async () => {
          await dispatch(getNextPodcastEpisodes())
        }}
        onEndReachedThreshold={0}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  episodeContainer: {
    flexDirection: "row",
    height: 100,
  },
  image: {
    height: 75,
    width: 75,
    resizeMode: "center",
    marginLeft: 3,
    alignSelf: "center",
  },
  epTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 5,
    margin: 5,
  },
  epDescription: {
    fontSize: 15,
    width: "auto",
    margin: 5,
  },
  pageView: {
    color: colors.primary,
  },
});

export default PodcastEpisodeScreen;
