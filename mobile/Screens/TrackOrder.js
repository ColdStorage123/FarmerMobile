import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrackOrder = () => {
  const [userOrders, setUserOrders] = useState([]);
  
  useEffect(() => {
    // Fetch the user's ID from AsyncStorage
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Fetch order details for the user with the retrieved ID
          fetchUserOrders(userId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    
    fetchUserId();
  }, []);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://192.168.0.109:3000/farmerorders?farmerId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
      } else {
        console.error('Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Your Order Details </Text>
      <Text>Crop Quantity: {item.cropQuantity}</Text>
      <Text>Start Date: {item.selectedStartDate}</Text>
      <Text>End Date: {item.selectedEndDate}</Text>
      <Text>Storage Days: {item.storageDays}</Text>
      <Text>Status: {item.status}</Text>
       
      {/* Add more order details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={userOrders}
        renderItem={renderOrderItem}
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
  orderContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Add more styles as needed
});

export default TrackOrder;
