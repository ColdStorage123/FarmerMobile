import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StarRating = ({ rating, maxRating, onRatingPress }) => {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= rating;
    
    stars.push(
      <TouchableOpacity key={i} onPress={() => onRatingPress(i)}>
        <MaterialIcons
          name={isFilled ? 'star' : 'star-border'}
          size={30}
          color={isFilled ? 'gold' : 'gray'}
        />
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {stars}
    </View>
  );
};

export default StarRating;
