import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
const FarmerAcceptedOrders = ({navigation}) => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completionMessage, setCompletionMessage] = useState(null);
  const isMounted = useRef(true);
const route = useRoute();
// const { managerid } = route.params;

  useEffect(() => {
    // Fetch the user's ID from AsyncStorage
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Fetch all orders for the user with the retrieved ID
          fetchUserOrders(userId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isMounted.current) {
        const updatedOrders = acceptedOrders.map((order) => ({
          ...order,
          timeRemaining: calculateTimeRemaining(order),
        }));
        setAcceptedOrders(updatedOrders);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [acceptedOrders]);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://192.168.0.109:3000/farmerorders?farmerId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Filter the accepted orders from the fetched data
        const acceptedOrders = data.filter((orderItem) => orderItem.status === 'Accepted');
        setAcceptedOrders(acceptedOrders);
      } else {
        console.error('Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  // const calculateTimeRemaining = (order) => {
  //   const startDate = new Date(order.selectedStartDate);
  //   const completionDate = new Date(startDate);
  //   completionDate.setDate(startDate.getDate() + order.storageDays);
  //   const now = new Date();
  //   const timeDifference = completionDate - now;

  //   if (timeDifference <= 0) {
  //     // Handle timer expiration
  //     handleTimerExpiration(order);
  //     return 'Order completed';
  //   }

  //   const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  //   return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  // };

const calculateTimeRemaining = (order) => {
  const startDate = new Date(order.selectedStartDate);
  let completionDate = new Date(startDate);

  if (parseInt(order.storageDays) > 0) {
    completionDate.setDate(startDate.getDate() + parseInt(order.storageDays));
  }

  const now = new Date();
  const timeDifference = completionDate - now;

  if (timeDifference <= 0) {
    // Handle timer expiration
    handleTimerExpiration(order);
    return 'Order completed';
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};


  const handleTimerExpiration = (order) => {
    if (order.timeRemaining === 'Order completed') {
      // Display a completion message when the order is completed
      setCompletionMessage('Your order has been completed.');
    } else {
      // Handle other cases when the timer expires
      setCompletionMessage('Your order time has ended.');
    }
  };

  const handleRemoveCompletionMessage = () => {
    // Clear the completion message by setting it to null
    setCompletionMessage(null);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Your Accepted Order Details</Text>
      <Text>Crop Quantity: {item.cropQuantity}</Text>
      <Text>Start Date: {item.selectedStartDate}</Text>
      <Text>Storage Days: {item.storageDays}</Text>
      <Text>End Date: {item.selectedEndDate}</Text>
      <Text>Status: {item.status}</Text>
      <Text style={styles.timeRemainingText}>Time Remaining: {item.timeRemaining}</Text>
      {item.timeRemaining === 'Order completed' && (
        <TouchableOpacity style={styles.reviewButton} onPress={() => handleReview(item)}>
          <Text style={styles.reviewButtonText}>Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );

const handleReview = (order) => {
  // Implement the review functionality here
  console.log('Review button clicked for order:', order);

  // Navigate to the review form and pass the managerid as a parameter
  navigation.navigate('ReviewForm', { managerid: order.managerid });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Accepted Orders</Text>
      <FlatList
        data={acceptedOrders}
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
  timeRemainingText: {
    fontSize: 16,
    marginTop: 10,
  },
  reviewButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  reviewButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  


});

export default FarmerAcceptedOrders;
