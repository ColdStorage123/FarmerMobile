

import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert,ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

 
const Storage = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [coldStorageName, setColdStorageName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
 const [phoneNumber, setPhoneNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [managerId, setManagerId] = useState(null);
  const handleDescriptionChange = (text) => {
    // Limit the description to 150 words
    const words = text.trim().split(/\s+/);
    if (words.length <= 150) {
      setDescription(text);
    } else {
      // Show an alert when the maximum limit is reached
      Alert.alert('Description Limit Exceeded', 'You can only enter up to 150 words.');
    }
  };

  const handleCapacityChange = (text) => {
    setCapacity(text);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
  };
  const handlePhoneNumberChange = (text) => {
  const trimmedText = text.trim();
  setPhoneNumber(trimmedText);
  setShowError(trimmedText.length > 0 && trimmedText.length !== 11);
};

    const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11}$/;
    return regex.test(phoneNumber);
  };

  const pickImage = async () => {
    if (images.length >= 6) {
      Alert.alert('Image Limit Reached', 'You can only add up to 6 images.');
      return;
    }

    Alert.alert(
      'Choose an option',
      'Please select an option to add an image',
      [
        {
          text: 'Camera',
          onPress: handleCameraPress,
        },
        {
          text: 'Gallery',
          onPress: handleGalleryPress,
        },
      ],
      { cancelable: true }
    );
  };

  const handleCameraPress = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Please grant camera permissions to take a photo.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync();
    if (!pickerResult.cancelled) {
      const newImage = pickerResult.uri;
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleGalleryPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Please grant camera roll permissions to upload an image.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      const newImage = pickerResult.uri;
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      {index === images.length - 1 && (
        <TouchableOpacity onPress={() => handleDeleteImage(index)} style={styles.deleteButton}>
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderUploadIcon = () => {
    if (images.length < 6) {
      return (
        <TouchableOpacity onPress={pickImage} style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={48} color="blue" />
          <Text style={styles.uploadIconText}>Upload Image</Text>
        </TouchableOpacity>
      );
    } else {
      return null; // Render nothing if the image limit is reached
    }
  };


  // Fetch managerId from AsyncStorage when the component mounts
  

const fetchAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const managerId = await AsyncStorage.getItem('managerId'); // Retrieve managerId
   
    return { token, managerId };
  } catch (error) {
    console.error('Error fetching authentication token:', error);
    return { token: null, managerId: null };
  }
};

// Inside your component function, call this function to get the token:
const [yourAuthToken, setYourAuthToken] = useState('');

useEffect(() => {
  fetchAuthToken().then(({ token, managerId }) => {
    if (token) {
      setYourAuthToken(token);
      setManagerId(managerId); // Set the managerId obtained from AsyncStorage
    }
  });
}, []);


  const validateAndRegister = async () => {
    // Perform validation checks here
    if (coldStorageName.trim() === '' || description.trim() === '' || capacity.trim() === '' || location.trim() === '' || phoneNumber.trim() === '') {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    // Call the handleRegister function to send data to the backend
    console.log('Manager ID:', managerId);
    try {
      // const managerId = await AsyncStorage.getItem('managerId');
      const userData = {
  coldStorageName,
  description,
  capacity,
  location,
  images,
        phoneNumber, // Use 'phoneNumber' instead of 'phonenumber'
         managerid: managerId,
  
};
  console.log('userData:', userData);

      const response = await fetch('http://192.168.0.109:3000/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(userData)
      });
console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to register cold storage. Please try again later.');
      }

      const data = await response.json();
      // Assuming your backend returns a success message upon successful registration
      if (data.message === "Cold storage data stored successfully") {  
        if (response.ok) {
          data.message === "Cold storage data stored successfully"
          navigation.navigate('OrderPlacement');
       }
        Alert.alert('Success', 'Cold Storage Registration Successful!');
        setColdStorageName('');
        setDescription('');
        setCapacity('');
        setLocation('');
        setPhoneNumber('');
        setImages([]); 
      }
      
      else {
        throw new Error('Failed to register cold storage. Please try again later.');
      }
    } catch (error) {
      console.error('Error registering cold storage:', error);
      Alert.alert('Error', 'Failed to register cold storage. Please try again later.');
    }
  };


  return (
     <ScrollView >
      <View style={styles.container}>
      <Text style={styles.title}>Cold Storage Registration</Text>
      <Text style={styles.subtitle}>Please Enter the Name of Your Cold Storage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Cold Storage Name"
        value={coldStorageName}
        onChangeText={(text) => setColdStorageName(text)}
      />
      <Text style={styles.subtitle}>Please Describe Your Cold Storage (Max 150 words)</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Enter Description"
        multiline
        value={description}
        onChangeText={handleDescriptionChange}
      />
      <Text style={styles.subtitle}>Please Enter the Capacity of Your Cold Storage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Storage Capacity in tons"
        value={capacity}
        onChangeText={handleCapacityChange}
      />
      <Text style={styles.subtitle}>Please Enter the Location of Your Cold Storage</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        value={location}
        onChangeText={handleLocationChange}
      />
      <Text style={styles.subtitle}>Manager Phone Number</Text>
      <TextInput
  style={styles.input}
  placeholder="Enter Phone Number Here!"
  value={phoneNumber}
  onChangeText={handlePhoneNumberChange}
/>

{showError && (
  <Text style={styles.errorText}>
    Phone Number should be 11 digits
  </Text>
)}
      <Text style={styles.subtitle}>Please Upload Images of your cold storage</Text>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
      {renderUploadIcon()}
      <TouchableOpacity onPress={validateAndRegister} style={styles.addButton}>
        <Text style={styles.buttonText}>Register Cold Storage</Text>
      </TouchableOpacity>
      </View>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    margin: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  input: {
    width: '85%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  descriptionInput: {
    width: '85%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  uploadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    margin: 2,
  },
  uploadIconText: {
    fontSize: 7,
    color: 'blue',
    marginBottom: 5,
  },
});

export default Storage;

