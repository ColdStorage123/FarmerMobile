import React from 'react';
import { Image } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/images/ourlogo.png')} style={styles.logo} />
);

const styles = {
  logo: {
        height: 50,
        width: 50,
      
  },
};

export default Logo;
