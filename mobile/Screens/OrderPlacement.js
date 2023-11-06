import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

 import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const OrderPlacement = () => {
    const [images, setImages] = useState([]);
  const [cropQuantity, setCropQuantity] = useState('');
  const [storageDays, setStorageDays] = useState('');
  const [userRequirements, setUserRequirements] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isEndCalendarVisible, setIsEndCalendarVisible] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const route = useRoute();
  const { managerid } = route.params;
  
const [showError, setShowError] = useState(false);
  const isValidCropQuantity = (text) => {
  // Regular expression to match numbers with optional decimal point
  const regex = /^\d*\.?\d*$/;
  return regex.test(text);
};
  const wordCount = userRequirements.trim().split(/\s+/).length;
  if (wordCount > 200) {
    Alert.alert('Error', 'Your requirements should not exceed 200 words.');
    return;
  }

  const handleSelectDate = (date) => {
    if (date.type === 'start') {
      setSelectedStartDate(date.dateString);

      if (date.dateString === selectedEndDate) {
        setSelectedEndDate('');
      }
    } else if (date.type === 'end') {
      if (date.dateString === selectedStartDate) {
        return;
      }
      setSelectedEndDate(date.dateString);
    }

    setIsStartCalendarVisible(false);
    setIsEndCalendarVisible(false);
  };

  const handleStorageDaysChange = (days) => {
    if (selectedStartDate && days) {
      const startDate = new Date(selectedStartDate);

      if (!isNaN(startDate)) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(days, 10));
        setSelectedEndDate(endDate.toISOString().split('T')[0]);
      }
    }
  };

  const toggleCalendarVisibility = (calendarType) => {
    if (calendarType === 'start') {
      setIsStartCalendarVisible(!isStartCalendarVisible);
    } else if (calendarType === 'end') {
      setIsEndCalendarVisible(!isEndCalendarVisible);
    }
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
      return null;
    }
  };


const fetchAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const farmerId = await AsyncStorage.getItem('farmerId'); // Retrieve managerId
   
    return { token, farmerId };
  } catch (error) {
    console.error('Error fetching authentication token:', error);
    return { token: null, farmerId: null };
  }
  };
  
  
// Inside your component function, call this function to get the token:
const [yourAuthToken, setYourAuthToken] = useState('');

useEffect(() => {
  fetchAuthToken().then(({ token, farmerId }) => {
    if (token) {
      setYourAuthToken(token);
      setFarmerId(farmerId); // Set the managerId obtained from AsyncStorage
    }
  });
}, []);

 const handleSubmit = async () => {
  if (
    cropQuantity.trim() === '' ||
    selectedStartDate.trim() === '' ||
    storageDays.trim() === '' ||
    userRequirements.trim() === '' ||
    selectedEndDate.trim() === ''
  ) {
    Alert.alert('Error', 'Please fill all fields.');
    return;
  }

  try {
   
    const userData = {
        farmerId: farmerId,
 managerid,
      cropQuantity,
      selectedStartDate,
      storageDays,
      userRequirements,
      images,
      selectedEndDate,
    
    };

    console.log('Submitting userData:', userData); // Log the data being sent

    const response = await fetch('http://192.168.0.109:3000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify(userData),
       
    });

    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to place your order.');
    }

    const data = await response.json();

    if (data.message === 'Your order is successfully added in waiting list for approval') {
      Alert.alert('Success', 'Order Placed Successfully!');
      setImages([]); 
      setCropQuantity('');
      setStorageDays('');
      setUserRequirements('');
      setSelectedStartDate('');
      setSelectedEndDate('');
      setIsStartCalendarVisible(false);
      setIsEndCalendarVisible(false);
    } else {
      throw new Error('Failed to place order. Please try again later.');
    }
  } catch (error) {
    console.error('Error in Placing order:', error);
    Alert.alert('Error', error.message || 'Failed to place order. Please try again later.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Place Your Order</Text>

      <Text style={styles.subtitle}>Enter Crop Quantity (in tons)</Text>
<TextInput
  style={styles.input}
  placeholder="Crop Quantity"
  value={cropQuantity}
  onChangeText={(text) => {
    if (isValidCropQuantity(text)) {
      setCropQuantity(text);
    }
  }}
  keyboardType="numeric"
/>
<Text style={styles.subtitle}>Select Start Date</Text>
      <TouchableOpacity onPress={() => toggleCalendarVisibility('start')}>
        <Text style={styles.dateText}>{selectedStartDate ? selectedStartDate : 'Select start date'}</Text>
      </TouchableOpacity>
      {isStartCalendarVisible && (
        <Calendar
          onDayPress={(day) => handleSelectDate({ dateString: day.dateString, type: 'start' })}
          markedDates={{ [selectedStartDate]: { selected: true, disableTouchEvent: true, selectedColor: 'green' } }}
        />
      )}
      <Text style={styles.subtitle}>Enter Total Storage Days</Text>
      <TextInput
        style={styles.input}
        placeholder="Total Storage Days"
        value={storageDays}
        onChangeText={(text) => {
          setStorageDays(text);
          handleStorageDaysChange(text);
        }}
        keyboardType="numeric"
      />

      <Text style={styles.subtitle}>Enter Your Requirements</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Requirements"
        value={userRequirements}
        onChangeText={setUserRequirements}
        multiline
      />

      

      <Text style={styles.subtitle}> End Date</Text>
      <TouchableOpacity onPress={() => toggleCalendarVisibility('end')}>
        <Text style={styles.dateText}>{selectedEndDate ? selectedEndDate : 'Select end date'}</Text>
      </TouchableOpacity>
      {isEndCalendarVisible && (
        <Calendar
          onDayPress={(day) => handleSelectDate({ dateString: day.dateString, type: 'end' })}
          markedDates={{ [selectedEndDate]: { selected: true, disableTouchEvent: true, selectedColor: 'green' } }}
          minDate={selectedStartDate ? selectedStartDate : undefined}
        />
      )}

      <Text style={styles.subtitle}>Please Upload Images of your crops</Text>
       <View style={styles.imageGrid}>
        {images.map((item, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            {index === images.length - 1 && (
              <TouchableOpacity onPress={() => handleDeleteImage(index)} style={styles.deleteButton}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {renderUploadIcon()}
      </View>
      
      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateText: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'center',
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
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderPlacement;
