import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getMainFeed, getUserGroups } from "../store/actions/media";
import { login, log_out } from "../store/auth/authActions";
import colors from "../customs_components/Colors";

const LoginScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = () => {
      dispatch(log_out());
    };
    logout();
    setIsLoading(false);
  }, [dispatch]);

  const [isLoading, setIsLoading] = useState(false);

  const log_in = async () => {
    if (usernameInput === "" || passwordInput === "") {
      Alert.alert("Please enter a valid username and password", "", [
        {
          text: "Okay",
          onPress: () => {},
        },
      ]);
    } else {
      setIsLoading(true);
      let action = login(usernameInput, passwordInput);
      try {
        await dispatch(action);
        //await dispatch()
        setIsLoading(false)
        props.navigation.navigate("Home");
      } catch (err) {
        setIsLoading(false)
        Alert.alert("Error logging in", "Please check credentials and try again", [
          {
            text: "Okay",
            onPress: () => {}
          }
        ])
      }
    }
  };

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          animating={isLoading}
        />
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.Screen}
      >
        <Image
          source={require("../assets/Logos/BlirbLogo.png")}
          style={{
            resizeMode: "cover",
            height: 150,
            width: 150,
            paddingBottom: 10,
            marginBottom: 10,
          }}
        ></Image>
        <View>
          <Text style={{ color: "white", fontSize: 30 }}>
            Welcome to Blirb!
          </Text>
          <TextInput
            placeholderTextColor="#202020"
            style={styles.usernameInput}
            placeholder="Username..."
            value={usernameInput}
            onChangeText={(input) => setUsernameInput(input)}
          />
          <TextInput
            placeholderTextColor="#202020"
            style={styles.usernameInput}
            placeholder="Password..."
            value={passwordInput}
            onChangeText={(input) => setPasswordInput(input)}
            secureTextEntry={true}
            onSubmitEditing={log_in}
          />
          <View style={{ alignItems: "center", paddingTop: 20 }}>
            <Button color="white" title="Log In" onPress={log_in} />
            <Text style={{ color: "white", paddingVertical: 5 }}>or</Text>
            <Button
              title="Sign Up"
              onPress={() => {
                props.navigation.navigate({ routeName: "Signup" });
              }}
              color="white"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  usernameInput: {
    height: 50,
    width: 200,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    color: "white",
  },
});

LoginScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Welcome To Blirb!",
    headerLeft: () => null,
  };
};

export default LoginScreen;
