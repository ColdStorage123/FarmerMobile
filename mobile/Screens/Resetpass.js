import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Field from '../components/Field';
import Btn from '../components/btn';

const Resetpass = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /.{8,}/; // Password should be at least 8 characters long
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Enter Valid Password (8 digits)');
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      // Perform login actions
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text>New Password</Text>
        <Field
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword} // Use secureTextEntry based on showPassword state
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={showPassword ? 'gray' : 'black'}
          />
        </TouchableOpacity>

        <Text>Confirm Password</Text>
        <Field
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry={!showPassword}
        />
        <Btn
          textColor="white"
          bgColor="green"
          btnLabel="Update"
          style={styles.button}
          press={handleLogin}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 2,
    marginTop: 30,
    fontWeight: 'bold',
    color: 'green',
    fontSize: 30,
    alignSelf: 'center',
  },
  formContainer: {
    marginTop: 90,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 40,
  },
});

export default Resetpass;
