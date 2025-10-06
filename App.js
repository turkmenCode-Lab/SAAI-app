import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button } from 'react-native';

const Stack = createStackNavigator();

function Home({ navigation }) {
    return (
        <View>
            <Text>🏠 ChatGPT Home</Text>
            <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
        </View>
    );
}

function Chat() {
    return (
        <View>
            <Text>💬 Chat Screen</Text>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'fade' }}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
