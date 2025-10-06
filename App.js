import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';

import { AppTheme } from './src/theme';


const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer theme={AppTheme}>
            <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'fade' }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
