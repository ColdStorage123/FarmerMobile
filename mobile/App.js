import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Role from './Screens/Role';
import Register from './Screens/Register';
import Login from './Screens/Login';
import Logo from './components/logo';
import Forgot from './Screens/Forgot';
import Resetpass from './Screens/Resetpass';
import Profile from './Screens/Profile';
import Verification from './Screens/Verification';
import Storage from './Screens/Storage';
import OrderPlacement from './Screens/OrderPlacement';
import RegisteredColdStorageList from './Screens/RegisteredColdStorageList';
import FarmerHomeScreen from './Screens/FarmerHomeScreen';
import WelcomeScreen from './Screens/Welcome';
import ManagerHomeScreen from './Screens/ManagerHomeScreen'; 
import TrackOrder from './Screens/TrackOrder';
import FarmerAcceptedOrders from './Screens/FarmerAcceptedOrders';
import ReviewForm from './Screens/ReviewForm';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitle: (props) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Logo />
              <Text style={{ marginLeft: 0, fontSize: 18, fontWeight: 'bold' }}>Cold Store</Text>
            </View>
          ),
        }}
      >


         <Stack.Screen name="Welcome" component={WelcomeScreen} />
             <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Verification" component={Verification} />  

        <Stack.Screen name="Login" component={Login} />
       
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="FarmerHomeScreen" component={FarmerHomeScreen} />
         <Stack.Screen name="Profile" component={Profile} /> 
        <Stack.Screen name="ManagerHomeScreen" component={ManagerHomeScreen} />
         
   
    
        
        <Stack.Screen name="Storage" component={Storage} /> 
        
        
        <Stack.Screen name="RegisteredColdStorageList" component={RegisteredColdStorageList} />
     
       
        
        <Stack.Screen name="OrderPlacement" component={OrderPlacement} />
        <Stack.Screen name="TrackOrder" component={TrackOrder} />
        <Stack.Screen name="FarmerAcceptedOrders" component={FarmerAcceptedOrders} />
         <Stack.Screen name="ReviewForm" component={ReviewForm} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
