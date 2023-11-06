import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
    },
    card: {
      borderWidth: 1,
      borderRadius: 15,
      padding: 15,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    googleButton: {
      borderRadius: 15,
      overflow: 'hidden',
      marginTop: 3,
    },
    googleButtonGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 5,
    },
    googleButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    googleLogo: {
      width: 24,
      height: 24,
      marginRight: 10,
      borderRadius: 12,
    },
  });

  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "742183956845-ln08ru8d8areff3r91t0isp05024pe16.apps.googleusercontent.com",
    webClientId:
      "742183956845-2mjjboio4u72onfo4k6ohp5guo5pf19s.apps.googleusercontent.com",
    expoClientId:
      "742183956845-cn10vto0ckpcjjom65ssl8vg93bopd3t.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    if (response?.type === "success") {
      getUserInfo(response.authentication.accessToken);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <View style={styles.googleButton}>
          <LinearGradient
            colors={['#E9446A', '#C82651']}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.googleButtonGradient}
          >
            <Image
              source={require('../assets/images/googlelogo.jpg')} // Replace with the path to your Google logo image
              style={styles.googleLogo}
            />
            <Button
              title="Sign in with Google"
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}
              color="transparent"
            />
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.card}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} style={styles.image} />
          )}
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>
            Verified: {userInfo.verified_email ? "yes" : "no"}
          </Text>
          <Text style={styles.text}>Name: {userInfo.name}</Text>
          {/* <Text style={styles.text}>{JSON.stringify(userInfo, null, 2)}</Text> */}
        </View>
      )}
    </View>
  );
}
