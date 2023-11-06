import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Field = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const movePlaceholderAnim = useRef(
    new Animated.Value(props.value ? -25 : 0)
  ).current;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(movePlaceholderAnim, {
      toValue: -25,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!props.value) {
      Animated.timing(movePlaceholderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const interpolatedPlaceholderPos = movePlaceholderAnim.interpolate({
    inputRange: [-15, 0],
    outputRange: [-15, 15],
    extrapolate: "clamp",
  });

  const interpolatedPlaceholderSize = movePlaceholderAnim.interpolate({
    inputRange: [-15, 0],
    outputRange: [10, 13],
    extrapolate: "clamp",
  });

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
  <View>
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.placeholder,
          { top: interpolatedPlaceholderPos },
          { fontSize: interpolatedPlaceholderSize },
        ]}
      >
        {props.placeholder}
      </Animated.Text>
      <TextInput
        {...props}
        style={styles.input}
        secureTextEntry={!showPassword && props.secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor="transparent"
      />
      {props.label === "password" && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Icon
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
</TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 30,
    borderColor: "black",
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 10,
    height: 55,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Roboto",
  },
  iconContainer: {
    marginLeft: -30,
    marginRight: 10,
  },
  placeholder: {
    position: "absolute",
    left: 20,
    color: "gray",
    fontFamily: "Roboto",
  },
});

export default Field;