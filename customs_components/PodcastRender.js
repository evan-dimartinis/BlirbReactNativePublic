import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Linking,
  FlatList,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import Colors from "./Colors";
import { useDispatch, useSelector } from "react-redux";
import { endorseRecommendation } from "../store/actions/media";
import { Ionicons } from "@expo/vector-icons";
import { addPodcastToList, getUserLists } from "../store/actions/lists";
import { getUserInfo } from "../store/actions/user";


export const PodcastRender = (props) => {
  const dispatch = useDispatch();

  const [isAddingToList, setIsAddingToList] = useState(false)
  const [showLists, setShowLists] = useState(false)
  const [endorseRec, setEndorseRec] = useState("Endorse");
  const [endorsedButtonColor, setEndorsedButtonColor] = useState(
    Colors.primary
  );
  const [endorsementsLength, setEndorsementsLength] = useState(0);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [descTextShown, setDescTextShown] = useState(false); //To show ur remaining Text
  const [descLengthMore, setDescLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const toggleDescNumberOfLines = () => {
    //To toggle the show text or hide it
    setDescTextShown(!descTextShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 3); //to check the text is more than 4 lines or not
  }, []);

  const onDescTextLayout = useCallback((e) => {
    setDescLengthMore(e.nativeEvent.lines.length >= 3);
  }, []);

  const username = useSelector((state) => state.authReducer.user.username);

  useEffect(() => {
    props.rec.endorsements.forEach((endorsement) => {
      setEndorsementsLength(endorsementsLength + 1);
      if (endorsement.username.toLowerCase() === username.toLowerCase()) {
        setEndorseRec("Endorsed!");
        setEndorsedButtonColor(Colors.secondary);
      }
    });
  }, []);

  const endorse = async () => {
    try {
      await dispatch(endorseRecommendation(props.rec.recID_id));

      if (endorseRec === "Endorse") {
        setEndorseRec("Remove Endorsement");
        setEndorsementsLength(endorsementsLength + 1);
      } else {
        setEndorsementsLength(endorsementsLength - 1);
        setEndorseRec("Endorse");
      }
      endorsedButtonColor == Colors.primary
        ? setEndorsedButtonColor(Colors.secondary)
        : setEndorsedButtonColor(Colors.primary);
    } catch (err) {
      Alert.alert("Couldn't endorse recommendation", "Try again later", [
        {
          text: "Okay",
        },
      ]);
    }
  };

  return (
    <View style={{backgroundColor: Colors.primary}}>
      <View style={{margin: 10, backgroundColor: "white", borderRadius: 10}}>
      <Text style={styles.recTitle} numberOfLines={2} ellipsizeMode="tail">
        {props.rec.title}
      </Text>
      <View style={styles.gridItem}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: props.rec.imageURL }} style={styles.image} />
          <Text
            style={{
              backgroundColor: "gold",
              position: "absolute",
              right: 8,
              top: 0,
              padding: 5,
              fontSize: 20,
            }}
          >
            {endorsementsLength}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Ionicons name="radio" size={20} color="black" />
          <Button title={showLists ? "Hide Lists" : "Add to list"} color={Colors.primary} onPress={() => setShowLists(!showLists)} />
        </View>
        { showLists ? isAddingToList ? <ActivityIndicator size="small" /> : <FlatList
            data={props.lists}
            renderItem={props.renderListName}
            keyExtractor={(item, index) => item.id}
            numColumns={2}
          /> : null}
          <Text style={{ color: "black" }} numberOfLines={descTextShown ? undefined: 3} onTextLayout={onDescTextLayout}>{props.rec.description}</Text>
            {descLengthMore ? (
              <Text
                onPress={toggleDescNumberOfLines}
                style={{
                  lineHeight: 21,
                  marginTop: 10,
                  textAlign: "center",
                  color: Colors.primary,
                }}
              >
                {descTextShown ? "Read less..." : "Read more..."}
              </Text>
            ) : null}
          <Text style={{ padding: 3 }}>{props.rec.recRating}/10</Text>

          <View style={{ backgroundColor: endorsedButtonColor }}>
            <Button color="white" title={endorseRec} onPress={endorse}></Button>
          </View>
          <View
            style={{
              backgroundColor: "#1DB954",
              borderRadius: 20,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{ color: "black", textAlign: "center" }}
              onPress={() => {
                Linking.openURL(props.rec.externalURL);
              }}
            >
              Listen on Spotify
            </Text>
          </View>
        </View>
      </View>
      <View>
      <Text
              style={{ fontSize: 17, color: Colors.secondary, textAlign: "center" }}
              numberOfLines={3}
              ellipsizeMode="tail"
              onPress={() => props.goToUser()}
            >
              {props.rec.recUsername} </Text>
              <Text
                style={{ color: "black", padding: 3, textAlign: "center", fontSize: 17 }}
                ellipsizeMode={"tail"}
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 3}
              >
                {props.rec.recDesc}
              </Text>
              {lengthMore ? (
              <Text
                onPress={toggleNumberOfLines}
                style={{
                  lineHeight: 21,
                  marginTop: 10,
                  textAlign: "center",
                  color: Colors.primary,
                }}
              >
                {textShown ? "Read less..." : "Read more..."}
              </Text>
            ) : null}
            
        <Button
          title="See All Comments"
          color={Colors.primary}
          onPress={() => props.showComments(props.rec.groupRecID)}
        />
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingLeft: 5,
    paddingRight: 5,
  },
  image: {
    height: 200,
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
    textAlign: "center",
    marginTop: 8,
    marginBottom: 5
  },
  detailsContainer: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "60%",
    height: "100%"
  },
});

export default PodcastRender;
