import { FlashList } from '@shopify/flash-list';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { Text } from '@/components/nativewindui/Text';

cssInterop(FlashList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

export default function Screen() {
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-neutral-800">
          🖤 NativeWindUI Black Starter
        </Text>
        <Text className="mt-2 text-sm text-gray-400">Start writing your UI here.</Text>
      </View>
    </View>
  );
}
