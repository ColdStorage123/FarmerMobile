// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// const Role = ({navigation}) => {
//   const handleFarmerPress = () => {
//     // Handle farmer icon press here
//     console.log('Farmer icon pressed');
//   };

//   const handleManagerPress = () => {
//     // Handle manager icon press here
//     console.log('Manager icon pressed');
//   };

//   return (
    
    
//     <View style={styles.container}>
    
//       <Text style={styles.header}>Register As</Text>
//       <Text style={styles.header1}>Select Your Role</Text>
//      <View style={styles.iconContainer}>
//   <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.icon}>
//     {/* Replace the 'farmer icon' component below with your own icon component */}
          
//       <Image source={require('../assets/images/Farmer.png')}
//            style={{width: 80, height: 80}}/>
//     <Text style={styles.iconText}>Farmer</Text>
//   </TouchableOpacity>

//   <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.icon}>
//     {/* Replace the 'manager icon' component below with your own icon component */}
//           <Image source={require('../assets/images/Manager.png')}
//            style={{width: 80, height: 80}}/>
         
//     <Text style={styles.iconText}>Manager</Text>
//   </TouchableOpacity>
// </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//   flexDirection: 'row',
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 20,
// },
// icon: {
//   marginRight: 10, // Adjust the value as needed
//   alignItems: 'center',
// },
// iconText: {
//   marginTop: 15, // Adjust the value as needed
//      fontWeight: 'bold',
// },
//   header: {
//     position: 'absolute',
//     top: 2,
//    marginTop: 100 ,
    
//     fontWeight: 'bold',
//     color: "green",
//     fontSize: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header1: {
//       position: 'relative',
//   top: -60,
//   fontSize: 17,
//   justifyContent: 'center',
//   alignItems: 'center',
//   },
// });

// export default Role;


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const handleButtonPress = () => {
    // Navigate to the 'Login' screen when "LOGIN" is pressed
    navigation.navigate('Login');
  };

  const handleSignUpPress = () => {
    // Navigate to the 'Register' screen when "SIGN UP" is pressed
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/images/Farmer.png')}
        style={styles.image}
      /> */}
      <Image
        source={require('../assets/images/Farmer.png')}
        style={styles.backgroundmain}
      />
      <Image
        source={require('../assets/images/radiobtn.png')}
        style={styles.rbtn}
      />

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>
        Empowering Farmers Preserving Harvests
Connect with local ColdStorages to preserve Crops
        </Text>
        <Text style={styles.subText}>
          When there are no official addresses, create your personal address for GPS navigation
        </Text>
      </View>

      <TouchableOpacity onPress={handleButtonPress} style={styles.loginButton}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUpPress}>
        <Text style={styles.signUpText}>
          DON'T HAVE AN ACCOUNT?{'      '}
          <Text style={styles.signUpText1}>SIGN UP</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Customize the background color
  },

  backgroundmain: {
    width: 297,
    height: 268,
    overflow: 'hidden',
    top: 20,
  },
  rbtn: {
    position: 'relative',
    top: 150,
    left: 0,
    width: 37,
    height: 9,
  },
  textContainer: {
    marginTop: 190,
  },
  welcomeText: {
    
    fontWeight: 'bold',
    marginTop: -25,
    color: '#000000b2',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.64,
    lineHeight: 23,
    textAlign: 'center',
  },
  subText: {
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
    color: '#000000b2',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.48,
    lineHeight: 17.3,
    textAlign: 'center',
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
  signUpText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.48,
    lineHeight: 17.3,
    textAlign: 'left',
  },
  signUpText1: {
    color: '#0000ee',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.56,
    lineHeight: 20.2,
    textAlign: 'left',
  },
});

export default WelcomeScreen;
