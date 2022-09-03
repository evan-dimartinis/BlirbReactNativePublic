import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  SafeAreaView,
  Keyboard,
  TextInput,
} from "react-native";
import Colors from "./Colors";

const CommentComponent = (props) => {
  const [showReplies, setShowReplies] = useState(false);
  const [Replying, setReplying] = useState(false);

  const toggleShowReplies = () => {
    props.toggleShowReplies();
    setShowReplies(!showReplies);
  };

  const colors = ["gray", "blue", "orange", "red"];

  const colorToRender = colors[props.commentDepth % 4];

  const renderComments = (comment) => {
    return (
      <CommentComponent
        comment={comment}
        toggleShowReplies={toggleShowReplies}
        commentDepth={props.commentDepth + 1}
        reply={(first_name, commentID) => props.reply(first_name, commentID)}
        goToUser={(id, username) => props.goToUser(id, username)}
      />
    );
  };

  return (
    <View style={{ width: "95%", padding: 15 }}>
      <Text style={{ fontWeight: "bold", width: "90%", fontSize: 15 }} onPress={ () => props.goToUser(props.comment.item.commentUserID, props.comment.item.username)}>
        {props.comment.item.first_name + " " + props.comment.item.last_name}:{" "}
        <Text style={{ fontWeight: "200" }}>
          {props.comment.item.commentBody}
        </Text>
      </Text>

      <Text style={{ textAlign: "center", margin: 5 }} onPress={() => props.reply(props.comment.item.first_name, props.comment.item.commentID)} >
        {"Reply to " + props.comment.item.first_name}
      </Text>

      {props.comment.item.comments != undefined ? (
        <View style={{ marginLeft: 20 }}>
          {props.comment.item.comments.length > 0 ? (
            <Text style={{color: Colors.primary}} onPress={() => setShowReplies(!showReplies)}>
              {showReplies ? "Hide Replies" : "Show Replies"}
            </Text>
          ) : null}
        </View>
      ) : null}

      {showReplies ? (
        <FlatList
          data={props.comment.item.comments}
          keyExtractor={(item, index) => Math.random().toString()}
          renderItem={renderComments}
          style={{ paddingLeft: 10 }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  commentText: {
    fontSize: 15,
  },
});

export default CommentComponent;
