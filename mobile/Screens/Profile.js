import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Field from '../components/Field';
//import Btn from '../components/Btn';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isPhoneNumberEditable, setIsPhoneNumberEditable] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.0.109:3000/getUserData', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setNewName(userData.fullName);
        setNewPhoneNumber(userData.phoneNumber);
      } else {
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
    }
  };

  const handleNameEdit = () => {
    setIsNameEditable(true);
  };

  const handlePhoneNumberEdit = () => {
    setIsPhoneNumberEditable(true);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.0.106:3000/updateUserData', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: newName,
          phoneNumber: newPhoneNumber,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully.');
        setIsNameEditable(false);
        setIsPhoneNumberEditable(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Update</Text>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <Field
          label="Name"
          placeholder=""
          value={newName}
          onChangeText={(text) => setNewName(text)}
          editable={isNameEditable}
          style={styles.input}
        />
        {isNameEditable ? (
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Text style={styles.editButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleNameEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Email</Text>
        <Field
          label="Email"
          placeholder=""
          value={user.email}
          editable={false}
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>
        <Field
          label="Phone Number"
          placeholder=""
          value={newPhoneNumber}
          onChangeText={(text) => setNewPhoneNumber(text)}
          editable={isPhoneNumberEditable}
          style={styles.input}
        />
        {isPhoneNumberEditable ? (
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Text style={styles.editButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handlePhoneNumberEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: -30,
    marginRight: 5,
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
