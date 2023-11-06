// import React, { useState } from 'react';
// import { View, Text, TextInput, Button } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { Alert } from 'react-native';

// const ReviewForm = () => {
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState('');
//   const route = useRoute();

//   const handleSubmit = () => {
//     // Validation logic (if needed)
//     fetch('http://192.168.0.109:3000/reviews', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ managerid: route.params.managerid, rating, reviewText }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Review submitted successfully:', data);
//         // Handle success, e.g., show a success message to the user
//       })
//       .catch((error) => {
//         console.error('Error submitting review:', error);
//         // Handle error, e.g., show an error message to the user
//       });
//   };

//   return (
//     <View>
//       <Text style={{ fontSize: 20, fontWeight: 'bold' ,marginTop:10,}}>Share your Experience</Text>
//       <Text>Manager ID: {route.params.managerid}</Text>
//       <Text>Rating:</Text>
//       <TextInput
//         style={{ borderColor: 'gray', borderWidth: 1, padding: 10 }}
//         keyboardType="numeric"
//         value={rating}
//         onChangeText={(text) => setRating(text)}
//       />
//       <Text>Review:</Text>
//       <TextInput
//         style={{ borderColor: 'gray', borderWidth: 1, padding: 10, height: 100 }}
//         multiline
//         value={reviewText}
//         onChangeText={(text) => setReviewText(text)}
//       />
//       <Button title="Submit Review" onPress={handleSubmit} />
//     </View>
//   );
// };

// export default ReviewForm;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
// import StarRating from '../components/StarRating'; // Import the custom star rating component
import StarRating from '../components/StarRating';
import { Alert } from 'react-native';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const route = useRoute();

  const handleSubmit = () => {
    // Validation logic (if needed)
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review.', [
        {
          text: 'OK',
        },
      ]);
      return;
    }

    fetch('http://192.168.0.109:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ managerid: route.params.managerid, rating, reviewText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Review submitted successfully:', data);

        // Show a success alert
        Alert.alert('Review Submitted', 'Your review has been submitted successfully.', [
          {
            text: 'OK',
            onPress: () => {
              // Handle the OK button press if needed
            },
          },
        ]);
      })
      .catch((error) => {
        console.error('Error submitting review:', error);

        // Show an error alert
        Alert.alert('Error', 'An error occurred while submitting your review.', [
          {
            text: 'OK',
            onPress: () => {
              // Handle the OK button press if needed
            },
          },
        ]);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share your Experience</Text>
      <Text style={styles.managerId}>Manager ID: {route.params.managerid}</Text>
      <Text style={styles.label}>Rating:</Text>
      <StarRating
        rating={rating}
        maxRating={5} // Set the maximum number of stars
        onRatingPress={setRating} // Function to update the rating
      />
      <Text style={styles.label}>Review:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={reviewText}
        onChangeText={(text) => setReviewText(text)}
      />
      <Button title="Submit Review" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  managerId: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
});

export default ReviewForm;
