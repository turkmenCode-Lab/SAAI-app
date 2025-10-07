import { DefaultTheme } from '@react-navigation/native';

export const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#000',
        text: '#fff',
        primary: '#A1A1AA',
        secondary: 'rgba(169,87,196,0.5)',
        vitally: '#e9cdff',
    },
};
