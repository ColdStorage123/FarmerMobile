// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet ,TouchableOpacity,Image} from 'react-native';

const ManagerHomeScreen = ({ navigation }) => {
  
  const handleUserIconPress = () => {
    // Navigate to the user's profile screen
    navigation.navigate('Profile'); // Replace 'UserProfile' with the actual name of your profile screen
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native!</Text>
      <View style={styles.userIconContainer}>
          <TouchableOpacity onPress={handleUserIconPress}>
           <Image
        source={require('../assets/images/profile.png')} // or use a remote URL
        style={styles.image}
      />
          </TouchableOpacity>
          <Text style={styles.userText} onPress={handleUserIconPress}>
            Profile
          </Text>
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  image: {
    height: 24,
    width: 24,
  },
});

export default ManagerHomeScreen;
