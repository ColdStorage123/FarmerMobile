//screen2 register
import React, { useState } from 'react';
import { ResponseType } from "expo-auth-session"
import { View, StyleSheet,  Alert,Text ,ScrollView,TouchableOpacity} from 'react-native';
 
import Field  from '../components/Field';
import Btn from '../components/btn';
import GoogleSignIn from './GoogleSignIn';
import * as Google from 'expo-auth-session/providers/google'
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState("");
  const [showError, setShowError] = useState(false);
const [selectedRole, setSelectedRole] = useState(''); // Default selection is "Farmer"


  const handlePhoneNumberChange = (text) => {
  const trimmedText = text.trim();
    setPhonenumber(trimmedText);
    setShowError(trimmedText.length > 0 && trimmedText.length !== 11);
  };

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z \s]+$/;
    return regex.test(name);
  };

  const validatename = (Name) => {
    return Name && validateName(Name);
  };


  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11}$/;
    return regex.test(phoneNumber);
  };
  const validatePassword = (password) => {
  const passwordRegex = /.{8,}/; // Password should be at least 8 characters long
  return passwordRegex.test(password);
};


  const validateConfirmPassword = (confirmpassword) => {
    return confirmpassword === password;
  };

const handleRegister = async () => {
  if (!validatename(name)) {
    Alert.alert('Error', 'Enter a Valid first name');
  } else if (!validateEmail(email)) {
    Alert.alert('Error', 'Enter Valid Email');
  } else if (!validatePhoneNumber(phonenumber)) {
    Alert.alert('Error', 'Enter Valid Phone Number (11 digits)');
  } else if (!validatePassword(password)) {
    Alert.alert('Error', 'Enter Valid Password (8 digits)');
  } else if (!validateConfirmPassword(confirmpassword)) {
    Alert.alert('Error', 'Password mismatch (11 digits)');
    
  } else if (selectedRole == '') {
      Alert.alert('Error', 'Please select a Role');
    }
  
  else {
    const userData = {
      fullName: name,
      email: email,
      password: password,
      confirmPassword: confirmpassword,
      phoneNumber: phonenumber,
      role: selectedRole,
    };

    try {
      
      const response = await fetch('http://192.168.0.109:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to register user. Please try again later.');
      }

      const data = await response.json();

      if (data.error === 'Invalid credentials') {
        setShowError('Invalid credentials');
      } else if (data.message === "Verification Code Send to Your Email") {
        console.log(data.userData);
        alert(data.message);
        navigation.navigate('Verification', { userData: data.userData });
        return; // Exit the function here to prevent further execution
      }

      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Error', 'Failed to register user. Please try again later.');
    }
  }
};


   const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  //error for database connection

  //const [errormsg, setErrormsg] = useState();
  return (
    <View style={styles.container}>
 <Text style={styles.header}>Register</Text>
   <ScrollView contentContainerStyle={styles.formContainer}>
     
      <Text>Full Name</Text>
      <Field
       
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Text>Email</Text>
      <Field
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Text>Mobile Number</Text>
     <Field
  label="Mobile Number"
  placeholder="Mobile Number"
  value={phonenumber}
  keyboardType="numeric"
  onChangeText={handlePhoneNumberChange}
  
/>
{showError && (
  <Text style={styles.errorText}>
    Phone Number should be 11 digits
  </Text>
)}

      <Text>Password</Text>
      <Field
        label="password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Text>Confirm Password</Text>
      <Field
        label="password"
        placeholder="Confirm password"
        value={confirmpassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
     

          <Text>Role</Text>
  <Picker
    selectedValue={selectedRole}
    onValueChange={(itemValue, itemIndex) => setSelectedRole(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Farmer" value="Farmer" />
    <Picker.Item label="Manager" value="Manager" />
  </Picker>

      <Btn
              textColor="white"
              bgColor="green"
              btnLabel="Register"
              style={styles.button}
              press={handleRegister}
        />
        
        <View 
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
          }}
          
        />
      
        
  <GoogleSignIn  />
      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.loginText}>Already Have an Account? Login Here!</Text>
      </TouchableOpacity>
   

        </ScrollView>
      </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 1,
    backgroundColor: 'white',
  },
   header: {
    position: 'absolute',
    top: 2,
   marginTop: 30 , 
    fontWeight: 'bold',
    color: "green",
     fontSize: 30,
    alignSelf: 'center',
    
    
  },
   formContainer: {
      marginTop: 80,
    paddingBottom: 20,
  },
   errorText: {
    color: 'red',
    marginTop: 5,
  },
   picker: {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 20,
  paddingHorizontal: 10,
},

});

export default Register;
