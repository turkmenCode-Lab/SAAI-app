import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';

function Root() {
    return (
        <SafeAreaProvider style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <App />
        </SafeAreaProvider>
    );
}

registerRootComponent(Root);
