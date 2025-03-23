import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderProvider } from './context/OrderContext.native';
import { CardStyleInterpolators } from '@react-navigation/stack';

// Import screens - using require to avoid TypeScript module resolution issues
const WelcomeScreen = require('./screens/WelcomeScreen').default;
const ProductBrowsingScreen = require('./screens/ProductBrowsingScreen').default;
const ProductDetailScreen = require('./screens/ProductDetailScreen').default;
const QuantitySelectionScreen = require('./screens/QuantitySelectionScreen').default;
const CustomerSelectionScreen = require('./screens/CustomerSelectionScreen').default;
const OrderConfirmationScreen = require('./screens/OrderConfirmationScreen').default;
const PaymentSelectionScreen = require('./screens/PaymentSelectionScreen').default;

// Create stack navigator
const Stack = createStackNavigator();

// Configure animations for smoother transitions
const screenOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  animationEnabled: true
};

const App = () => {
  return (
    <SafeAreaProvider>
      <OrderProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Welcome"
            screenOptions={screenOptions}
          >
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
            />
            <Stack.Screen 
              name="ProductBrowsing" 
              component={ProductBrowsingScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen 
              name="QuantitySelection" 
              component={QuantitySelectionScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
              }}
            />
            <Stack.Screen 
              name="CustomerSelection" 
              component={CustomerSelectionScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen 
              name="OrderConfirmation" 
              component={OrderConfirmationScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen 
              name="PaymentSelection" 
              component={PaymentSelectionScreen} 
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </OrderProvider>
    </SafeAreaProvider>
  );
};

export default App;
