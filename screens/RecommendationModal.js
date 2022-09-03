import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  Modal,
  View,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  FlatList,
} from "react-native";
import CommentComponent from "../customs_components/comment";

const RecommendationScreen = (props) => {
  if (props.rec == null) {
    return <View>
      
    </View>
  }
  if (props.rec.movieInfo !== undefined) {
    let genres = [];
    const init = () => {
      const x = [];
      const split = props.rec.movieInfo.genres
        .substring(1, props.rec.movieInfo.genres.length - 1)
        .split(", ")
        .forEach((genre) => {
          let stripped = genre.substring(1, genre.length - 1);
          x.push(stripped);
        });
      genres = x;
    };

    const commentArray = props.rec.comments[0].comments;

    const renderComment = (commentObject) => {
      return <CommentComponent comment={commentObject} />;
    };

    init();

    return (
      <Modal visible={props.visible} animationType="slide">
        <SafeAreaView style={styles.screen}>
          <ImageBackground
            source={{ uri: props.rec.imageURL }}
            style={{ resizeMode: "contain" }}
          >
            <View style={styles.overlay}>
              <ScrollView>
                <View>
                  <Text
                    style={{
                      fontSize: 40,
                      alignSelf: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {props.rec.title}
                  </Text>
                  <View style={{ position: "absolute", right: "0%" }}>
                    <Button title="X" onPress={() => props.onCloseRec()} />
                  </View>
                </View>

                <Image
                  source={{ uri: props.rec.imageURL }}
                  style={{
                    resizeMode: "center",
                    height: 240,
                    width: 160,
                    alignSelf: "center",
                  }}
                />

                <View style={styles.posterRow}>
                  <View>
                    <ScrollView style={{ maxHeight: 100 }}>
                      <Text style={styles.recDescription}>
                        {props.rec.movieInfo.description}
                      </Text>
                    </ScrollView>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        padding: 20,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        Movie
                      </Text>
                      <Text style={{ color: "white", fontSize: 18 }}>
                        {props.rec.movieInfo.releaseDate.substring(0, 4)}
                      </Text>
                      <Text style={{ color: "white", fontSize: 18 }}>
                        {props.rec.movieInfo.runtime} minutes
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      {genres.join(", ")}
                    </Text>

                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Recommended by: {props.rec.recommenderFirstName}{" "}
                        {props.rec.recommenderLastName}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          textAlign: "center",
                          padding: 10,
                        }}
                      >
                        {props.rec.recommenderDescription}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={{width: "100%", maxWidth: "100%"}}>
                <Text
                  style={{
                    color: "white",
                    alignSelf: "flex-start",
                    fontSize: 20,
                  }}
                >
                  Comments:
                </Text>
                <FlatList
                  data={commentArray}
                  keyExtractor={(item, index) => Math.random().toString()}
                  renderItem={renderComment}
                />
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </Modal>
    );
  } else {
    return (
      <Modal visible={props.visible} animationType="fade">
        <SafeAreaView>
          <Text>Not a movie</Text>
          <Button title="Close Modal" onPress={() => props.onCloseRec()} />
        </SafeAreaView>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  poster: {
    height: 200,
    width: 150,
  },
  posterRow: {
    flexDirection: "row",
  },
  screen: {
    height: "100%",
  },
  overlay: {
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
  },
  recDescription: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
  },
});

export default RecommendationScreen;
