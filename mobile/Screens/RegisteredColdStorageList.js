import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const RegisteredColdStorageList = () => {
  const [coldStorages, setColdStorages] = useState([]);

  useEffect(() => {
    // Fetch data from your backend API here
    fetch('http://192.168.0.109:3000/storage')
      .then(response => response.json())
      .then(data => setColdStorages(data))
      .catch(error => console.error('Error fetching cold storages:', error));
  }, []);

  // Render each cold storage as a card
  const renderColdStorage = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.coldStorageName}</Text>
      <Text style={styles.description}>{item.description}</Text>
          {/* Render other details here */}
          
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coldStorages}
        renderItem={renderColdStorage}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4, // For shadow on Android
    shadowColor: 'black', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
});

export default RegisteredColdStorageList;
