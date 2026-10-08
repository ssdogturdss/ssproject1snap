import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Synthetic Docs' }} />
        <Stack.Screen name="canvas" options={{ title: 'Infinite Canvas' }} />
        <Stack.Screen name="keys" options={{ title: 'Key Generator' }} />
      </Stack>
    </QueryClientProvider>
  );
}
