import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
 
const FarmerHomeScreen = ({ navigation }) => {
  const [coldStorages, setColdStorages] = useState([]);

  useEffect(() => {
    // Fetch cold storage data from the backend API when the component mounts
    fetchColdStorageData();
  }, []);
 const handleUserIconPress = () => {
    // Navigate to the user's profile screen
    navigation.navigate('Profile'); // Replace 'UserProfile' with the actual name of your profile screen
  };

  const handleOrderDetailsPress = () => {
    // Navigate to the user's profile screen
    navigation.navigate('TrackOrder'); // Replace 'UserProfile' with the actual name of your profile screen
  };
  const handleCurrentOrderDetailsPress = () => {
    // Navigate to the user's profile screen
    navigation.navigate('FarmerAcceptedOrders'); // Replace 'UserProfile' with the actual name of your profile screen
  };
  const fetchColdStorageData = async () => {
    try {
      const response = await fetch('http://192.168.0.109:3000/accepted-storages'); // Replace with your actual endpoint
      if (response.ok) {
        const data = await response.json();
        setColdStorages(data); // Update state with the fetched data
      } else {
        console.error('Failed to fetch cold storage data');
      }
    } catch (error) {
      console.error('Error fetching cold storage data:', error);
    }
  };

  const handleColdStoragePress = (managerid) => {
    // Navigate to a screen where the user can book the selected cold storage
    navigation.navigate('OrderPlacement', { managerid });
  };

  const renderColdStorageCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.coldStorageName}</Text>
      <SwiperFlatList
        autoplay
        autoplayDelay={3000}
        autoplayLoop
        index={0}
        showPagination
      >
        {item.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }} // Assuming item.images is an array of image URLs
            style={styles.carouselImage}
          />
        ))}
      </SwiperFlatList>
      <Text>{item.description}</Text>
      <Text>Capacity: {item.capacity} tons</Text>
      <Text>Location: {item.location}</Text>
      {/* addition */}
      <Text>Manager Id: {item.managerid}</Text>
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => handleColdStoragePress(item.managerid)}
      >
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userIconContainer}>
          <TouchableOpacity onPress={handleUserIconPress}>
           <Image
        source={require('../assets/images/profile.png')} // or use a remote URL
        style={styles.image}
      />
          </TouchableOpacity>
          <Text style={styles.userText} onPress={handleUserIconPress}>
            Profile
          </Text>
        </View>


  <View style={styles.userIconContainer}>
          <TouchableOpacity onPress={handleUserIconPress}>
           {/* <Image
        source={require('../assets/images/profile.png')} // or use a remote URL
        style={styles.image}
      /> */}
            
             <Text style={styles.userText} onPress={handleOrderDetailsPress}>
            Track Order
          </Text>
          </TouchableOpacity>
           <TouchableOpacity onPress={handleUserIconPress}>
           {/* <Image
        source={require('../assets/images/profile.png')} // or use a remote URL
        style={styles.image}
      /> */}
            
             <Text style={styles.userText} onPress={handleCurrentOrderDetailsPress}>
            Current Orders
          </Text>
          </TouchableOpacity>
         
        </View>

        <Text style={styles.title}>Available Cold Storages</Text>
      </View>
      <FlatList
        data={coldStorages}
        renderItem={renderColdStorageCard}
        keyExtractor={(item) => item._id}
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'green',
    padding: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
carouselImage: {
  width: '100%',
  height: 200, // Adjust the height as needed
  resizeMode: 'cover',
  borderRadius: 8,
},

  orderButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
  },
    image: {
    height: 24,
    width: 24,
  },
});

export default FarmerHomeScreen;
