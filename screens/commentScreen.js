import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Keyboard,
} from "react-native";
import CommentComponent from "../customs_components/comment";
import {
  submitComment,
  getComments,
  replyToComment,
} from "../store/actions/comments";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../customs_components/Colors";

const commentScreen = (props) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.commentsReducer.comments);

  const groupRecID = props.navigation.getParam("groupRecID");

  //const [groupComments, setGroupComments] = useState(comments[0].comments)
  //const [postID, setPostID] = useState(comments[0].post_id);

  //const groupList = comments.map((group) => group.groupName)

  const [commentInput, setCommentInput] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToID, setReplyingToID] = useState(null);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useCallback(() => {
    Keyboard.removeAllListeners();
  }, []);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", showKeyboard);
    const hideListener = Keyboard.addListener("keyboardDidHide", hideKeyboard);
    const load_comments = async () => {
      try {
        await dispatch(getComments(groupRecID));
      } catch (err) {
        Alert.alert("Error Loading comments", "Try again later", [
          {
            text: "Okay",
            onPress: () => {},
          },
        ]);
      }
    };
    load_comments();
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [dispatch]);

  const showKeyboard = (event) => {
    setKeyboardOffset(event.endCoordinates.height);
  };

  const hideKeyboard = (event) => {
    setKeyboardOffset(0);
  };

  const submit = async () => {
    try {
      if (replying) {
        let action = replyToComment(groupRecID, replyingToID, commentInput);
        await dispatch(action);
        await dispatch(getComments(groupRecID));
      } else {
        let action = submitComment(commentInput, groupRecID);
        await dispatch(action);
        await dispatch(getComments(groupRecID));
      }
    } catch (err) {
      Alert.alert("Something went wrong", "try again later", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    } finally {
      setCommentInput("");
      Keyboard.dismiss();
    }
  };

  const replyTo = (first_name, commentID) => {
    setReplyingTo(first_name);
    setReplying(true);
    setReplyingToID(commentID);
  };

  const goToUser = (id, username) => {
    props.navigation.navigate("OutsideUser", {
      id: id,
      username: username,
    });
  };

  const renderComment = (commentObject) => {
    return (
      <CommentComponent
        comment={commentObject}
        toggleShowReplies={() => {}}
        commentDepth={0}
        reply={(first_name, commentID) => {
          replyTo(first_name, commentID);
        }}
        goToUser={(id, username) => goToUser(id, username)}
      />
    );
  };

  /* if (comments.length === 0) {
    return (
      <View>
          <SegmentedControl
          values={groupList}
          selectedIndex={'One'}
          onChange={(event) => {
              setGroupComments(comments[event.nativeEvent.selectedSegmentIndex].comments)
          }}
          />
          <View style={{height: "90%"}}>
              <Text style={{textAlign: "center"}}>No comments yet. Leave one below!</Text>
          </View>
        
        <View style={{ alignItems: "baseline", justifyContent: "flex-start", height: "10%"}}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <TextInput
              value={commentInput}
              onChangeText={(text) => setCommentInput(text)}
              style={styles.commentInput}
            />
            <Text onPress={submit}> Send</Text>
          </View>
        </View>
      </View>
    );
  } else { */
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "baseline" }}>
      {/* <View style={{height: "95%", width: "110%", alignItems: "baseline"}}> */}
      <View style={{ width: "100%", height: "93%" }}>
        <FlatList
        data={comments}
        keyExtractor={(item, index) => Math.random().toString()}
        renderItem={renderComment}
      />
      </View>
      <TextInput
        value={commentInput}
        onChangeText={(text) => setCommentInput(text)}
        style={{
          borderRadius: 10,
          width: "100%",
          height: "7%",
          borderColor: Colors.primary,
          borderWidth: 3,
          position: "absolute",
          bottom: keyboardOffset,
          backgroundColor: "white",
        }}
        placeholder={
          replying ? "Reply to " + replyingTo + "..." : "Leave a comment..."
        }
        returnKeyType="send"
        onSubmitEditing={submit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default commentScreen;
