import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {
  SafeAreaView,
  Button,
  Modal,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../customs_components/Colors";
import CreateGroupModal from "./CreateGroup";
import { JoinGroupByCodeModal } from "./joinGroupModal";
import { joinGroupByCode } from "../store/actions/groups";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../customs_components/HeaderButtons";
import GroupSettingsModal from "./groupSettingsModal";
import { setGroupSettingsGroup } from "../store/actions/groups";
import AddUserToGroupModal from "./addUserToGroupScreen";

const ChooseGroupModal = (props) => {
  const dispatch = useDispatch();
  const GroupList = useSelector((state) => state.groupsReducer.groupList);

  const [createGroup, setCreateGroup] = useState(false);
  const [JoinByCode, setJoinByCode] = useState(false);
  const [groupSettings, setGroupSettings] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [selectedGroupID, setSelectedGroupID] = useState(null);
  const [settingsGroup, setSettingsGroup] = useState({
    createdAt: "",
    creatorUserID: null,
    groupDesc: "",
    groupID: null,
    groupJoinCode: "",
    groupMembers: [],
    groupName: "",
    groupS3Key: "https://d3cemh7k7c204q.cloudfront.net/general/default.png",
    updatedAt: "",
  });

  const setGroupSettingsGroup = (group) => {
    setSettingsGroup(group);
    setGroupSettings(true);
  };

  const closeCreateGroup = () => {
    setCreateGroup(false);
  };

  const closeGroupSettings = () => {
    setGroupSettings(false);
  };

  const renderGroup = (Group) => {
    let groupPic = "";
    if (Group.item.groupS3Key != "") {
      groupPic =
        "https://dbgtjb94040g6.cloudfront.net/" + Group.item.groupS3Key;
    } else {
      groupPic = "https://d3cemh7k7c204q.cloudfront.net/general/default.png";
    }

    return (
      <View
        style={{
          borderRadius: 30,
          backgroundColor: colors.secondary,
          margin: 20,
          height: 60,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: groupPic }}
          style={{ resizeMode: "contain", height: 50, width: 50 }}
        />
        <Button
          color="white"
          title={Group.item.groupName.substring(0, 25)}
          onPress={() =>
            props.onChooseGroup(Group.item.groupID, Group.item.groupName)
          }
        />
        <View style={{ flexDirection: "row" }}>
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Menu"
              iconName="settings"
              onPress={() => {
                setGroupSettingsGroup(Group.item);
              }}
            ></Item>
          </HeaderButtons>
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Menu"
              iconName="add"
              onPress={() => {
                setSelectedGroupID(Group.item.groupID);
                setAddMemberVisible(true);
              }}
            ></Item>
          </HeaderButtons>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      style={styles.container}
    >
      <CreateGroupModal
        visible={createGroup}
        onCloseCreateGroup={closeCreateGroup}
      />
      <JoinGroupByCodeModal
        visible={JoinByCode}
        onCloseByCode={() => {
          setJoinByCode(false);
        }}
      />
      <GroupSettingsModal
        visible={groupSettings}
        onCloseGroupSettings={closeGroupSettings}
        goToProfile={() => props.goToProfile()}
        group={settingsGroup}
      />
      <AddUserToGroupModal
        visible={addMemberVisible}
        groupID={selectedGroupID}
        onCloseAddMember={() => setAddMemberVisible(false)}
      />
      <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
        <TouchableHighlight
          onPress={() => props.onChooseGroup("main", "main")}
          style={{
            borderRadius: 30,
            backgroundColor: colors.secondary,
            margin: 20,
            height: "6.25%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            > */}
          <Button
            title="Home"
            color="white"
            onPress={() => props.onChooseGroup("main", "Main")}
          />
          {/* </View> */}
        </TouchableHighlight>
        <View style={{ borderWidth: 0.5, borderColor: "white" }} />
        <View style={{ height: "90%" }}>
          <FlatList
            keyExtractor={(item, index) => item.groupID.toString()}
            numColumns={1}
            data={GroupList}
            renderItem={renderGroup}
          />
        </View>

        {/* <View style={{ borderWidth: 1, borderColor: "white" }} />
        <TouchableHighlight
          onPress={() => setCreateGroup(true)}
          style={{
            borderRadius: 30,
            backgroundColor: colors.secondary,
            margin: 20,
            height: "6.25%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            title="Create Group"
            color="white"
            onPress={() => setCreateGroup(true)}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            setJoinByCode(true);
          }}
          style={{
            borderRadius: 30,
            backgroundColor: colors.secondary,
            margin: 20,
            height: "6.25%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            title="Join Group by Code"
            color="white"
            onPress={() => {
              setJoinByCode(true);
            }}
          />
        </TouchableHighlight> */}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

export default ChooseGroupModal;
