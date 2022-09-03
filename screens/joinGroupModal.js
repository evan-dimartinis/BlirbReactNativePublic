import React, { useState } from "react";
import { TextInput, View, Button, Modal, SafeAreaView, Alert } from "react-native";
import Colors from "../customs_components/Colors";
import { useDispatch } from "react-redux";
import { joinGroupByCode, getUserGroups } from "../store/actions/groups";

export const JoinGroupByCodeModal = (props) => {
    const dispatch = useDispatch()
  const [Code, setCode] = useState("");

  const join = async () => {
    if (Code === "") {
        Alert.alert("Please input valid group join code", "", [
            {
                text: "Okay",
                onPress: () => {}
            }
        ])
    } else {
        let action = joinGroupByCode(Code)
        try {
            await dispatch(action)
            await dispatch(getUserGroups())
            props.onCloseByCode()
        } catch (err) {
            Alert.alert("Something went wrong", "Check group code and try again", [
                {
                    text: "Okay",
                    onPress: () => {}
                }
            ])
        }
    }
  }

  return (
    <Modal visible={props.visible} animationType={"slide"}>
      <SafeAreaView style={{ justifyContent: "flex-start", alignItems: "center", flex: 1, backgroundColor: Colors.primary}}>
        
          <TextInput
          style={{
            borderColor: "black",
            borderRadius: 20,
            borderBottomWidth: 2,
            width: 200,
            padding: 10,
            margin: 10,
            color: "white"
          }}
            placeholder="Group Join Code..."
            value={Code}
            onChangeText={(text) => setCode(text)}
            placeholderTextColor="white"
          />
          <Button title={"Join Group"} color={"white"} onPress={join} />
          <Button title={"Close"} color={"white"} onPress={props.onCloseByCode} />
        
      </SafeAreaView>
    </Modal>
  );
};
