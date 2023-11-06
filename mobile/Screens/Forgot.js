import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet,Text ,Image,TouchableOpacity} from 'react-native';
import Field  from '../components/Field';
const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');


 const validatePassword = (password) => {
  const passwordRegex = /.{8,}/; // Password should be at least 8 characters long
  return passwordRegex.test(password);
};


  const handleSendCode = async () => {
    
    try {
      console.log("Sending verification code...");
      console.log("Email:", email);

      const response = await fetch('http://192.168.0.109:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert('Verification Code Sent', 'Check your email for the verification code.');
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', `Failed to send verification code. ${errorResponse.error}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      console.log("Resetting password...");
      console.log("Email:", email);
      console.log("Verification Code:", verificationCode);
      console.log("New Password:", newPassword);

      const response = await fetch('http://192.168.0.106:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });

      // if (response.ok) {
      //         const responseData = await response.json();
      // const resetToken = responseData.token;
      // const userRole = responseData.role;

      // console.log("Reset password response:", responseData);

      // // Log the user's role
      // // console.log("Role is:", userRole);
      //   console.log("Reset password response:", await response.json());
      //   // console.log("Role is:", role);
      //   Alert.alert('Password Reset Successful', 'Your password has been reset successfully.', [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         navigation.navigate('Storage');
      //       },
      //     },
      //   ]);
      // } else {
      //   const errorResponse = await response.json();
      //   Alert.alert('Error', `Failed to reset password. ${errorResponse.error}`);
      // }


      if (response.ok) {
  const responseData = await response.json();
  const resetToken = responseData.token;
  const userRole = responseData.role;

  console.log("Reset password response:", responseData);

  // Show the "Password Reset Successful" alert
  Alert.alert('Password Reset Successful', 'Your password has been reset successfully.', [
    {
      text: 'OK',
      onPress: () => {
        if (userRole === 'Farmer') {
          navigation.navigate('FarmerHomeScreen'); // Navigate to the Farmer home page
        } else if (userRole === 'Manager') {
          navigation.navigate('ManagerHomeScreen'); // Navigate to the Manager home page
        }
      },
    },
  ]);
} else {
  const errorResponse = await response.json();
  Alert.alert('Error', `Failed to reset password. ${errorResponse.error}`);
}

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
<Text style={styles.header}>RESET PASSWORD</Text>
      <Image
    source={require('../assets/images/ForgetpwdBackground.png')} // Replace with the correct path to your image
    style={styles.resetImage} // Apply custom styles to the image here
          /> 
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {/* <Button title="Send Verification Code" onPress={handleSendCode} /> */}


      <TouchableOpacity onPress={handleSendCode} style={styles.loginButton}>
        <Text style={styles.buttonText}>Send Verification Code</Text>
      </TouchableOpacity>


      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      /> */}
       <Text>Password</Text>
      <Field
        label="password"
        placeholder="Enter your password"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry
      />


      {/* <Button title="Reset Password" onPress={handleResetPassword} /> */}

      <TouchableOpacity onPress={handleResetPassword} style={styles.loginButton}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resetImage: {
        marginLeft: -490, 
        // position: 'fixed',
        top:-20,
    //    height: 231,
    // width: 206,   
  },
   header: {
    // position: 'absolute',
    top: -50,
    marginTop: 30,
    fontWeight: '200',
    color: 'green',
    fontSize: 30,
    alignSelf: 'center',
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
});

export default Forgot;
