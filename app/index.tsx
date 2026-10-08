import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Synthetic Solutions
        </Text>
        <Text className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
          Document Edition
        </Text>

        <View className="w-full gap-4">
          <Link href="/canvas" asChild>
            <Pressable className="bg-black dark:bg-white py-4 rounded-2xl active:opacity-80">
              <Text className="text-white dark:text-black text-center text-lg font-semibold">
                Open Infinite Canvas
              </Text>
            </Pressable>
          </Link>

          <Link href="/keys" asChild>
            <Pressable className="border border-zinc-300 dark:border-zinc-700 py-4 rounded-2xl active:opacity-80">
              <Text className="text-zinc-900 dark:text-white text-center text-lg font-semibold">
                Manage Keys
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
