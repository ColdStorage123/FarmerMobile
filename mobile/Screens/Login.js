import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import Field from '../components/Field';
// import Btn from '../components/btn';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email.trim());
  };

  const validatePassword = (password) => {
    const passwordRegex = /.{8,}/; // Password should be at least 8 characters long
    return passwordRegex.test(password.trim());
  };
  const handleForgotPassword = () => {
  // Get the navigation object using the useNavigation hook
//   const navigation = useNavigation();

  // Navigate to the "ForgotPassword" screen
  navigation.navigate('Forgot'); // Replace 'ForgotPassword' with your actual screen name
  };
    const handleSignUpPress = () => {
    // Navigate to the next screen when "Sign Up" is pressed
    navigation.navigate('Register'); // Replace 'SignUpScreen' with the actual screen name
    };
    
 const handleLogin = async () => {
  if (!validateEmail(email.trim())) {
    Alert.alert('Error', 'Enter a Valid Email');
  } else if (!validatePassword(password.trim())) {
    Alert.alert('Error', 'Enter Valid Password (8 digits)');
  } else {
    try {


      // change
   const yourAuthToken = await AsyncStorage.getItem('token'); 
  const response = await fetch('http://192.168.0.109:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // change
      'Authorization': `Bearer ${yourAuthToken}`,
    },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json();

      if (response.ok) {
    // Assuming you have obtained _id during login


  if (data.token) { 
    await AsyncStorage.setItem('token', data.token);
     await AsyncStorage.setItem('userId', data._id);
console.log("ID is:",data._id);
    console.log("Token is:",data.token);
    // navigation.navigate('Profile');
    console.log("Role is:", data.role);
    if (data.role === 'Farmer') {
      const farmerId = data._id; // This is the _id from the login
      await AsyncStorage.setItem('farmerId', farmerId);
      console.log("farmer + Id:",farmerId);
      navigation.navigate('FarmerHomeScreen'); // Navigate to the Farmer home page
    } else if (data.role === 'Manager') {
      const managerId = data._id; // This is the _id from the login
      await AsyncStorage.setItem('managerId', managerId);
      console.log("manager   + Id:",managerId);
      // await AsyncStorage.setItem('managerId', data._id);
      navigation.navigate('Storage'); // Navigate to the Manager home page
    }
  } else {
    // Handle the case where the response is OK but doesn't contain a token.
    Alert.alert('Error', 'Token not found in response');
  }
} else {
  // Handle the case where the response is not OK.
  Alert.alert('Error', 'Invalid email or password');
}

      
} catch (error) {
  console.error('Error logging in:', error);
  // Handle the case where an error occurred during the fetch.
  Alert.alert('Error', 'Failed to login. Please try again later.');
}

  }
  };

  const handleGoogleLogin = async () => {
    try {
      // Define your client IDs and redirect URI
      const androidClientId = '576088831234-spj75ac0rbm793b6j5d2fns8lig22c4v.apps.googleusercontent.com';
      const iosClientId = '576088831234-evgo7naim0r2bio8s6hjor1j5k9053p9.apps.googleusercontent.com';
       const redirectUri = 'http://192.168.0.108:3000/verify';

      // Determine the appropriate client ID based on the platform
      const clientId =
        Platform.OS === 'android' ? androidClientId : iosClientId;

      const { type, params } = await AuthSession.startAsync({
        authUrl:
          'https://accounts.google.com/o/oauth2/v2/auth?' +
          `client_id=${clientId}` +
          '&response_type=code' +
          '&scope=openid%20profile%20email' +
          `&redirect_uri=${redirectUri}`, // Replace with your redirect URI
      });

      if (type === 'success') {
        const { access_token, id_token } = params;

        // Handle the successful Google Sign-In here
        // You can obtain user information from the id_token
        // and perform any necessary server-side authentication or registration
        // ...

        // Example of storing the access token
        await AsyncStorage.setItem('googleAccessToken', access_token);

        // After successful login, you can navigate to the next screen or perform other actions
        navigation.navigate('NextScreen');
      } else if (type === 'cancel') {
        // Handle the case where the user canceled the Google Sign-In
        Alert.alert('Google Sign-In Canceled');
      } else {
        // Handle errors
        Alert.alert('Error', 'Google Sign-In Failed');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LOGIN</Text>
      {/* <ScrollView contentContainerStyle={styles.formContainer}> */}

      <View Style={styles.formContainer}>
        <Text  >Email</Text>
        <Field
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text>Password</Text>
        <Field
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
</View>
        {/* <Btn
          textColor="white"
          bgColor="green"
          btnLabel="Login"
          style={styles.button}
          press={handleLogin}
        /> */}

        {/* <Btn
          textColor="white"
          bgColor="blue"
          btnLabel="Login with Google"
          style={styles.button}
          press={handleGoogleLogin}
        /> */}

          <TouchableOpacity style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* </ScrollView> */}
      {/* <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.loginText}>Don't have an account? Register Here!</Text>
      </TouchableOpacity> */}


      {/* here */}

      {/* <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity> */}
      
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
          
  {/* <View style={styles.line} />
<View style={styles.line1} /> */}
          <View> 
          <Text style={styles.googleText}> Continue with Google </Text>
          
          </View> 

<View style={styles.touchbuttoncontainer}>
  <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
    <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
      <Image
        source={require('../assets/images/googlelogo.png')} // Replace with your Google logo image
        style={styles.logo}
      />
      <Text style={styles.buttonTextG}>Google</Text>
    </TouchableOpacity>
  </View>
  
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signUpText}>
          DONT HAVE AN ACCOUNT?{'      '}
          <Text style={styles.signUpText1}>REGISTER</Text>
        </Text>
      </TouchableOpacity>


      {/* end */}



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
    // position:'absolute',
  },
  button: {
    marginTop: 16,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  forgotText: {
      color: '#000000',
    fontFamily: 'Montserrat-Regular', // Make sure to load this font
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.32,
    lineHeight: 11.5,
    textAlign: 'center',
    position: 'relative',
    top: 0,
    left: 0,
        // whiteSpace: 'nowrap',
    marginLeft:200,
  },
  
  loginButton: {
    backgroundColor: '#0000ee',
    borderRadius: 5,
    marginTop: 10,
    width: 328,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Helvetica', // Use the appropriate font family
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.64,
    lineHeight: 23,
  },
   line: {
       height: 1,
    // position: 'absolute',
    top: 29.3,
    left: 120,
    width: 84,
    resizeMode: 'cover',
        color: 'red',
    height: 1,
//   width: '20%', // Set the width to fill the parent
  backgroundColor: '0px 2px 4px 0px rgba(0, 0, 0, 0.1);', // You can replace 'red' with your desired color
  marginTop: 120, 
    },
     line1: {
       height: 1,
    // position: 'absolute',
    top: 7.5,
    left: -120,
    width: 84,
    resizeMode: 'cover',
        
    height: 1,
//   width: '20%', // Set the width to fill the parent
  backgroundColor: '0px 2px 4px 0px rgba(0, 0, 0, 0.1);', // You can replace 'red' with your desired color
  marginTop: 20, 
    },
    googleText: {
          color: '#000000',
    fontFamily: 'Inter-Regular', // You may need to load the correct font
    fontSize: 8,
    fontWeight: '400',
    letterSpacing: 0.32,
    lineHeight: 11.5,
      textAlign: 'center',
    marginTop: 50, 
  },
    
    touchbuttoncontainer: {
         flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-between', // Spacing between buttons
      alignItems: 'center', // Vertical alignment
        marginRight:-10,
    top:-20,
    },
    button: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0000ee1a',
    borderRadius: 3,
    height: 40,
    width: 328,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90, // Adjust the margin as needed
  },
  //   onText: {
  //   color: '#000000',
  //   fontFamily: 'Inter-SemiBold', // Replace with the appropriate font family
  //   fontSize: 10,
  //     fontWeight: '400',
  //   left: 0,
  //   letterSpacing: 0.4,
  //     lineHeight: 20.2,
  //     position: 'fixed',
  //   textAlign: 'center',
  // },
    logo: {
        height: 24, // Adjust the logo height as needed
        width: 24, // Adjust the logo width as needed
        marginRight: 8, // Adjust the margin as needed
  },
    
   signUpText: {
     marginTop: 40,
     fontWeight: 'bold',
   color: '#000000',
    fontFamily: 'Helvetica', // Use the appropriate font family
    fontSize: 12,
    fontWeight: '500', // Use '500' for fontWeight if needed
    letterSpacing: 0.48,
    lineHeight: 17.3,
    textAlign: 'left', // Adjust as needed
    // whiteSpace: 'nowrap',
  },
  signUpText1: {
      color: '#0000ee',
    fontFamily: 'Helvetica', // Use the appropriate font family
    fontSize: 14,
    fontWeight: '600', // Use '600' for fontWeight if needed
    letterSpacing: 0.56,
    lineHeight: 20.2,
    textAlign: 'left', // Adjust as needed
    // whiteSpace: 'nowrap', 
   },
});

export default Login;
