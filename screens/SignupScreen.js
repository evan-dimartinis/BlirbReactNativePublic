import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import colors from "../customs_components/Colors";
import { signup, login } from "../store/auth/authActions";

const SignupScreen = (props) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sign_up = async () => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      username !== "" &&
      password !== "" &&
      passwordConfirm !== "" &&
      email !== "" &&
      phoneNumber !== ""
    ) {
      if (password !== passwordConfirm) {
        Alert.alert(
          "Passwords do not match",
          "please check passwords and try again",
          [
            {
              text: "Ok",
              onPress: () => {},
            },
          ]
        );
      } else {
        try {
          setIsLoading(true);
          let action = null
          if (signupCode === "") {
            action = signup(
              firstName,
              lastName,
              username,
              password,
              email,
              phoneNumber,
              "BLANK"
            );
          } else {
            action = signup(
              firstName,
              lastName,
              username,
              password,
              email,
              phoneNumber,
              signupCode
            )
          }

          await dispatch(action);
          await dispatch(login(username, password));
          setIsLoading(false);
          props.navigation.navigate("Home");
        } catch (err) {
          setIsLoading(false);
          if (err.message === "phone number in use") {
            Alert.alert(
              "Phone number already in use",
              "try again with another number",
              [
                {
                  text: "Okay",
                },
              ]
            );
          } else {
            Alert.alert(
              "Error signing up",
              "Please review your information and try again",
              [
                {
                  text: "Okay",
                },
              ]
            );
          }
        }
      }
    } else {
      Alert.alert(
        "All fields not filled",
        "please fill out all fields (except signup code) and try again",
        [
          {
            text: "Ok",
            onPress: () => {},
          },
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  } else {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <TextInput
          placeholderTextColor="#202020"
          placeholder="First Name..."
          style={styles.usernameInput}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Last Name..."
          style={styles.usernameInput}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Username..."
          style={styles.usernameInput}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Password..."
          style={styles.usernameInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Confirm Password..."
          style={styles.usernameInput}
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          secureTextEntry={true}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Email..."
          style={styles.usernameInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Phone Number..."
          style={styles.usernameInput}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <TextInput
          placeholderTextColor="#202020"
          placeholder="Signup Code... (Optional)"
          style={styles.usernameInput}
          value={signupCode}
          onChangeText={(text) => setSignupCode(text)}
        />
        <Button
          color={"white"}
          title="Back to Login"
          onPress={() => {
            props.navigation.navigate({ routeName: "Login" });
          }}
        />
        <Text style={{ color: "white" }}>or</Text>
        <Button color={"white"} title="Sign Up!" onPress={sign_up} />
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  usernameInput: {
    height: 50,
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
});

export default SignupScreen;
