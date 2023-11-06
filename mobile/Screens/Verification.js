import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

const Verification = ({ navigation, route }) => {
  const { userData } = route.params;
  const [userCode, setUserCode] = useState('XXXXXX');
  const [verificationCode, setVerificationCode] = useState('');
  const [actualCode, setActualCode] = useState(null);
  const codeInputs = useRef([]);

  useEffect(() => {
    setActualCode(userData[0]?.VerificationCode);
  }, []);

  const handleVerification = () => {
    console.log("email verification code: ", actualCode);
    console.log("user code: ", verificationCode);
    if (verificationCode == 'XXXXXX' || verificationCode == '') {
      Alert.alert('Please enter the verification code.');
      return;
    }

    if (verificationCode == actualCode) {
      const postData = {
        fullName: userData[0]?.fullName,
        email: userData[0]?.email,
        password: userData[0]?.password,
        confirmPassword: userData[0]?.confirmPassword,
        phoneNumber: userData[0]?.phoneNumber,
        role: userData[0]?.role,
      };

      fetch('http://192.168.0.109:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          if (data.message === 'User Registered successfully') {
            alert(data.message);
            navigation.navigate('Login')
          }
          else {
            alert(data.message);
          }
        });
    }
    else {
      Alert.alert('Error', 'Incorrect verification code entered!');
      // Handle incorrect code logic
    }
  };

  const handleChangeCode = (text, index) => {
    setVerificationCode(prevCode => {
      const updatedCode = prevCode.split('');
      updatedCode[index] = text;
      return updatedCode.join('');
    });

    if (text !== '' && index < codeInputs.current.length - 1) {
      codeInputs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <View style={styles.codeContainer}>
        {Array.from({ length: 6 }, (_, index) => (
          <TextInput
            key={index}
            ref={ref => (codeInputs.current[index] = ref)}
            style={styles.codeInput}
            placeholder="-"
            maxLength={1}
            value={verificationCode.charAt(index) || ''}
            onChangeText={text => handleChangeCode(text, index)}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => {
              if (index < codeInputs.current.length - 1) {
                codeInputs.current[index + 1].focus();
              }
            }}
          />
        ))}
      </View>
      <Button title="Verify" onPress={handleVerification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    marginHorizontal: 5,
  },
});

export default Verification;
